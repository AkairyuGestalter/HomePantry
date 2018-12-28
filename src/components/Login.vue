<template>
  <v-form novalidate @submit.prevent="validateInput">
    <v-card>
      <v-card-text>
        <v-text-field
          label="Email Address"
          v-model="email"
          :disabled="sending"
          name="email"
          required
          :error-messages="emailErrors"
        />
        <v-text-field
          label="Password"
          v-model="password"
          :disabled="sending"
          @keyup.enter="login"
          :append-icon="showPassword ? 'visibility_off' : 'visibility'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          name="password"
          required
          :error-messages="passwordErrors"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn type="submit" :disabled="sending" color="primary">Log In</v-btn>
      </v-card-actions>
      <v-progress-linear :indeterminate="true" v-show="sending" />
    </v-card>
  </v-form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  email
} from 'vuelidate/lib/validators'
const fb = require('@/config/db')

export default {
  name: 'login',
  mixins: [validationMixin],
  data: () => ({
    sending: false,
    email: null,
    password: null,
    showPassword: false
  }),
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  },
  computed: {
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.required && errors.push('Email address is required.')
      !this.$v.email.email && errors.push('Email address is not valid.')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required.')
      return errors
    }
  },
  methods: {
    login: function () {
      this.sending = true
      fb.auth.signInWithEmailAndPassword(this.email, this.password).then(user => {
        this.$store.commit('setCurrentUser', user.user)
        this.$store.dispatch('fetchUserProfile')
        this.sending = false
        this.$router.replace('Pantry')
      }).catch(err => {
        console.log(err)
        this.$emit('login-error')
        this.sending = false
      })
    },
    validateInput () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.login()
      }
    }
  }
}
</script>

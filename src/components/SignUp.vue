<template>
  <form novalidate @submit.prevent="validateUser">
    <v-card>
      <v-card-text>
        <v-text-field
          label="First Name"
          clearable
          v-model="form.firstName"
          :disabled="sending"
          browser-autocomplete="given-name"
          name="first-name"
          required
          @input="$v.form.firstName.$touch()"
          @blur="$v.form.firstName.$touch()"
          :error-messages="firstNameErrors"
        />
        <v-text-field
          label="Last Name"
          clearable
          v-model="form.lastName"
          :disabled="sending"
          brower-autocomplete="family-name"
          name="last-name"
          required
          @input="$v.form.lastName.$touch()"
          @blur="$v.form.lastName.$touch()"
          :error-messages="lastNameErrors"
        />
        <v-text-field
          label="Email Address"
          clearable
          v-model="form.email"
          :disabled="sending"
          name="email"
          required
          @input="$v.form.email.$touch()"
          @blur="$v.form.email.$touch()"
          :error-messages="emailErrors"
        />
        <v-text-field
          label="Password"
          v-model="form.passwordFirst"
          :disabled="sending"
          :append-icon="showPassword ? 'visibility_off' : 'visibility'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          name="password"
          @input="$v.form.passwordFirst.$touch()"
          @blur="$v.form.passwordFirst.$touch()"
          :error-messages="passwordFirstErrors"
        />
        <v-text-field
          label="Re-enter password"
          v-model="form.passwordCheck"
          :disabled="sending"
          :append-icon="showPassword ? 'visibility_off' : 'visibility'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          name="passwordCheck"
          @input="$v.form.passwordCheck.$touch()"
          @blur="$v.form.passwordCheck.$touch()"
          :error-messages="passwordCheckErrors"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn type="submit" :disabled="sending" color="primary">Sign Up</v-btn>
      </v-card-actions>
      <v-progress-linear :indeterminate="true" v-show="sending" />
    </v-card>
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  email,
  sameAs // eslint-disable-line
} from 'vuelidate/lib/validators'
const fb = require('@/config/db')

export default {
  name: 'signup',
  mixins: [validationMixin],
  data: () => ({
    form: {
      email: null,
      firstName: null,
      lastName: null,
      passwordFirst: null,
      passwordCheck: null
    },
    userSaved: false,
    sending: false,
    lastUser: null,
    showPassword: false
  }),
  validations: {
    form: {
      email: {
        required,
        email
      },
      firstName: {
        required
      },
      lastName: {
        required
      },
      passwordFirst: {
        required
      },
      passwordCheck: {
        required,
        sameAsPassword: sameAs('passwordFirst')
      }
    }
  },
  computed: {
    firstNameErrors () {
      const errors = []
      if (!this.$v.form.firstName.$dirty) return errors
      !this.$v.form.firstName.required && errors.push('First Name is required.')
      return errors
    },
    lastNameErrors () {
      const errors = []
      if (!this.$v.form.lastName.$dirty) return errors
      !this.$v.form.lastName.required && errors.push('Last Name is required.')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.form.email.$dirty) return errors
      !this.$v.form.email.required && errors.push('Email address is required.')
      !this.$v.form.email.email && errors.push('Email address is not valid.')
      return errors
    },
    passwordFirstErrors () {
      const errors = []
      if (!this.$v.form.passwordFirst.$dirty) return errors
      !this.$v.form.passwordFirst.required && errors.push('Password is required.')
      return errors
    },
    passwordCheckErrors () {
      const errors = []
      if (!this.$v.form.passwordCheck.$dirty) return errors
      !this.$v.form.passwordCheck.required && errors.push('You must re-enter your password.')
      !this.$v.form.passwordCheck.sameAsPassword && errors.push('Passwords do not match.')
      return errors
    }
  },
  methods: {
    clearForm () {
      this.$v.$reset()
      this.form.email = null
      this.form.firstName = null
      this.form.lastName = null
      this.form.passwordFirst = null
      this.form.passwordCheck = null
    },
    saveUser: function () {
      this.sending = true

      fb.auth.createUserWithEmailAndPassword(this.form.email, this.form.passwordFirst).then(user => {
        this.$store.commit('setCurrentUser', user.user)
        fb.allUsers.doc(user.user.uid).set({
          FirstName: this.form.firstName,
          LastName: this.form.lastName
        }).then(() => {
          this.$store.dispatch('fetchUserProfile')
          this.sending = false
          this.$router.replace('Pantry')
        }).catch(err => {
          console.log(err)
          this.sending = false
          this.$v.$reset()
        })
      }).catch(err => {
        console.log(err)
        this.sending = false
        this.$v.$reset()
      })
    },
    validateUser () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.saveUser()
      }
    }
  }
}
</script>

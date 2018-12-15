<template>
  <div class="signup">
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-primary md-layout-item md-size 50 md-small-size-100">
        <md-card-header>
          <span class="md-title">Create Account</span>
        </md-card-header>
        <md-card-content>
          <md-field md-clearable :class="getValidationClass('firstName')">
            <label for="first-name">First Name</label>
            <md-input name="first-name" id="first-name" autocomplete="given-name" v-model="form.firstName" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.firstName.required">The first name is required</span>
            <span class="md-error" v-else-if="!$v.form.firstName.minlength">Invalid first name</span>
          </md-field>
          <md-field md-clearable :class="getValidationClass('lastName')">
            <label for="last-name">Last Name</label>
            <md-input name="last-name" id="last-name" autocomplete="family-name" v-model="form.lastName" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.lastName.required">The last name is required</span>
            <span class="md-error" v-else-if="!$v.form.lastName.minlength">Invalid last name</span>
          </md-field>
          <md-field md-clearable :class="getValidationClass('email')">
            <label for="email">Email Address</label>
            <md-input id="email" type="email" name="email" v-model="form.email" :disabled="sending" />
            <span class="md-error" v-if="!$v.form.email.required">An email address is required</span>
            <span class="md-error" v-else-if="!$v.form.email.email">Email address is not valid</span>
          </md-field>
          <md-field :class="getValidationClass('passwordFirst')">
            <label for="passwordFirst">Password</label>
            <md-input id="passwordFirst" name="passwordFirst" v-model="form.passwordFirst" type="password" :disabled="sending"/>
            <span class="md-error" v-if="!$v.form.passwordFirst.required">You must provide a password</span>
          </md-field>
          <md-field :class="getValidationClass('passwordCheck')">
            <label for="passwordCheck">Re-enter password</label>
            <md-input id="passwordCheck" name="passwordCheck" v-model="form.passwordCheck" type="password" :disabled="sending"/>
            <span class="md-error" v-if="!$v.form.passwordCheck.required">You must re-enter your password</span>
            <span class="md-error" v-else-if="!$v.form.passwordCheck.sameAsPassword">Passwords do not match</span>
          </md-field>
          <md-card-actions>
            <md-button class="md-raised" type="submit" :disabled="sending">Sign Up</md-button>
          </md-card-actions>
        </md-card-content>
        <md-progress-bar md-mode="indeterminate" v-if="sending" />
      </md-card>
    </form>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import {
    required,
    email,
    sameAs // eslint-disable-line
  } from 'vuelidate/lib/validators'
  import firebase from 'firebase'
  // import { fireAuth } from '@/config/db'

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
      lastUser: null
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
    methods: {
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]
        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
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

        firebase.auth().createUserWithEmailAndPassword(this.form.email, this.form.passwordFirst).then(
          (user) => {
            this.$router.replace('Pantry')
          },
          (err) => {
            alert('nope ' + err.message)
          }
        )
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

<style lang="scss" scoped>
  .md-app {
   min-height: 100vh !important;
  }
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
</style>

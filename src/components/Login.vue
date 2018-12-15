<template>
  <div class="login">
    <form class="md-layout">
      <md-card class="md-primary md-layout-item md-size 50 md-small-size 100">
        <md-card-header>
          <span class="md-title">Log In</span>
        </md-card-header>
        <md-card-content>
          <md-field md-clearable>
            <label for="email">Email Address</label>
            <md-input id="email" type="email" name="email" v-model="email" :disabled="sending" />
          </md-field>
          <md-field>
            <label for="password">Password</label>
            <md-input id="password" type="password" name="password" v-model="password" :disabled="sending" />
          </md-field>
          <md-card-actions>
            <md-button class="md-raised" @click.native="login" :disabled="sending">Log In</md-button>
          </md-card-actions>
        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
// import { fireAuth } from '@/config/db'
import firebase from 'firebase'

export default {
  name: 'login',
  data: () => ({
    sending: false,
    email: null,
    password: null
  }),
  methods: {
    login: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.$router.replace('Pantry')
        },
        (err) => {
          alert('nope ' + err.message)
        }
      )
    },
    validateInput () {
      this.$v.touch()
      if (!this.$v.$invalid) {
        this.login()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-app {
   min-height: 100vh !important;
  }
</style>

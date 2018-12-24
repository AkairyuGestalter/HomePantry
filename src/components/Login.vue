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
            <md-input id="password" type="password" name="password" v-model="password" :disabled="sending" @keyup.enter="login" />
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
const fb = require('@/config/db')

export default {
  name: 'login',
  data: () => ({
    sending: false,
    email: null,
    password: null
  }),
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
        this.sending = false
      })
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

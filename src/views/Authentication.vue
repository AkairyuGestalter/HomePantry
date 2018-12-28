<template>
  <div>
    <v-toolbar app color="primary" tabs>
      <v-toolbar-title>Home Pantry</v-toolbar-title>
      <v-spacer />
      <v-menu>
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-switch label="Use dark mode?" v-model="isDarkMode" />
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-tabs v-model="currentTab" slot="extension" color="transparent">
        <v-tab key="login">Log In</v-tab>
        <v-tab key="signup">Sign Up</v-tab>
      </v-tabs>
    </v-toolbar>
    <v-content app>
      <v-tabs-items v-model="currentTab">
        <v-tab-item key="login">
          <login @login-error="handleLoginError" />
        </v-tab-item>
        <v-tab-item key="signup">
          <sign-up />
        </v-tab-item>
      </v-tabs-items>
      <v-snackbar bottom :timeout="5000" v-model="showSnackbar">
        {{snackbarMessage}}
      </v-snackbar>
    </v-content>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'

export default {
  name: 'authentication',
  data: () => ({
    currentTab: null,
    showSnackbar: false,
    snackbarMessage: null,
    isDarkMode: true
  }),
  methods: {
    handleLoginError: function () {
      this.snackbarMessage = 'Login failed. Email address or password is incorrect.'
      this.showSnackbar = true
    }
  },
  components: {
    Login,
    SignUp
  },
  computed: {
    ...mapState(['useDarkMode'])
  },
  watch: {
    isDarkMode: function () {
      this.$store.commit('setDarkMode', this.isDarkMode)
    }
  },
  mounted () {
    this.isDarkMode = this.useDarkMode
  },
  store: this.$store
}
</script>

<template>
  <div class="authentication">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary md-dense">
        <div class="md-toolbar-row">
          <span class="md-title">Home Pantry</span>
        </div>
        <div class="md-toolbar-row">
          <md-tabs class="md-primary" @md-changed="onChange">
            <md-tab md-label="Log In" id="tab-login" />
            <md-tab md-label="Sign Up" id="tab-signup" />
          </md-tabs>
        </div>
      </md-app-toolbar>
      <md-app-content>
        <md-content v-if="this.currentTab === 'tab-login'">
          <login />
        </md-content>
        <md-content v-if="this.currentTab === 'tab-signup'">
          <sign-up />
        </md-content>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'

export default {
  name: 'authentication',
  data: () => ({
    currentTab: 'tab-login'
  }),
  components: {
    Login,
    SignUp
  },
  methods: {
    onChange (id) {
      this.currentTab = id
    }
  },
  store: this.$store
}
</script>

<style lang="scss" scoped>
  .md-app {
   min-height: 100vh !important;
  }
</style>

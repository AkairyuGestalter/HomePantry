<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed-last">
      <md-app-toolbar class="md-large md-dense md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
              <md-icon>menu</md-icon>
            </md-button>

            <span class="md-title">My Pantry</span>
          </div>

          <div class="md-toolbar-section-end">
            <md-menu md-alight-trigger md-direction="bottom-start">
              <md-button md-menu-trigger class="md-icon-button">
                <md-icon>more_vert</md-icon>
              </md-button>

              <md-menu-content>
                <md-menu-item @click.native="logout">Log Out</md-menu-item>
              </md-menu-content>
            </md-menu>
          </div>
        </div>

        <div ref="ToolBarSecondRow" class="md-toolbar-row">
          <md-tabs class="md-primary">
            <md-tab id="tab-pantry" md-label="Pantry"></md-tab>
            <md-tab id="tab-fridge" md-label="Fridge"></md-tab>
            <md-tab id="tab-freezer" md-label="Freezer"></md-tab>
            <md-tab id="tab-chest_freezer" md-label="Chest Freezer"></md-tab>
          </md-tabs>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>restaurant</md-icon>
            <span class="md-list-item-text">Pantry</span>
          </md-list-item>

          <md-list-item>
            <md-icon>fastfood</md-icon>
            <span class="md-list-item-text">Recipes</span>
          </md-list-item>

          <md-list-item>
            <md-icon>edit</md-icon>
            <span class="md-list-item-text">Manage Items</span>
          </md-list-item>

          <md-list-item>
            <md-icon>error</md-icon>
            <span class="md-list-item-text">idklol</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<style lang="scss" scoped>
  .md-app {
    //max-height: 400px;
    border: 1px solid rgba(#000, .12);
  }

   // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>

<script>
/* eslint-disable no-unused-vars */
import firebase from 'firebase'
import { fireDb } from '@/config/db'
import { store } from '@/store/store'
var currentHome = ''
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    fireDb.collection('users').doc(user.uid).get().then(
      function (doc) {
        if (doc.exists) {
          currentHome = doc.data().DefaultHome
          console.log(currentHome)
        }
      }
    )
  }
})
console.log(store.getters.getUser)

export default {
  name: 'Pantry',
  data: () => ({
    menuVisible: false
  }),
  methods: {
    logout: function () {
      firebase.auth().signOut().then(() => {
        this.$router.replace('Authentication')
      })
    }
  }
}
</script>

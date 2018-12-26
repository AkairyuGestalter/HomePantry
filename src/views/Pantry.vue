<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed-last">
      <md-app-toolbar class="md-large md-dense md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
              <md-icon>menu</md-icon>
            </md-button>

            <span class="md-title" v-if="dataLoaded">{{ homes[currentHomeId].Name }}</span>
            <span class="md-title" v-else>HomePantry</span>
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
          <transition name="component-fade" mode="in-out">
            <md-tabs v-if="dataLoaded && !changingHome" class="md-primary" :md-active-tab.sync="currentStorageTab" @md-changed="tabClick">
              <md-tab v-for="(location, storageId) in storage" v-if="storageIds[currentHomeId].includes(storageId)" :key="storageId" :md-label="location.Name" :id="storageId" />
            </md-tabs>
          </transition>
        </div>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full" :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span class="md-title">HomePantry</span>
        </md-toolbar>

        <md-divider class="md-inset" />

        <md-subheader>Navigation</md-subheader>

        <md-list>
          <md-list-item @click="noop">
            <md-icon>kitchen</md-icon>
            <span class="md-list-item-text">Pantry</span>
          </md-list-item>

          <md-list-item @click="noop">
            <md-icon>fastfood</md-icon>
            <span class="md-list-item-text">Recipes</span>
          </md-list-item>

          <md-list-item @click="noop">
            <md-icon>edit</md-icon>
            <span class="md-list-item-text">Manage Items</span>
          </md-list-item>

          <md-list-item v-on:click="noop">
            <md-icon>error</md-icon>
            <span class="md-list-item-text">idklol</span>
          </md-list-item>

          <md-divider class="md-inset"/>

          <md-subheader>Select Home</md-subheader>
          <md-list-item v-for="(home, homeId) in homes" :key="homeId" v-on:click="click(homeId)" :id="homeId">
            <md-icon v-if="homeId === currentHomeId">home</md-icon>
            <md-icon v-if="homeId != currentHomeId">blank</md-icon>
            <span class="md-list-item-text">{{home.Name}}</span>
          </md-list-item>
          <md-list-item @click="noop">
            <md-icon>add</md-icon>
            <span class="md-list-item-text">Add a home</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <div v-if="dataLoaded && !changingHome">
          <transition name="component-fade" mode="out-in">
            <storage :key="'storage-'+currentStorageId"
              v-on:edit-item="editItemDialog"
              v-on:delete-item="handleDeleteResponse"
            />
          </transition>
        </div>
        <div v-else>
          <transition name="component-fade" mode="out-in">
            <md-empty-state key="emptyStorage"
              class="md-accent"
              md-icon="warning"
              md-label="Loading"
              md-description="We're loading your information now. Please wait.">
              <md-progress-spinner md-mode="indeterminate" class="md-accent" />
            </md-empty-state>
          </transition>
        </div>
        <md-button class="md-fab md-primary md-fab-bottom-right" @click="fabClick" :disabled="!dataLoaded || changingHome">
          <md-icon>add</md-icon>
        </md-button>
        <md-dialog :md-active.sync="showItemDialog" :md-fullscreen="false">
          <edit-item
            v-on:close-dialog="showItemDialog = false"
            v-on:confirm-dialog="handleConfirmEdit"
            :mode="editMode"
            :item="editingItem"
            :contentId="editingContentId" />
        </md-dialog>
        <!--md-bottom-bar>
          <md-bottom-bar-item><md-icon>home</md-icon></md-bottom-bar-item>
        </md-bottom-bar-->
        <md-snackbar md-position="center" :md-duration="2500" :md-active.sync="showSnackbar" md-persistent>
          <span>{{snackbarMessage}}</span>
        </md-snackbar>
      </md-app-content>
    </md-app>
  </div>
</template>

<style lang="scss" scoped>
  .md-app {
    min-height: 100vh;
    border: 1px solid rgba(#000, .12);
    display: flex,
  }

  .md-app-content {
    flex: 1;
    height: 100%,
  }

   // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateY(-50px);
    opacity: 0;
  }

  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }
  .component-fade-enter, .component-fade-leave-to
  /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

<script>
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import { mapState } from 'vuex'
import Storage from '@/components/Storage'
import EditItem from '@/components/EditItem'
const fb = require('@/config/db')

export default {
  name: 'Pantry',
  data: function () {
    return {
      menuVisible: false,
      currentStorageTab: null,
      showItemDialog: false,
      editMode: null,
      editingItem: null,
      editingContentId: null,
      showSnackbar: false,
      snackbarMessage: null
    }
  },
  computed: {
    ...mapState(['storage', 'currentHomeId', 'homes', 'dataLoaded', 'currentStorageId', 'changingHome', 'storageIds'])
  },
  methods: {
    logout: function () {
      fb.auth.signOut().then(() => {
        this.$store.dispatch('clearData')
        this.$router.replace('Authentication')
      }).catch(err => {
        console.log(err)
      })
    },
    noop: function () {
      this.menuVisible = false
    },
    click: function (obj) {
      this.$store.dispatch('changeCurrentHome', obj)
      this.menuVisible = false
    },
    tabClick: function (obj) {
      this.currentStorageTab = obj
    },
    fabClick: function () {
      this.editMode = 'addcontent'
      this.editingItem = {}
      this.editingContentId = null
      this.showItemDialog = true
    },
    editItemDialog: function (itemDef, contentId) {
      console.log('editItemDialog: contentId: ' + contentId)
      this.editMode = 'editcontent'
      this.editingItem = itemDef
      this.editingContentId = contentId
      this.showItemDialog = true
    },
    handleConfirmEdit: function () {
      this.showItemDialog = false
      this.snackbarMessage = 'Handling Edit Confirm'
      this.showSnackbar = true
    },
    handleDeleteResponse: function (responseMsg) {
      this.snackbarMessage = responseMsg
      this.showSnackbar = true
    }
  },
  watch: {
    dataLoaded: function () {
      if (this.dataLoaded) {
        if (!this.currentStorageTab) {
          this.currentStorageTab = this.currentStorageId
        }
      }
    },
    changingHome: function () {
      if (!this.changingHome) {
        this.currentStorageTab = this.storageIds[this.currentHomeId][0]
      }
    },
    currentStorageTab: function () {
      this.$store.commit('setCurrentStorage', this.currentStorageTab)
    }
  },
  store: this.$store,
  router: this.$router,
  components: { Storage, EditItem }
}
</script>

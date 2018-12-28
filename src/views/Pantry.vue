<template>
  <div>
    <v-toolbar app color="primary" tabs>
      <v-toolbar-side-icon @click="menuVisible = !menuVisible" />
      <v-toolbar-title>{{dataLoaded ? homes[currentHomeId].Name : 'HomePantry' }}</v-toolbar-title>
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
          <v-divider />
          <v-list-tile @click="logout">
            <v-list-tile-avatar>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>Log Out</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-tabs
        slot="extension"
        v-if="dataLoaded && !changingHome"
        v-model="currentStorageTab"
        color="transparent"
      >
        <v-tab
          v-for="(location, storageId) in storage"
          v-if="storageIds[currentHomeId].includes(storageId)"
          :key="storageId"
          ripple
        >
          {{location.Name}}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-navigation-drawer app v-model="menuVisible">
      <v-toolbar color="primary">
        <v-toolbar-side-icon @click="menuVisible = !menuVisible" />
        <v-toolbar-title>HomePantry</v-toolbar-title>
      </v-toolbar>

      <v-divider inset />

      <v-list>
        <v-subheader>Navigation</v-subheader>
        <v-list-tile @click="noop">
          <v-list-tile-avatar>
            <v-icon>kitchen</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="text-xs-left">Pantry</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="noop">
          <v-list-tile-avatar>
            <v-icon>fastfood</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="text-xs-left">Recipes</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="noop">
          <v-list-tile-avatar>
            <v-icon>edit</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="text-xs-left">Manage Items</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-on:click="noop">
          <v-list-tile-avatar>
            <v-icon>error</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="text-xs-left">idklol</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider inset />

        <v-subheader>Select Home</v-subheader>
        <v-list-tile v-for="(home, homeId) in homes" :key="homeId" v-on:click="click(homeId)" :id="homeId">
          <v-list-tile-avatar>
            <v-icon v-if="homeId === currentHomeId">home</v-icon>
            <v-icon v-if="homeId != currentHomeId">blank</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>
            {{home.Name}}
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="noop">
          <v-list-tile-avatar>
            <v-icon>add</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>Add a home</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content app>
      <div v-if="dataLoaded && !changingHome">
        <transition name="component-fade" mode="out-in">
          <v-tabs-items v-model="currentStorageTab">
            <v-tab-item
              v-for="(location, storageId) in storage"
              v-if="storageIds[currentHomeId].includes(storageId)"
              :key="storageId"
            >
              <storage :key="'storage-'+storageId"
                v-on:edit-item="editItemDialog"
                v-on:delete-item="handleDeleteResponse"
                :boundStorageId="storageId"
              />
            </v-tab-item>
          </v-tabs-items>
        </transition>
      </div>
      <div v-else>
        <transition name="component-fade" mode="out-in">
          <div style="text-align: center">
            <empty-state key="emptyStorage"
              color="warning"
              icon="warning"
              label="Loading"
              description="We're loading your information now. Please wait."
              :showSpinner="true"
            />
          </div>
        </transition>
      </div>
      <v-btn fixed fab color="primary" bottom right @click="fabClick" :disabled="!dataLoaded || changingHome">
        <v-icon>add</v-icon>
      </v-btn>
      <v-dialog v-model="showItemDialog">
        <edit-item
          v-on:close-dialog="showItemDialog = false"
          v-on:confirm-dialog="handleConfirmEdit"
          :mode="editMode"
          :item="editingItem"
          :contentId="editingContentId" />
      </v-dialog>
      <v-snackbar bottom :timeout="2500" v-model="showSnackbar">
        {{snackbarMessage}}
      </v-snackbar>
    </v-content>
  </div>
</template>

<style lang="scss" scoped>
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }
  .component-fade-enter, .component-fade-leave-to {
    opacity: 0;
  }
</style>

<script>
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import { mapState } from 'vuex'
import Storage from '@/components/Storage'
import EditItem from '@/components/EditItem'
import EmptyState from '@/components/EmptyState'
const fb = require('@/config/db')

export default {
  name: 'Pantry',
  data: function () {
    return {
      menuVisible: null,
      currentStorageTab: null,
      showItemDialog: false,
      editMode: null,
      editingItem: null,
      editingContentId: null,
      showSnackbar: false,
      snackbarMessage: null,
      isDarkMode: true
    }
  },
  computed: {
    ...mapState(['storage', 'currentHomeId', 'homes', 'dataLoaded', 'currentStorageId', 'changingHome', 'storageIds', 'storage', 'useDarkMode'])
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
          this.currentStorageTab = this.storageIds[this.currentHomeId][this.currentStorageId]
        }
      }
    },
    changingHome: function () {
      if (!this.changingHome) {
        this.currentStorageTab = 0
      }
    },
    currentStorageTab: function () {
      this.$store.commit('setCurrentStorage', this.storageIds[this.currentHomeId][this.currentStorageTab])
    },
    isDarkMode: function () {
      this.$store.commit('setDarkMode', this.isDarkMode)
    }
  },
  mounted () {
    this.isDarkMode = this.useDarkMode
  },
  store: this.$store,
  router: this.$router,
  components: { Storage, EditItem, EmptyState }
}
</script>

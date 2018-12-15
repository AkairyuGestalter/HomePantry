// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'

import VueFire from 'vuefire'
import App from './App'
import router from './router'

/* eslint-disable no-unused-vars */
import firebase from 'firebase'
import { store } from '@/store/store'
// import { fireAuth } from './config/db'

Vue.use(VueMaterial)
Vue.use(VueFire)
Vue.use(VueRouter)
Vue.use(firebase)
Vue.config.productionTip = false

let app = ''

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch('setUser')
  } else {
    store.dispatch('setUser')
  }
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: { App }
    })
  }
})

/* eslint-disable no-new */

import Vue from 'vue'
import VueRouter from 'vue-router'

/* Authentication handling */
import Authentication from '@/views/Authentication.vue'

/* Application */
import Pantry from '@/views/Pantry.vue'
import Hello from '@/components/Hello.vue'

import firebase from 'firebase'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/Authentication'
    },
    {
      path: '/',
      redirect: '/Authentication'
    },
    {
      name: 'Authentication',
      path: '/Authentication',
      component: Authentication
    },
    {
      name: 'Pantry',
      path: '/Pantry',
      component: Pantry,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          name: 'Hello',
          path: '/',
          component: Hello
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('Authentication')
  else if (!requiresAuth && currentUser) next('Pantry')
  else next()
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'

/* Authentication handling */
import Authentication from '@/views/Authentication.vue'

/* Application */
import Pantry from '@/views/Pantry.vue'

const fb = require('@/config/db')

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
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = fb.auth.currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('Authentication')
  else if (!requiresAuth && currentUser) next('Pantry')
  else next()
})

export default router

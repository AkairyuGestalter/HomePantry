<template>
  <div id="app">
    <v-app :dark='useDarkMode'>
      <router-view/>
    </v-app>
  </div>
</template>

<style>
 * {
   text-decoration: none !important
 }
</style>

<script>
import { mapState } from 'vuex'
import Authentication from '@/views/Authentication'
import Pantry from '@/views/Pantry'

export default {
  name: 'App',
  components: {Authentication, Pantry},
  computed: {
    ...mapState(['currentUser', 'useDarkMode'])
  }
}
</script>

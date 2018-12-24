<template>
  <div id="app">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons">
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Authentication from '@/views/Authentication'
import Pantry from '@/views/Pantry'

export default {
  name: 'App',
  components: {Authentication, Pantry},
  computed: {
    ...mapState(['currentUser'])
  }
}
</script>

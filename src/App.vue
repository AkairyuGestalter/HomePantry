<template>
  <div id="app">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    setUser: function () {
      this.$store.dispatch('setUser')
    }
  },
  created () {
    this.setUser()
  }
}
</script>

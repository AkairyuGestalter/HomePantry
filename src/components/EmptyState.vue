<template>
  <div id="emptystate">
    <v-icon size="160" :color="color" center>{{icon}}</v-icon>
    <p class="headline">{{label}}</p>
    <p class="subheading">{{description}}</p>
    <v-progress-circular v-if="showSpinner" indeterminate :color="color" />
  </div>
</template>

<style>
  #emptystate {
    text-align: center;
    display: inline-block;
    vertical-align: middle;
    padding: 40px
  }
</style>


<script>
export default {
  name: 'EmptyState',
  props: {
    color: null,
    icon: null,
    label: null,
    description: null,
    showSpinner: false
  }
}
</script>

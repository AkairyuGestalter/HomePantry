<template>
  <div>
    <md-empty-state
      class="md-primary"
      md-icon="done_outline"
      md-label="nothing in done"
      md-description="bler">
    </md-empty-state>
  </div>
</template>

<script>
// import firebase from 'firebase'

export default {
  components: {
    name: 'Hello'
  }
}
</script>

<style lang="scss" scoped>
  div {
    text-align: center;
  }

  .md-empty-state {
    display: inline-block;
    vertical-align: middle;

    + .md-empty-state {
      margin-left: 16px;
    }
  }
</style>

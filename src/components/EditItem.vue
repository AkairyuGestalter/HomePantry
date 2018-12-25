// EditItem.vue

<template>
  <form @submit.stop.prevent="noop()">
    <md-card>
      <md-card-header>
        <div class="md-title">
          <span v-if="mode === 'newdef'">Add New Item</span>
          <span v-else-if="mode === 'editdef'">Edit Item Definition</span>
          <span v-else-if="mode === 'addcontent'">Add to {{currentStorageName}}</span>
          <span v-else-if="mode === 'editcontent'">Update {{item.ItemName}}</span>
          <span v-else>Unknown operating mode</span>
        </div>
      </md-card-header>
      <md-card-content>
        <md-autocomplete v-model="newItemName" :md-options="mergedItemNames" md-dense>
          <label>Item</label>
        </md-autocomplete>
        <md-button @click="check">check</md-button>
      </md-card-content>
      <md-card-actions>
        <md-button :disabled="sending" @click="$emit('close-dialog')">Cancel</md-button>
        <md-button class="md-primary" :disabled="sending" @click="addItem">Accept</md-button>
      </md-card-actions>
    </md-card>
  </form>
</template>

<style>
  .md-card {
    flex: 1;
    height: 100%
  }
  .md-menu-content {
   z-index:11;
  }
</style>


<script>
import {mapState} from 'vuex'

export default {
  data: () => ({
    sending: false,
    newItemName: null,
    newItem: null,
    selectItems: [
      'something',
      'somethingelse',
      'anotherthing',
      'notactuallyathirdthing'
    ]
  }),
  props: {
    mode: null,
    item: {
      ItemName: null,
      ItemQty: null,
      QtyType: null,
      ItemId: null
    }
  },
  computed: {
    ...mapState(['currentStorageId', 'storage', 'publicItems', 'homeItems']),
    currentStorageName: function () {
      return this.storage[this.currentStorageId].Name
    },
    mergedItemNames: function () {
      let itemNames = []
      Object.keys(this.homeItems).forEach(itemId => {
        if (!(this.homeItems[itemId].ItemName in itemNames)) {
          itemNames.push(this.homeItems[itemId].ItemName)
        }
      })
      Object.keys(this.publicItems).forEach(itemId => {
        if (!(this.publicItems[itemId].ItemName in itemNames)) {
          itemNames.push(this.publicItems[itemId].ItemName)
        }
      })
      return itemNames
    }
  },
  components: {
    name: 'EditItem'
  },
  methods: {
    getItems: function () {
      let newGetItem = {}
      let currentCount = Object.keys(this.selectItems).length
      newGetItem.ItemName = 'something' + currentCount
      newGetItem.ItemQty = currentCount
      newGetItem.QtyType = 'things'
      newGetItem = 'wallawalla' + currentCount
      this.selectItems.push(newGetItem)
    },
    check: function () {
      console.log(this.publicItems)
      console.log(this.homeItems)
    },
    noop: function () {},
    addItem: function () {
      console.log('Pretend add item')
      this.$emit('confirm-dialog')
    }
  }
}
</script>

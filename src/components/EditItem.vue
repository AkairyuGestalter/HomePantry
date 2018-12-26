// EditItem.vue

<template>
  <form @submit.stop.prevent="noop()">
    <md-card>
      <md-card-header>
        <div class="md-title">
          <span v-if="mode === 'newdef'">Create New Item</span>
          <span v-else-if="mode === 'editdef'">Edit Item Definition</span>
          <span v-else-if="mode === 'addcontent'">Add Item</span>
          <span v-else-if="mode === 'editcontent'">Update {{item.ItemName}}</span>
          <span v-else>Unknown operating mode</span>
        </div>
      </md-card-header>
      <md-card-content>
        <md-autocomplete v-model="newItem" :md-options="allItemsArray" md-dense>
          <label>Item</label>
          <template slot="md-autocomplete-item" slot-scope="{item, term}">
            <md-highlight-text :md-term="term">{{item.name}}</md-highlight-text>
          </template>
          <template slot="md-autocomplete-empty" slot-scope="{term}">
          </template>
        </md-autocomplete>
        <md-field>
          <label>Quantity</label>
          <md-input type="number" v-model="newItemQuantity" />
        </md-field>
        <md-field>
          <label for="qtytype">Type</label>
          <md-select v-model="newItemQuantityId" name="qtytype" id="qtytype">
            <md-option v-for="(quantityType, quantityId) in quantityTypes" :key="quantityId" :id="quantityId" :value="quantityId">
              {{newItemQuantity != 1 ? quantityType.plural : quantityType.single}}
            </md-option>
          </md-select>
        </md-field>
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
const fb = require('@/config/db')

export default {
  data: () => ({
    sending: false,
    newItem: null,
    newItemQuantity: null,
    newItemQuantityId: null,
    storageId: null,
    items: [],
    newItemId: null
  }),
  props: {
    mode: null,
    contentId: null,
    item: {}
  },
  computed: {
    ...mapState(['currentStorageId', 'storage', 'publicItems', 'homeItems', 'quantityTypes', 'currentHomeId']),
    currentStorageName: function () {
      return this.storage[this.currentStorageId].Name
    },
    allItemsArray: function () {
      let items = []
      let itemId
      for (itemId in this.publicItems) {
        items.push({id: itemId, name: this.publicItems[itemId].ItemName})
      }
      for (itemId in this.homeItems) {
        items.push({id: itemId, name: this.homeItems[itemId].ItemName})
      }
      return items.map(i => ({
        ...i,
        'toLowerCase': () => i.name.toLowerCase(),
        'toString': () => i.name.toString()
      }))
    },
    allItemIdsArray: function () {
      let itemIds = []
      let itemId
      for (itemId in this.publicItems) {
        itemIds.push(itemId)
      }
      for (itemId in this.homeItems) {
        itemIds.push(itemId)
      }
      return itemIds
    }
  },
  mounted: function () {
    if (this.contentId) {
      this.newItem = {
        id: this.item.ItemId ? this.item.ItemId : '',
        name: this.item.ItemName ? this.item.ItemName : '',
        'toLowerCase': () => this.newItem.name.toLowerCase(),
        'toString': () => this.newItem.name.toString()
      }
      this.newItemQuantity = this.item.ItemQty
      this.newItemQuantityId = this.item.QtyTypeId
    }
  },
  components: {
    name: 'EditItem'
  },
  methods: {
    check: function () {
      console.log('contentID: ' + this.contentId)
      console.log(this.newItem.id)
      console.log(this.newItemQuantity)
      console.log(this.newItemQuantityId)
    },
    noop: function () {},
    addItem: async function () {
      const itemData = {
        ItemId: this.newItem.id,
        ItemQty: this.newItemQuantity,
        QtyTypeId: this.newItemQuantityId
      }
      console.log(itemData)
      let colRef = fb.allHomes.doc(this.currentHomeId).collection('StorageLocations').doc(this.currentStorageId).collection('Contents')
      if (this.contentId) {
        await colRef.doc(this.contentId).set(itemData)
      } else {
        await colRef.add(itemData)
      }
      this.$emit('confirm-dialog')
    },
    isNewItemDef: function () {
      return !this.newItem.id
    },
    getItems (searchTerm) {
      this.searchItems = new Promise(resolve => {
        if (!searchTerm) {
          resolve(this.allItemsArray)
        } else {
          const term = searchTerm.toLowerCase()

          resolve(this.allItemsArray.filter(({ name }) => name.toLowerCase().includes(term)))
        }
      })
    }
  }
}
</script>

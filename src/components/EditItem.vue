<template>
  <v-card>
    <v-card-title primary-title>
      <h3 class="headline mb-0">
        <span v-if="mode === 'newdef'">Create New Item</span>
        <span v-else-if="mode === 'editdef'">Edit Item Definition</span>
        <span v-else-if="mode === 'addcontent'">Add Item</span>
        <span v-else-if="mode === 'editcontent'">Update {{item.ItemName}}</span>
        <span v-else>Unknown operating mode</span>
      </h3>
    </v-card-title>
    <v-card-text>
      <v-combobox
        v-model="newItem"
        hint="Enter an item's name"
        label="Item"
        :items="allItemsAsArray"
        item-value="id"
        item-text="name"
        hide-no-data
        :disabled="sending"
      />
      <v-text-field :disabled="sending"
        label="Quantity"
        type="number"
        v-model="newItemQuantity"
      />
      <v-autocomplete
        v-model="newItemQuantityId"
        hint="Select a quantity type"
        label="Type"
        :items="quantityTypesAsArray"
        item-value="id"
        item-text="name"
        hide-no-data
        :disabled="sending"
      />
      <v-switch v-if="checkMakePublic" label="Make item public?" v-model="makePublic" />
      <v-progress-linear :indeterminate="true" v-show="sending" />
    </v-card-text>
    <v-card-actions>
      <v-btn :disabled="sending" color="info" @click="check">Check</v-btn>
      <v-spacer />
      <v-btn :disabled="sending" @click="$emit('close-dialog')">Cancel</v-btn>
      <v-btn color="primary" :disabled="sending" @click="addItem">Accept</v-btn>
    </v-card-actions>
  </v-card>
</template>

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
    makePublic: false
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
    allItems: function () {
      return {
        ...this.publicItems,
        ...this.homeItems
      }
    },
    allItemsAsArray: function () {
      let items = []
      let itemId
      for (itemId in this.allItems) {
        items.push({id: itemId, name: this.allItems[itemId].ItemName})
      }
      return items
    },
    quantityTypesAsArray: function () {
      let qtyTypesArr = []
      let quantityId
      for (quantityId in this.quantityTypes) {
        qtyTypesArr.push({id: quantityId, name: this.quantityTypes[quantityId].indeterminate})
      }
      return qtyTypesArr
    },
    checkMakePublic: function () {
      if (this.newItem) {
        if (!this.newItem.id) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    contentId: function () {
      console.log('EditItem@watch@contentId: contentId' + this.contentId)
      console.log(this.item)
      if (this.contentId) {
        this.newItem = {
          id: this.item.ItemId ? this.item.ItemId : '',
          name: this.item.ItemId ? this.allItems[this.item.ItemId].ItemName : ''
        }
        this.newItemQuantity = this.item.ItemQty
        this.newItemQuantityId = this.item.QtyTypeId
      } else {
        this.newItem = null
        this.newItemQuantity = null
        this.newItemQuantityId = null
      }
    }
  },
  components: {
    name: 'EditItem'
  },
  methods: {
    check: function () {
      console.log(this.contentId)
      console.log(this.newItem)
      console.log(this.newItemQuantity)
      console.log(this.newItemQuantityId)
    },
    logChange: function () {
      console.log('change')
    },
    noop: function () {},
    addItem: async function () {
      this.sending = true
      const contentData = {
        ItemId: this.newItem.id,
        ItemQty: this.newItemQuantity,
        QtyTypeId: this.newItemQuantityId
      }
      if (!contentData.ItemId) {
        let itemDocRef
        if (this.makePublic) {
          itemDocRef = await fb.publicData.doc('UserData').collection('Items').doc()
        } else {
          itemDocRef = await fb.allHomes.doc(this.currentHomeId).collection('Items').doc()
        }
        let itemData = {
          ItemName: this.newItem,
          QtyTypeId: contentData.QtyTypeId
        }
        console.log(itemData)
        await itemDocRef.set(itemData)
        contentData.ItemId = itemDocRef.id
      }
      console.log(contentData)
      let colRef = fb.allHomes.doc(this.currentHomeId).collection('StorageLocations').doc(this.currentStorageId).collection('Contents') // eslint-disable-line
      if (this.contentId) {
        await colRef.doc(this.contentId).set(contentData, {merge: true})
      } else {
        await colRef.add(contentData)
      }
      this.sending = false
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

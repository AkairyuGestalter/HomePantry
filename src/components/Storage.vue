<template>
  <div>
    <div v-if="Object.keys(storageContents[boundStorageId]).length === 0" >
      <empty-state
        color="primary"
        icon='kitchen'
        label="There's nothing here yet"
        description="The contents of your pantry will show up here as you add them"
      />
    </div>
    <v-list v-else two-line>
      <v-list-tile
        v-for="(content, contentId) in storageContents[boundStorageId]"
        :key="contentId"
      >
        <v-list-tile-avatar>
          <v-icon>fastfood</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title class="text-xs-left">{{allItems[content.ItemId].ItemName}}</v-list-tile-title>
          <v-list-tile-sub-title class="text-xs-left">{{content.ItemQty}} {{content.ItemQty != 1 ? quantityTypes[content.QtyTypeId].plural : quantityTypes[content.QtyTypeId].single}}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-btn icon ripple @click="emitEditItem(content, contentId)">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn icon ripple @click="confirmDeleteItem(content, contentId)">
          <v-icon>delete</v-icon>
        </v-btn>
      </v-list-tile>
    </v-list>
    <v-dialog v-model="deleteConfirmVisible">
      <v-card>
        <v-card-title primary-title class="headline">
          Confirm delete
        </v-card-title>
        <v-card-text>
          {{ deleteConfirmMessage }}
        </v-card-text>
        <v-card-actions>
          <v-flex class="text-xs-right">
            <v-btn :disabled="sending" @click="cancelDelete">Cancel</v-btn>
            <v-btn :disabled="sending" color="primary" @click="deleteItem">Accept</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EmptyState from '@/components/EmptyState'
import { mapState } from 'vuex'
const fb = require('@/config/db')

export default {
  name: 'Storage',
  data: () => {
    return {
      deleteConfirmVisible: false,
      deleteConfirmMessage: null,
      deletingContentId: null,
      sending: false
    }
  },
  props: {
    boundStorageId: null
  },
  computed: {
    ...mapState(['storageContents', 'quantityTypes', 'currentHomeId', 'publicItems', 'homeItems']),
    allItems: function () {
      return {
        ...this.publicItems,
        ...this.homeItems
      }
    }
  },
  methods: {
    noop: () => {},
    check: function () {
      console.log(this.boundStorageId)
    },
    emitEditItem: function (item, contentId) {
      this.$emit('edit-item', item, contentId)
    },
    confirmDeleteItem: function (content, contentId) {
      this.deletingContentId = contentId
      this.deleteConfirmMessage = 'Are you sure you want to delete ' + this.allItems[content.ItemId].ItemName + '?'
      this.deleteConfirmVisible = true
    },
    deleteItem: function () {
      this.sending = true
      const itemName = this.allItems[this.storageContents[this.boundStorageId][this.deletingContentId].ItemId].ItemName
      fb.allHomes.doc(this.currentHomeId).collection('StorageLocations').doc(this.boundStorageId).collection('Contents').doc(this.deletingContentId).delete().then(() => {
        this.$emit('delete-item', 'Deleted: ' + itemName)
        this.deleteConfirmVisible = false
        this.sending = false
      })
    },
    cancelDelete: function () {
      this.deletingItem = null
      this.deleteConfirmVisible = false
    }
  },
  components: { EmptyState }
}
</script>

<style lang="scss" scoped>
  div {
    text-align: center;
  }
</style>

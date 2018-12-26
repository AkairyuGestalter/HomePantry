<template>
  <div>
    <div v-if="Object.keys(storageContents[currentStorageId]).length === 0">
      <md-empty-state
        class="md-primary"
        md-icon="kitchen"
        md-label="There's nothing here yet"
        md-description="The contents of your pantry will show up here as you add them">
      </md-empty-state>
    </div>
    <md-list v-else>
      <md-list-item v-for="(item, contentId) in storageContents[currentStorageId]" :key="contentId" md-double-line>
        <md-avatar class="md-avatar-icon">
        <md-icon>fastfood</md-icon>
        </md-avatar>
        <div class="md-list-item-text" style="text-align: left">
          <span class="md-title">{{item.ItemId}}</span>
          <span>{{item.ItemQty}} {{item.ItemQty != 1 ? quantityTypes[item.QtyTypeId].plural : quantityTypes[item.QtyTypeId].single}}</span>
        </div>
        <md-button class="md-icon-button md-list-action" @click="emitEditItem(item, contentId)">
          <md-icon>edit</md-icon>
        </md-button>
        <md-button class="md-icon-button md-list-action" @click="confirmDeleteItem(item, contentId)">
          <md-icon>delete</md-icon>
        </md-button>
      </md-list-item>
    </md-list>
    <md-button v-if="false" @click="check"><md-icon>check</md-icon></md-button>
    <md-dialog-confirm
      :md-active.sync="deleteConfirmVisible"
      md-title="Confirm delete"
      :md-content="deleteConfirmMessage"
      md-confirm-text="Accept"
      @md-confirm="deleteItem"
      md-cancel-text="Cancel"
      @md-cancel="cancelDelete"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('@/config/db')

export default {
  name: 'Storage',
  data: () => {
    return {
      deleteConfirmVisible: false,
      deleteConfirmMessage: null,
      deletingContentId: null
    }
  },
  computed: {
    ...mapState(['currentStorageId', 'storageContents', 'quantityTypes', 'currentHomeId'])
  },
  methods: {
    check: function () {
      console.log(this.currentStorageId)
    },
    emitEditItem: function (item, contentId) {
      console.log(item)
      this.$emit('edit-item', item, contentId)
    },
    confirmDeleteItem: function (item, contentId) {
      this.deletingContentId = contentId
      this.deleteConfirmMessage = 'Are you sure you want to delete ' + item.ItemName + '?'
      this.deleteConfirmVisible = true
    },
    deleteItem: function () {
      console.log('Will delete: ')
      console.log(this.deletingContentId)
      const itemName = this.storageContents[this.currentStorageId][this.deletingContentId].ItemName
      fb.allHomes.doc(this.currentHomeId).collection('StorageLocations').doc(this.currentStorageId).collection('Contents').doc(this.deletingContentId).delete().then(() => {
        this.$emit('delete-item', 'Deleted: ' + itemName)
      })
    },
    cancelDelete: function () {
      this.deletingItem = null
    }
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

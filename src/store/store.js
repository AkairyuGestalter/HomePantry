import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('@/config/db')

Vue.use(Vuex)

fb.auth.onAuthStateChanged(user => {
  if (user) {
    // load user profile and fetch data
    store.commit('setDataLoaded', false)
    store.commit('setCurrentUser', user)
    console.log('got user')
    store.dispatch('fetchUserProfile').then(() => {
      console.log('got profile')
      store.dispatch('fetchHomes').then(() => {
        console.log('got homes')
        store.dispatch('fetchStorageLocations', true).then(() => {
          console.log('fetched storages')
          store.dispatch('fetchAllStorageContents').then(() => {
            console.log('fetched all contents')
            console.log(store.state.storageContents)
            store.commit('setDataLoaded', true)
            console.log('set data loaded')
          })
        })
      })
    })
  }
})

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    homes: {},
    currentHomeId: null,
    storage: {},
    currentStorageId: null,
    storageContents: {},
    storageIds: {},
    dataLoaded: false,
    changingHome: false,
    allListeners: []
  },
  mutations: {
    setCurrentUser (state, val) {
      state.currentUser = val
    },
    setUserProfile (state, val) {
      state.userProfile = val
    },
    setAllHomes (state, val) {
      state.homes = val
    },
    setOneHome (state, {homeId, homeData}) {
      Vue.set(state.homes, homeId, homeData)
    },
    deleteOneHome (state, homeId) {
      Vue.delete(state.homes, homeId)
    },
    setCurrentHome (state, val) {
      state.currentHomeId = val
    },
    setAllStorages (state, val) {
      state.storage = val
    },
    setOneStorage (state, {storageId, storageData}) {
      Vue.set(state.storage, storageId, storageData)
      if (!state.storageContents[storageId]) {
        Vue.set(state.storageContents, storageId, {})
      }
    },
    deleteOneStorage (state, storageId) {
      Vue.delete(state.storage, storageId)
      Vue.delete(state.storageContents, storageId)
    },
    setCurrentStorage (state, val) {
      state.currentStorageId = val
    },
    setOneContent (state, {storageId, contentId, contentData}) {
      Vue.set(state.storageContents[storageId], contentId, contentData)
    },
    deleteOneContent (state, {storageId, contentId}) {
      Vue.delete(state.storageContents[storageId], contentId)
    },
    setAllContents (state, {storageId, contents}) {
      Vue.set(state.storageContents, storageId, contents)
    },
    setDataLoaded (state, val) {
      state.dataLoaded = val
    },
    setChangingHome (state, val) {
      state.changingHome = val
    },
    setHomeStorageIds (state, {homeId, storageIdArr}) {
      Vue.set(state.storageIds, homeId, storageIdArr)
    },
    clearStorageIds (state) {
      state.storageIds = {}
    },
    addListener (state, val) {
      state.allListeners.push(val)
    },
    flushListeners (state) {
      state.allListeners = []
    }
  },
  actions: {
    fetchUserProfile ({commit, state}) {
      return new Promise((resolve) => {
        let newListener = fb.allUsers.doc(state.currentUser.uid).onSnapshot(res => {
          commit('setUserProfile', res.data())
          resolve()
        })
        commit('addListener', newListener)
      })
    },
    fetchHomes ({commit, state}) {
      return new Promise((resolve) => {
        let newListener = fb.allHomes.where('members', 'array-contains', state.currentUser.uid).onSnapshot(homeSnapshot => {
          let currentHomeId = state.currentHomeId
          homeSnapshot.docChanges().forEach(homeChange => {
            const homeId = homeChange.doc.id
            if (homeChange.type === 'removed') {
              commit('deleteOneHome', homeId)
            } else {
              const homeData = homeChange.doc.data()
              if (!currentHomeId) {
                currentHomeId = homeId
              }
              commit('setOneHome', {homeId, homeData})
            }
          })
          commit('setCurrentHome', currentHomeId)
          resolve()
        })
        commit('addListener', newListener)
      })
    },
    fetchStorageLocations ({commit, state}, isInitialLoad) {
      // retrieve homes data
      return new Promise((resolve) => {
        let newListener = fb.allHomes.doc(state.currentHomeId).collection('StorageLocations').onSnapshot(locationSnapshot => {
          let currentStorageId = state.currentStorageId
          let choseStorageId = false
          let storageIdArr = []
          if (state.storageIds[state.currentHomeId]) {
            storageIdArr = state.storageIds[state.currentHomeId]
          }
          locationSnapshot.docChanges().forEach(storageChange => {
            const storageId = storageChange.doc.id
            if (storageChange.type === 'removed') {
              let storageIndex = storageIdArr.indexOf(storageId)
              if (storageIndex > -1) {
                storageIdArr.splice(storageIndex, 1)
                if (currentStorageId === storageId && storageIndex < storageIdArr.length) {
                  currentStorageId = storageIdArr[storageIndex]
                }
              }
              commit('deleteOneStorage', storageChange.doc.id)
            } else {
              const storageData = storageChange.doc.data()
              storageIdArr.push(storageId)
              if ((isInitialLoad && !currentStorageId) || (!isInitialLoad && !choseStorageId)) {
                currentStorageId = storageId
                choseStorageId = true
              }
              commit('setOneStorage', {storageId, storageData})
            }
          })
          commit('setHomeStorageIds', { homeId: state.currentHomeId, storageIdArr })
          commit('setCurrentStorage', currentStorageId)
          resolve()
        })
        commit('addListener', newListener)
      })
    },
    fetchAllStorageContents ({dispatch, state}) {
      return new Promise((resolve) => {
        let storagePromises = []
        state.storageIds[state.currentHomeId].forEach(storageId => {
          storagePromises.push(dispatch('fetchOneStorageLocation', storageId))
        })
        resolve(Promise.all(storagePromises))
      })
    },
    fetchOneStorageLocation ({commit, state}, storageId) {
      return new Promise((resolve) => {
        let newListener = fb.allHomes.doc(state.currentHomeId).collection('StorageLocations').doc(storageId).collection('Contents').onSnapshot(contentSnapshot => {
          contentSnapshot.docChanges().forEach(contentChange => {
            if (contentChange.type === 'removed') {
              commit('deleteOneContent', {storageId, contentId: contentChange.doc.id})
            } else {
              commit('setOneContent', {storageId, contentId: contentChange.doc.id, contentData: contentChange.doc.data()})
            }
          })
          resolve()
        })
        commit('addListener', newListener)
      })
    },
    clearData ({commit, state}) {
      commit('setCurrentUser', null)
      commit('setUserProfile', {})
      commit('setCurrentHome', null)
      commit('setCurrentStorage', null)
      commit('setAllHomes', {})
      commit('setAllStorages', {})
      commit('setAllContents', {})
      commit('setDataLoaded', false)
      commit('clearStorageIds')
      state.allListeners.forEach(listener => {
        listener()
      })
      commit('flushListeners')
      console.log(state)
    },
    changeCurrentHome ({commit, dispatch, state}, homeId) {
      return new Promise((resolve, reject) => {
        if (state.homes[homeId]) {
          commit('setChangingHome', true)
          commit('setCurrentHome', homeId)
          dispatch('fetchStorageLocations', false).then(() => {
            dispatch('fetchAllStorageContents').then(() => {
              commit('setChangingHome', false)
              resolve()
            })
          })
        } else {
          reject(new Error(homeId + ' does not exist.'))
        }
      })
    }
  }
})

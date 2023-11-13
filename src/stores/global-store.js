import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    loadingState: false,
    loadingTitleState: 'Loading...'
  }),
  actions: {
    setLoadingState (payload) {
      this.loadingState = payload
    },
    setLoadingTitleState (payload) {
      this.loadingTitleState = payload
    }
  }
})

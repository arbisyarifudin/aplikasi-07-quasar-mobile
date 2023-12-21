import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    loadingState: false,
    loadingTitleState: 'Loading...',
    selectedUserArea: null,
    isUpdateAvailable: null,
    updateAvailableInfo: null
  }),
  actions: {
    setLoadingState (payload) {
      this.loadingState = payload
    },
    setLoadingTitleState (payload) {
      this.loadingTitleState = payload
    },

    setSelectedUserArea (payload) {
      this.selectedUserArea = payload
    },

    setIsUpdateAvailable (payload) {
      this.isUpdateAvailable = payload
    },
    setUpdateAvailableInfo (payload) {
      this.updateAvailableInfo = payload
    },
    async checkAvaiableUpdate (payload) {
      await api.get('v1/version/latest', {
        params: {
          platform: payload.platform || 'android'
        }
      })
        .then((res) => {
          // console.log('checkAvaiableUpdate res', res.data)

          const resData = res.data?.data ?? null

          if (resData) {
            console.log('APP_VERSION', `v${process.env.APP_VERSION}`)
            console.log('UPDATE_VERSION', `v${resData.version}`)

            // check if update available
            const isUpdateAvailable = resData.version !== process.env.APP_VERSION
            this.setIsUpdateAvailable(isUpdateAvailable)

            // set update info
            this.setUpdateAvailableInfo(resData)
          }
        })
        .catch((error) => {
          console.log('checkAvaiableUpdate error', error)
        })
    }
  }
})

<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>

    <UpdateInfoDialog :show="isUpdateAvailable" />
  </q-layout>
</template>

<script setup>
import UpdateInfoDialog from 'components/UI/UpdateInfoDialog.vue'

import { LocalStorage } from 'quasar'
import { useGlobalStore } from 'src/stores/global-store'
import { computed } from 'vue'

LocalStorage.remove('app_selected_user_area')

const globalStore = useGlobalStore()
const isUpdateAvailable = computed(() => {
  return globalStore.isUpdateAvailable
})
</script>

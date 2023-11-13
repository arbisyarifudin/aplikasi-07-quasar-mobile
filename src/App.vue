<template>
  <router-view />
  <!-- loading screen -->
  <q-dialog v-model="loading" persistent>
    <q-card class="bg-grey-8 text-white">
      <q-card-section class="row items-center">
        <q-spinner color="white" />
        <span class="q-ml-sm">{{ loadingTitle }}...</span>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useGlobalStore } from 'src/stores/global-store'

export default defineComponent({
  name: 'App',

  // eslint-disable-next-line space-before-function-paren
  setup() {
    const globalStore = useGlobalStore()

    return {
      loading: computed(() => {
        return globalStore.loadingState
      }),
      loadingTitle: computed(() => {
        return globalStore.loadingTitleState || 'Memuat'
      })
    }
  }
})
</script>

<template>
  <q-page class="main">
    <q-card>
      <q-card-section>
        <div class="flex items-center justify-between q-mb-md">
          <div class="text-h6 text-semibold">Pilih Wilayah Kerja:</div>
        </div>
        <q-list bordered separator>
          <q-item v-for="item in userArea" :key="item.user_area_id" clickable v-ripple class="q-py-md"
            @click="selectArea(item)" :active="selectedUserArea?.user_area_id === item.id">
            <q-item-section>
              <q-item-label style="line-height: 1.4em !important;" class="text-small">Kode: <span class="text-semibold">{{ item.area_code }}</span></q-item-label>
              <q-separator class="q-my-sm"/>
              <q-item-label style="line-height: 1.4em !important;" class="text-small">{{ item.area_name }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>

import { LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'
import { useGlobalStore } from 'src/stores/global-store'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const userArea = ref([])

const fetchUserArea = async () => {
  const { data } = await api.get('v1/user-area')
  userArea.value = data?.data?.data || []

  const localSelectedUserArea = LocalStorage.getItem('app_selected_user_area')
  if (localSelectedUserArea) {
    globalStore.setSelectedUserArea(localSelectedUserArea)
  }
}

fetchUserArea()

/*  */
const $router = useRouter()

const globalStore = useGlobalStore()
const selectedUserArea = computed(() => globalStore.selectedUserArea)

const selectArea = async (item) => {
  globalStore.setSelectedUserArea(item)
  LocalStorage.set('app_selected_user_area', item)

  const routeParamsId = $router.currentRoute.value.query?.id
  if (routeParamsId) {
    $router.push({ name: 'Constituent Edit Page', params: { id: routeParamsId }, query: { area_id: item.id } })
  } else {
    $router.push({ name: 'Constituent Create Page' })
  }
}

/*  */

</script>

<template>
  <q-page class="main">
    <q-form @submit="submitForm" @reset="resetForm" class="q-gutter-md">
      <q-card>
        <q-card-section>
          <div class="flex items-center justify-between">
            <div class="text-h6 text-semibold">Input TPS</div>
            <div class="text-small text-warning">*) wajib</div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pb-none">
          <div class="q-mb-sm" v-if="selectedUserArea">
            <div class="text-small text-semibold q-mb-sm block">Wilayah Kerja:</div>
            <div class="text-small text-warning text-semibold">
              <!-- Kabupaten Bantul, Kapanewon Banguntapan, Desa Banguntapan, Dusun Durian -->
              {{ selectedUserArea.area_code }} - {{ selectedUserArea.area_name }}
              <q-btn dense size="sm" flat no-caps color="grey-2" class="q-ml-sm" :to="{ name: 'TPS Select Area Page' }">
                <ph-icon name="PencilSimple" size="15" />
              </q-btn>
            </div>

            <div class="text-small text-negative q-mt-md" v-if="errorState?.user_area_id?.length">
              <div class="flex items-center">
                <ph-icon name="Info" weight="fill" class="q-mr-sm" size="20"></ph-icon>
                <span>{{ errorState.user_area_id }}</span>
              </div>
            </div>
          </div>
          <div class="q-mb-sm" v-else-if="!selectedUserArea">
            <AreaSelector :data="state" :errors="errorState" :auto-fetch="areaNeedAutoFetch" @change="onChangeAreaSelector" />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-mb-sm">
            <label for="tps_name" class="text-small text-semibold q-mb-sm block">Nama <span
                class="text-warning">*</span></label>
            <q-input id="tps_name" name="tps_name" v-model="state.name" placeholder="Masukkan nama/nomor TPS" outlined
              dense :error="errorState?.name?.length > 0" :error-message="errorState?.name"
              @update:model-value="errorState.name = ''" hide-bottom-space hint="Misal: TPS 001, TPS 002, dst" />
          </div>
          <div class="q-mb-sm">
            <label for="tps_address" class="text-small text-semibold q-mb-sm block">Alamat <span
                class="text-warning text-caption">[tidak wajib]</span></label>
            <q-input id="tps_address" name="tps_address" type="textarea" autogrow input-style="min-height: 80px"
              v-model="state.address" placeholder="Masukkan alamat TPS" outlined dense
              :error="errorState?.address?.length > 0" :error-message="errorState?.address"
              @update:model-value="errorState.address = ''" hide-bottom-space hint="Misal: Jl. Raya Banguntapan No. 1" />
          </div>
          <div class="q-mb-sm">
            <label for="tps_note" class="text-small text-semibold q-mb-sm block">Keterangan <span
                class="text-warning text-caption">[tidak wajib]</span></label>
            <q-input id="tps_note" name="tps_note" type="textarea" autogrow input-style="min-height: 80px"
              v-model="state.note" placeholder="Masukkan keterangan tambahan jika perlu" outlined dense
              :error="errorState?.note?.length > 0" :error-message="errorState?.note"
              @update:model-value="errorState.note = ''" hide-bottom-space />
          </div>
        </q-card-section>
        <q-card-section class="q-py-none hidden">
          <div class="flex justify-center">
            <q-btn dense no-caps size="sm" flat>
              <ph-icon name="Plus" size="16" class="q-mr-sm" />
              <span>Tambah TPS</span>
            </q-btn>
          </div>
        </q-card-section>
        <!-- </q-card> -->
        <!-- <q-card class="q-mt-none"> -->
        <q-card-actions align="between">
          <q-btn type="reset" no-caps size="sm" color="warning" flat :to="{ name: 'TPS Index Page' }">
            <ph-icon name="X" size="16" class="q-mr-sm" />
            <span>Batal</span>
          </q-btn>
          <q-btn type="submit" no-caps size="sm" color="primary" text-color="dark" :loading="submitLoading"
            :disable="submitLoading">
            <ph-icon name="FloppyDisk" size="16" class="q-mr-sm" />
            <span>Simpan & Kirim</span>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { LocalStorage, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useGlobalStore } from 'src/stores/global-store'
import { mapErrorMessage } from 'src/utils/error'
import { showNotification } from 'src/utils/ui'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AreaSelector from 'src/components/form/AreaSelector.vue'

const state = ref({
  name: '',
  address: '',
  note: '',
  user_area_id: '',

  regency_id: '',
  district_id: '',
  village_id: '',
  subvillage_id: '',
  subvillage_name: ''
})

const errorState = ref({
  name: '',
  address: '',
  note: '',
  user_area_id: '',

  regency_id: '',
  district_id: '',
  village_id: '',
  subvillage_id: '',
  subvillage_name: ''
})

const resetForm = () => {
  state.value = {
    name: '',
    address: '',
    note: '',
    user_area_id: '',

    regency_id: '',
    district_id: '',
    village_id: '',
    subvillage_id: '',
    subvillage_name: ''
  }

  errorState.value = {
    name: '',
    address: '',
    note: '',
    user_area_id: '',

    regency_id: '',
    district_id: '',
    village_id: '',
    subvillage_id: '',
    subvillage_name: ''
  }
}

const $q = useQuasar()
const submitLoading = ref(false)

const submitForm = () => {
  console.log('submit', state.value)

  // reset error
  errorState.value = {
    name: '',
    address: '',
    note: '',
    user_area_id: '',

    regency_id: '',
    district_id: '',
    village_id: '',
    subvillage_id: '',
    subvillage_name: ''
  }

  submitLoading.value = true
  api.post('v1/area-polling', state.value)
    .then(async (res) => {
      console.log('res', res)
      showNotification('TPS berhasil ditambahkan', 'positive', 'check')
      // await $router.push({ name: 'TPS Index Page', query: { refresh: true } })
      await $router.push({ name: 'TPS Detail Page', params: { id: res.data.data.id }, query: { refresh: true } })
      submitLoading.value = false
      resetForm()
    })
    .catch((err) => {
      console.log('err', err)
      const errorResponse = err.response
      submitLoading.value = false
      if (errorResponse.status === 422) {
        errorState.value = mapErrorMessage(errorResponse.data.errors)
        showNotification('Input tidak valid. Mohon periksa kembali', 'warning')
      } else {
        // show alert error
        $q.notify({
          message: errorResponse.data.message,
          color: 'negative',
          position: 'top',
          icon: 'error',
          timeout: 2000
        })
      }
    })
}

/* AREA */
const $router = useRouter()
const globalStore = useGlobalStore()
const selectedUserArea = computed(() => globalStore.selectedUserArea)

// eslint-disable-next-line no-unused-vars
const checkSelectedUserArea = () => {
  // console.log('selectedUserArea', selectedUserArea.value)
  if (selectedUserArea.value) {
    state.value.user_area_id = selectedUserArea.value.id
  } else {
    // check local storage
    const localSelectedUserArea = LocalStorage.getItem('app_selected_user_area')
    if (localSelectedUserArea) {
      globalStore.setSelectedUserArea(localSelectedUserArea)
      state.value.user_area_id = localSelectedUserArea.id
    } else {
      // $router.push({ name: 'TPS Select Area Page' })
    }
  }
}

onMounted(() => {
  resetForm()
  // checkSelectedUserArea()
})

watch(() => selectedUserArea.value, (val) => {
  // checkSelectedUserArea()
})

watch(() => $router.currentRoute.value.name, (val) => {
  // resetForm()
  if (val) {
    // checkSelectedUserArea()
  }
})

/* AREA SELECTOR */
const areaNeedAutoFetch = computed(() => {
  if (state.value.name || state.value.address || state.value.note) {
    return false
  }

  return true
})

const localSelectedArea = ref(null)
onMounted(() => {
  localSelectedArea.value = LocalStorage.getItem('app_selected_area')
  if (localSelectedArea.value) {
    state.value.subvillage_id = localSelectedArea.value.subvillage_id
    state.value.subvillage_name = localSelectedArea.value.subvillage_name
    state.value.village_id = localSelectedArea.value.village_id
    state.value.district_id = localSelectedArea.value.district_id
    state.value.regency_id = localSelectedArea.value.regency_id
  }
})

const onChangeAreaSelector = (payload) => {
  // console.log('onChangeAreaSelector', payload)
  // payload: {
  //   subvillage_id: null,
  //   subvillage_name: val,
  //   village_id: state.value.village_id,
  //   district_id: state.value.district_id,
  //   regency_id: state.value.regency_id
  // }

  state.value.subvillage_id = payload.subvillage_id
  state.value.subvillage_name = payload.subvillage_name
  state.value.village_id = payload.village_id
  state.value.district_id = payload.district_id
  state.value.regency_id = payload.regency_id
}

</script>

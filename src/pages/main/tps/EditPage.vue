<template>
  <q-page class="main">
    <q-form @submit="submitForm" @reset="resetForm" class="q-gutter-md">
      <q-card>
        <q-card-section>
          <div class="flex items-center justify-between">
            <div class="text-h6 text-semibold">Ubah TPS</div>
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
              <q-btn dense size="sm" flat no-caps color="grey-2" class="q-ml-sm" :to="{ name: 'TPS Select Area Page', query: { id: detailData.id } }">
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
          <div class="q-mb-sm hidden" v-else-if="!selectedUserArea && (detailData.id && !detailData.user_area_id)">
            <span>Pilih wilayah kerja:</span>
            <q-btn dense size="sm" flat no-caps color="primary" class="q-ml-sm" :to="{ name: 'TPS Select Area Page' }">
              <ph-icon name="PencilSimple" size="15" /> Pilih
            </q-btn>
          </div>
          <div class="flex items-center" v-if="fetchLoading">
            <q-spinner />
            <span class="text-small q-ml-sm text-grey-6">Memuat data...</span>
          </div>
          <div class="q-mb-sm" v-else-if="!selectedUserArea">
            <AreaSelector mode="edit" :data="state" :errors="errorState" :auto-fetch="true" @change="onChangeAreaSelector" />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-mb-sm">
            <label for="tps_name" class="text-small text-semibold q-mb-sm block">Nama <span
                class="text-warning">*</span></label>
            <q-input id="tps_name" name="tps_name" v-model="state.name" placeholder="Masukkan nama/nomor TPS" outlined
              dense :error="errorState?.name?.length > 0" :error-message="errorState?.name"
              @update:model-value="errorState.name = ''" :disable="fetchLoading" hide-bottom-space
              hint="Misal: TPS 001, TPS 002, dst" />
          </div>
          <div class="q-mb-sm">
            <label for="tps_address" class="text-small text-semibold q-mb-sm block">Alamat <span
                class="text-warning text-caption">[tidak wajib]</span></label>
            <q-input id="tps_address" name="tps_address" type="textarea" autogrow input-style="min-height: 80px"
              v-model="state.address" placeholder="Masukkan alamat TPS" outlined dense
              :error="errorState?.address?.length > 0" :error-message="errorState?.address"
              @update:model-value="errorState.address = ''" :disable="fetchLoading" hide-bottom-space hint="Misal: Jl. Raya Banguntapan No. 1" />
          </div>
          <div class="q-mb-sm">
            <label for="tps_note" class="text-small text-semibold q-mb-sm block">Keterangan <span
                class="text-warning text-caption">[tidak wajib]</span></label>
            <q-input id="tps_note" name="tps_note" type="textarea" autogrow input-style="min-height: 80px"
              v-model="state.note" placeholder="Masukkan keterangan tambahan jika perlu" outlined dense
              :error="errorState?.note?.length > 0" :error-message="errorState?.note"
              @update:model-value="errorState.note = ''" :disable="fetchLoading" hide-bottom-space />
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
          <q-btn type="reset" no-caps size="sm" color="warning" flat
            :to="{ name: 'TPS Index Page', query: { refresh: backPageNeedRefresh } }">
            <ph-icon name="ArrowUUpLeft" size="16" class="q-mr-sm" />
            <span>Kembali</span>
          </q-btn>
          <q-btn type="submit" no-caps size="sm" color="primary" text-color="dark"
            :loading="submitLoading || fetchLoading" :disable="submitLoading || fetchLoading">
            <ph-icon name="FloppyDisk" size="16" class="q-mr-sm" />
            <span>Simpan Perubahan</span>
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
import { useRoute, useRouter } from 'vue-router'

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

const $route = useRoute()
const fetchLoading = ref(false)
const detailData = ref({})
const getDetail = async () => {
  const id = $route.params.id
  fetchLoading.value = true

  // get detail tps data
  await api.get('v1/area-polling/' + id)
    .then(async (res) => {
      console.log('res', res.data)
      detailData.value = res.data.data
      state.value = JSON.parse(JSON.stringify({
        name: detailData.value.name,
        address: detailData.value.address,
        note: detailData.value.note,
        user_area_id: detailData.value.user_area_id,

        regency_id: detailData.value.regency_id,
        district_id: detailData.value.district_id,
        village_id: detailData.value.village_id,
        subvillage_id: detailData.value.subvillage_id,
        subvillage_name: detailData.value.subvillage_name
      }))

      // console.log('state.value', state.value)

      // get detail user area data
      if (!$route.query?.area_id) {
        // await getDetailArea()
      } else {
        if (selectedUserArea.value) {
          // state.value.user_area_id = selectedUserArea.value.id
        } else {
          // state.value.user_area_id = $route.query.area_id
          // await getDetailArea()
        }
        // fetchLoading.value = false
      }
      fetchLoading.value = false
    })
    .catch(async (err) => {
      console.log('err', err)
      fetchLoading.value = false
      const errorResponse = err.response

      // show alert error
      $q.notify({
        message: errorResponse.data.message,
        color: 'negative',
        position: 'top',
        icon: 'error',
        timeout: 2000
      })

      if (errorResponse.status === 404) {
        await $router.push({ name: 'TPS Index Page', query: { refresh: true } })
      }
    })
}

// eslint-disable-next-line no-unused-vars
const getDetailArea = async () => {
  await api.get('v1/user-area/' + detailData.value.user_area_id)
    .then((res) => {
      console.log('res', res)
      globalStore.setSelectedUserArea(res.data.data)
      fetchLoading.value = false
    })
    .catch((err) => {
      console.log('err', err)
      fetchLoading.value = false

      state.value.user_area_id = selectedUserArea.value.id ? selectedUserArea.value.id : ''
    })
}

onMounted(() => {
  resetForm()
  getDetail()
})

watch(() => $route.params.id, (val) => {
  if (val) {
    resetForm()
    getDetail()
  }
})

const $q = useQuasar()
const submitLoading = ref(false)
const backPageNeedRefresh = ref(false)

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
  api.put('v1/area-polling/' + detailData.value.id, {
    name: state.value.name,
    address: state.value.address,
    note: state.value.note,
    user_area_id: state.value.user_area_id,

    regency_id: state.value.regency_id,
    district_id: state.value.district_id,
    village_id: state.value.village_id,
    subvillage_id: state.value.subvillage_id,
    subvillage_name: state.value.subvillage_name
  })
    .then(async (res) => {
      console.log('res', res)
      showNotification('Konstituen berhasil diperbarui', 'positive', 'check')
      // await $router.push({ name: 'TPS Index Page', query: { refresh: true } })
      submitLoading.value = false
      backPageNeedRefresh.value = true
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
// eslint-disable-next-line no-unused-vars
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

watch(() => selectedUserArea.value, (val) => {
  // checkSelectedUserArea()
})

/* AREA SELECTOR */
// const localSelectedArea = ref(null)
// onMounted(() => {
//   localSelectedArea.value = LocalStorage.getItem('app_selected_area')
//   if (localSelectedArea.value) {
//     state.value.subvillage_id = localSelectedArea.value.subvillage_id
//     state.value.subvillage_name = localSelectedArea.value.subvillage_name
//     state.value.village_id = localSelectedArea.value.village_id
//     state.value.district_id = localSelectedArea.value.district_id
//     state.value.regency_id = localSelectedArea.value.regency_id
//   }
// })

const onChangeAreaSelector = (payload) => {
  // console.log('onChangeAreaSelector', payload)
  // payload: {
  //   subvillage_id: null,
  //   subvillage_name: val,
  //   village_id: state.value.village_id,
  //   district_id: state.value.district_id,
  //   regency_id: state.value.regency_id
  // }

  state.value.user_area_id = null
  state.value.subvillage_id = payload.subvillage_id
  state.value.subvillage_name = payload.subvillage_name
  state.value.village_id = payload.village_id
  state.value.district_id = payload.district_id
  state.value.regency_id = payload.regency_id
}

</script>

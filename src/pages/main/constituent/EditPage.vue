<template>
  <q-page class="main">
    <q-form @submit="submitForm" @reset="resetForm" class="q-gutter-md">
      <q-card>
        <q-card-section>
          <div class="flex items-center justify-between">
            <div class="text-h6 text-semibold">Ubah Konstituen</div>
            <div class="text-small text-warning">*) wajib</div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pb-none">
          <div class="q-mb-sm" v-if="selectedUserArea">
            <div class="text-small text-semibold q-mb-sm block">Wilayah Kerja:</div>
            <div class="text-small text-warning text-semibold">
              <!-- Kabupaten Bantul, Kapanewon Banguntapan, Desa Banguntapan, Dusun Durian -->
              {{ selectedUserArea.area_name }}
              <q-btn dense size="sm" flat no-caps color="grey-2" class="q-ml-sm"
                :to="{ name: 'Constituent Select Area Page', query: { id: detailData.id } }">
                <ph-icon name="PencilSimple" size="15" />
              </q-btn>
            </div>
          </div>
          <div class="flex items-center" v-if="fetchLoading">
            <q-spinner />
            <span class="text-small q-ml-sm text-grey-6">Memuat data...</span>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-mb-sm">
            <label for="constituent_name" class="text-small text-semibold q-mb-sm block">Nama <span
                class="text-warning">*</span></label>
            <q-input id="constituent_name" name="constituent_name" v-model="state.name"
              placeholder="Masukkan nama konstituen" outlined dense :error="errorState?.name?.length > 0"
              :error-message="errorState?.name" @update:model-value="errorState.name = ''" :disable="fetchLoading"
              hide-bottom-space />
          </div>
          <div class="q-mb-sm">
            <label for="constituent_nik" class="text-small text-semibold q-mb-sm block">NIK <span
                class="text-warning text-caption">[tidak wajib]</span></label>
            <q-input id="constituent_nik" name="constituent_nik" v-model="state.nik" placeholder="Masukkan NIK konstituen"
              outlined dense :error="errorState?.nik?.length > 0" :error-message="errorState?.nik"
              @update:model-value="errorState.nik = ''" :disable="fetchLoading" hide-bottom-space />
          </div>
          <div class="q-mb-sm">
            <label for="constituent_phone" class="text-small text-semibold q-mb-sm block">No. HP / WA <span
                class="text-warning text-caption">[tidak wajib]</span></label>
            <q-input id="constituent_phone" name="constituent_phone" v-model="state.phone"
              placeholder="Masukkan No. HP konstituen" outlined dense :error="errorState?.phone?.length > 0"
              :error-message="errorState?.phone" @update:model-value="errorState.phone = ''" :disable="fetchLoading"
              hide-bottom-space />
          </div>
          <div class="q-mb-sm">
            <label for="constituent_address" class="text-small text-semibold q-mb-sm block">Alamat <span
                class="text-warning text-caption">[tidak wajib]</span></label>
            <q-input id="constituent_address" name="constituent_address" type="textarea" autogrow
              input-style="min-height: 80px" v-model="state.address" placeholder="Masukkan alamat konstituen" outlined
              dense :error="errorState?.address?.length > 0" :error-message="errorState?.address"
              @update:model-value="errorState.address = ''" :disable="fetchLoading" hide-bottom-space />
          </div>
          <div class="q-mb-sm">
            <label for="constituent_note" class="text-small text-semibold q-mb-sm block">Keterangan <span
                class="text-warning text-caption">[tidak wajib]</span></label>
            <q-input id="constituent_note" name="constituent_note" type="textarea" autogrow
              input-style="min-height: 80px" v-model="state.note" placeholder="Masukkan keterangan tambahan jika perlu" outlined
              dense :error="errorState?.note?.length > 0" :error-message="errorState?.note"
              @update:model-value="errorState.note = ''" hide-bottom-space />
          </div>
        </q-card-section>
        <q-card-section class="q-py-none hidden">
          <div class="flex justify-center">
            <q-btn dense no-caps size="sm" flat>
              <ph-icon name="Plus" size="16" class="q-mr-sm" />
              <span>Tambah Konstituen</span>
            </q-btn>
          </div>
        </q-card-section>
        <!-- </q-card> -->
        <!-- <q-card class="q-mt-none"> -->
        <q-card-actions align="between">
          <q-btn type="reset" no-caps size="md" color="warning" flat
            :to="{ name: 'Constituent Index Page', query: { refresh: backPageNeedRefresh } }">
            <ph-icon name="ArrowUUpLeft" size="16" class="q-mr-sm" />
            <span>Kembali</span>
          </q-btn>
          <q-btn type="submit" no-caps size="md" color="primary" text-color="dark"
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

const state = ref({
  name: '',
  nik: '',
  phone: '',
  address: '',
  note: '',
  user_area_id: ''
})

const errorState = ref({
  name: '',
  nik: '',
  phone: '',
  address: '',
  note: '',
  user_area_id: ''
})

const resetForm = () => {
  state.value = {
    name: '',
    nik: '',
    phone: '',
    address: '',
    note: '',
    user_area_id: ''
  }

  errorState.value = {
    name: '',
    nik: '',
    phone: '',
    address: '',
    note: '',
    user_area_id: ''
  }
}

const $route = useRoute()
const fetchLoading = ref(false)
const detailData = ref({})
const getDetail = async () => {
  const id = $route.params.id
  fetchLoading.value = true

  // get detail constituent data
  await api.get('v1/constituent/' + id)
    .then(async (res) => {
      console.log('res', res)
      detailData.value = res.data.data
      state.value = JSON.parse(JSON.stringify(detailData.value))

      // get detail user area data
      if (!$route.query?.area_id) {
        await getDetailArea()
      } else {
        if (selectedUserArea.value) {
          state.value.user_area_id = selectedUserArea.value.id
        } else {
          // state.value.user_area_id = $route.query.area_id
          await getDetailArea()
        }
        fetchLoading.value = false
      }
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
        await $router.push({ name: 'Constituent Index Page', query: { refresh: true } })
      }
    })
}

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
    nik: '',
    phone: '',
    address: '',
    note: '',
    user_area_id: ''
  }

  submitLoading.value = true
  api.put('v1/constituent/' + detailData.value.id, state.value)
    .then(async (res) => {
      console.log('res', res)
      showNotification('Konstituen berhasil diperbarui', 'positive', 'check')
      // await $router.push({ name: 'Constituent Index Page', query: { refresh: true } })
      submitLoading.value = false
      backPageNeedRefresh.value = true
    })
    .catch((err) => {
      console.log('err', err)
      const errorResponse = err.response
      submitLoading.value = false
      if (errorResponse.status === 422) {
        errorState.value = mapErrorMessage(errorResponse.data.errors)
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
      $router.push({ name: 'Constituent Select Area Page' })
    }
  }
}

watch(() => selectedUserArea.value, (val) => {
  checkSelectedUserArea()
})

</script>

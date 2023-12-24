<template>
  <q-page class="main">
    <q-form @submit="submitForm" @reset="resetForm" class="q-gutter-md">
      <q-card>
        <q-card-section>
          <div class="flex items-center justify-between">
            <div class="text-h6 text-semibold">Input Konstituen</div>
            <div class="text-small text-warning">*) wajib</div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pb-none">
          <div class="q-mb-md" v-if="selectedUserArea">
            <div class="text-small text-semibold q-mb-sm block">Wilayah Kerja:</div>
            <div class="text-small text-warning text-semibold">
              <!-- Kabupaten Bantul, Kapanewon Banguntapan, Desa Banguntapan, Dusun Durian -->
              {{ selectedUserArea.area_code }} - {{ selectedUserArea.area_name }}
              <q-btn dense size="sm" flat no-caps color="grey-2" class="q-ml-sm"
                :to="{ name: 'Constituent Select Area Page' }">
                <ph-icon name="PencilSimple" size="15" />
              </q-btn>
            </div>
          </div>
          <div class="q-mb-md" v-else-if="!selectedUserArea">
            <AreaSelector :data="state" :errors="errorState" :auto-fetch="areaNeedAutoFetch" @change="onChangeAreaSelector" />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-mb-md">
            <label for="constituent_name" class="text-small text-semibold q-mb-sm block">Nama <span
                class="text-warning">*</span></label>
            <q-input id="constituent_name" name="constituent_name" v-model="state.name"
              placeholder="Masukkan nama konstituen" outlined dense :error="errorState?.name?.length > 0"
              :error-message="errorState?.name" @update:model-value="errorState.name = ''" hide-bottom-space />
          </div>
          <div class="q-mb-md">
            <label for="constituent_nik" class="text-small text-semibold q-mb-sm block">NIK <span
                class="text-warning text-caption">[tidak wajib]</span></label>
            <q-input id="constituent_nik" name="constituent_nik" v-model="state.nik" placeholder="Masukkan NIK konstituen"
              outlined dense :error="errorState?.nik?.length > 0" :error-message="errorState?.nik"
              @update:model-value="errorState.nik = ''" hide-bottom-space />
          </div>
          <div class="q-mb-md">
            <label for="constituent_phone" class="text-small text-semibold q-mb-sm block">No. HP / WA <span
                class="text-warning text-caption">[tidak wajib]</span></label>
            <q-input id="constituent_phone" name="constituent_phone" v-model="state.phone"
              placeholder="Masukkan No. HP konstituen" outlined dense :error="errorState?.phone?.length > 0"
              :error-message="errorState?.phone" @update:model-value="errorState.phone = ''" hide-bottom-space />
          </div>

          <div class="q-mb-md">
            <label for="constituent_address" class="text-small text-semibold q-mb-sm block">Alamat <span
                class="text-warning text-caption">[tidak wajib]</span></label>
            <q-input id="constituent_address" name="constituent_address" type="textarea" autogrow
              input-style="min-height: 80px" v-model="state.address" placeholder="Masukkan alamat konstituen" outlined
              dense :error="errorState?.address?.length > 0" :error-message="errorState?.address"
              @update:model-value="errorState.address = ''" hide-bottom-space />
          </div>

          <div class="q-mb-md">
            <label for="constituent_is_stickered" class="text-small text-semibold q-mb-sm block">Stiker</label>
            <div class="flex items-center">
              <q-toggle id="constituent_is_stickered" name="constituent_is_stickered" v-model="state.is_stickered" :true-value="1" :false-value="0"
                color="primary" dense size="sm" class="q-mr-sm" />
              <div class="text-small">Apakah sudah ditempeli stiker?</div>
            </div>
          </div>

          <div class="q-mb-md">
            <label for="constituent_sticker_photo" class="text-small text-semibold q-mb-sm block">Foto Stiker <span
                class="text-warning text-caption">[tidak wajib]</span></label>
            <q-card>
              <q-card-section v-if="capturedImageUrl">
                <q-img :src="capturedImageUrl" class="image-captured" />
              </q-card-section>
              <q-card-section>
                <q-btn outlined color="grey-9" text-color="white" class="full-width" @click="captureImage">
                  <ph-icon name="Camera" />
                </q-btn>
                <div class="q-mt-sm text-center text-caption">Klik untuk ambil foto</div>
                <div class="q-mt-sm text-center text-small text-negative q-mt-sm" v-if="errorState.sticker_photo?.length">
                  {{ errorState.sticker_photo }}</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="q-mb-md">
            <label for="constituent_received_aid_program" class="text-small text-semibold q-mb-sm block">Program
              Bantuan <span class="text-warning text-caption">[tidak wajib]</span></label>
            <q-input id="constituent_received_aid_program" name="constituent_received_aid_program" type="textarea"
              autogrow input-style="min-height: 60px" v-model="state.received_aid_program"
              placeholder="Masukkan program bantuan yang diterima" outlined dense
              :error="errorState?.received_aid_program?.length > 0" :error-message="errorState?.received_aid_program"
              @update:model-value="errorState.received_aid_program = ''" hide-bottom-space hint="Misal: PKH, BST, BPNT, BST, BLT, dll" />
          </div>

          <div class="q-mb-md">
            <label for="constituent_note" class="text-small text-semibold q-mb-sm block">Keterangan <span
                class="text-warning text-caption">[tidak wajib]</span></label>
            <q-input id="constituent_note" name="constituent_note" type="textarea" autogrow input-style="min-height: 80px"
              v-model="state.note" placeholder="Masukkan keterangan tambahan jika perlu" outlined dense
              :error="errorState?.note?.length > 0" :error-message="errorState?.note"
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
          <q-btn type="reset" no-caps size="sm" color="warning" flat :to="{ name: 'Constituent Index Page' }">
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
import { LocalStorage, useQuasar, Platform } from 'quasar'
import { api } from 'src/boot/axios'
import { useGlobalStore } from 'src/stores/global-store'
import { mapErrorMessage } from 'src/utils/error'
import { showNotification } from 'src/utils/ui'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { Camera } from '@capacitor/camera'

import AreaSelector from 'src/components/form/AreaSelector.vue'

const state = ref({
  name: '',
  nik: '',
  phone: '',
  address: '',
  note: '',
  user_area_id: '',

  is_stickered: false,
  sticker_photo: '',
  received_aid_program: '',

  regency_id: '',
  district_id: '',
  village_id: '',
  subvillage_id: '',
  subvillage_name: ''
})

const errorState = ref({
  name: '',
  nik: '',
  phone: '',
  address: '',
  note: '',
  user_area_id: '',

  is_stickered: '',
  sticker_photo: '',
  received_aid_program: '',

  regency_id: '',
  district_id: '',
  village_id: '',
  subvillage_id: '',
  subvillage_name: ''
})

const resetForm = () => {
  state.value = {
    name: '',
    nik: '',
    phone: '',
    address: '',
    note: '',
    user_area_id: '',

    is_stickered: false,
    sticker_photo: null,
    received_aid_program: '',

    regency_id: '',
    district_id: '',
    village_id: '',
    subvillage_id: '',
    subvillage_name: ''
  }

  errorState.value = {
    name: '',
    nik: '',
    phone: '',
    address: '',
    note: '',
    user_area_id: '',

    is_stickered: '',
    sticker_photo: '',
    received_aid_program: '',

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
    nik: '',
    phone: '',
    address: '',
    note: '',
    user_area_id: '',

    is_stickered: '',
    sticker_photo: '',
    received_aid_program: '',

    regency_id: '',
    district_id: '',
    village_id: '',
    subvillage_id: '',
    subvillage_name: ''
  }

  submitLoading.value = true

  const formData = new FormData()
  formData.append('name', state.value.name)
  formData.append('nik', state.value.nik ?? '')
  formData.append('phone', state.value.phone ?? '')
  formData.append('address', state.value.address ?? '')
  formData.append('note', state.value.note ?? '')
  formData.append('user_area_id', state.value.user_area_id ?? '')

  formData.append('is_stickered', state.value.is_stickered ? 1 : 0)
  formData.append('sticker_photo', state.value.sticker_photo ?? '')
  formData.append('received_aid_program', state.value.received_aid_program ?? '')

  formData.append('regency_id', state.value.regency_id ?? '')
  formData.append('district_id', state.value.district_id ?? '')
  formData.append('village_id', state.value.village_id ?? '')
  formData.append('subvillage_id', state.value.subvillage_id ?? '')
  formData.append('subvillage_name', state.value.subvillage_name ?? '')

  api.post('v1/constituent', formData)
    .then(async (res) => {
      console.log('res', res)
      showNotification('Konstituen berhasil ditambahkan', 'positive', 'check')
      await $router.push({ name: 'Constituent Index Page', query: { refresh: true } })
      submitLoading.value = false
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
      // $router.push({ name: 'Constituent Select Area Page' })
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
  if (state.value.name || state.value.nik || state.value.phone || state.value.address || state.value.note || state.value.received_aid_program || state.value.is_stickered || state.value.sticker_photo) {
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

/* CAMERA (capacitor/ionic) */
const capturedImageUrl = ref(null)
async function captureImage () {
  // const check = await Camera.checkPermissions()
  // console.log('check', check)

  if (Platform.is.nativeMobile) {
    try {
      const request = await Camera.requestPermissions({
        permissions: ['camera']
      })
      console.log('requestPermissions', JSON.stringify(request))
    } catch (error) {
      console.log('error requestPermissions', JSON.stringify(error))
    }
  }

  try {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      saveToGallery: false,
      source: 'CAMERA',
      resultType: 'uri'
    })

    capturedImageUrl.value = image.webPath

    const blob = await convertImagePathToBlob(image.webPath)
    state.value.sticker_photo = blob
  } catch (error) {
    console.log('getPhoto error', JSON.stringify(error))
  }
}

const convertImagePathToBlob = async (image) => {
  const response = await fetch(image)
  const blob = await response.blob()
  return blob
}

</script>

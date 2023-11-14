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
              {{ selectedUserArea.area_name }}
              <q-btn dense size="sm" flat no-caps color="grey-2" class="q-ml-sm"
                :to="{ name: 'Constituent Select Area Page' }">
                <ph-icon name="PencilSimple" size="15" />
              </q-btn>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-mb-sm">
            <label for="tps_name" class="text-small text-semibold q-mb-sm block">Nama <span
                class="text-warning">*</span></label>
            <q-input id="tps_name" name="tps_name" v-model="state.name" placeholder="Masukkan nama TPS" outlined dense
              :error="errorState?.name?.length > 0" :error-message="errorState?.name"
              @update:model-value="errorState.name = ''" hide-bottom-space />
          </div>
          <div class="q-mb-sm">
            <label for="tps_address" class="text-small text-semibold q-mb-sm block">Alamat <span
                class="text-warning">*</span></label>
            <q-input id="tps_address" name="tps_address" type="textarea" autogrow input-style="min-height: 80px"
              v-model="state.address" placeholder="Masukkan alamat TPS" outlined dense
              :error="errorState?.address?.length > 0" :error-message="errorState?.address"
              @update:model-value="errorState.address = ''" hide-bottom-space />
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
          <q-btn type="reset" no-caps size="md" color="warning" flat :to="{ name: 'Constituent Index Page' }">
            <ph-icon name="X" size="16" class="q-mr-sm" />
            <span>Batal</span>
          </q-btn>
          <q-btn type="submit" no-caps size="md" color="primary" text-color="dark" :loading="submitLoading"
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

const state = ref({
  name: '',
  nik: '',
  phone: '',
  address: '',
  user_area_id: ''
})

const errorState = ref({
  name: '',
  nik: '',
  phone: '',
  address: '',
  user_area_id: ''
})

const resetForm = () => {
  state.value = {
    name: '',
    nik: '',
    phone: '',
    address: '',
    user_area_id: ''
  }

  errorState.value = {
    name: '',
    nik: '',
    phone: '',
    address: '',
    user_area_id: ''
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
    user_area_id: ''
  }

  submitLoading.value = true
  api.post('v1/tps', state.value)
    .then(async (res) => {
      console.log('res', res)
      showNotification('TPS berhasil ditambahkan', 'positive', 'check')
      await $router.push({ name: 'Constituent Index Page', query: { refresh: true } })
      submitLoading.value = false
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

onMounted(() => {
  resetForm()
  checkSelectedUserArea()
})

watch(() => selectedUserArea.value, (val) => {
  checkSelectedUserArea()
})

watch(() => $router.currentRoute.value.name, (val) => {
  // resetForm()
  if (val) {
    checkSelectedUserArea()
  }
})

</script>

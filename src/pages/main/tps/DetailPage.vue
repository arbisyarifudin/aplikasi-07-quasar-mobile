<template>
  <q-page class="main">
    <q-card>
      <q-card-section>
        <div class="flex items-center justify-between">
          <div class="text-h6 text-semibold">Detail TPS</div>
          <q-btn type="reset" no-caps size="sm" color="warning" flat :to="{ name: 'TPS Index Page' }">
            <ph-icon name="ArrowUUpLeft" size="15" class="q-mr-sm" />
            <span>Kembali</span>
          </q-btn>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pb-none">
        <div class="q-mb-sm" v-if="area">
          <div class="text-small text-semibold q-mb-sm block">Wilayah Kerja:</div>
          <div class="text-small text-warning text-semibold">
            <!-- Kabupaten Bantul, Kapanewon Banguntapan, Desa Banguntapan, Dusun Durian -->
            {{ area.code }} - {{ area.name }}
          </div>
        </div>
        <div class="flex items-center" v-if="fetchLoading">
          <q-spinner />
          <span class="text-small q-ml-sm text-grey-6">Memuat data...</span>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="q-mb-md">
          <label for="tps_name" class="text-small q-mb-sm block">Nama</label>
          <div class="text-semibold ">{{ detailData.name }}</div>
        </div>
        <div class="q-mb-sm">
          <label for="tps_address" class="text-small q-mb-sm block">Alamat</label>
          <div class="text-small text-italic" style="font-size: 10px; line-height: 16px;">{{ detailData.address }}</div>
        </div>
        <div class="q-mb-sm">
          <label for="tps_note" class="text-small q-mb-sm block">Keterangan</label>
          <div class="text-small text-italic" style="font-size: 10px; line-height: 16px;">{{ detailData.note }}</div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="flex justify-center">
          <q-btn no-caps size="sm" outline color="info" :to="{ name: 'TPS Edit Page', params: { id: $route.params.id } }">
            <ph-icon name="PencilSimple" size="16" class="q-mr-sm" />
            <span>Ubah TPS</span>
          </q-btn>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-semibold block">Saksi TPS</div>
        <div v-if="!detailData.witnesses?.length" class="text-small text-italic q-mt-sm q-mb-md">Belum ada saksi yang
          ditambahkan.</div>

        <ul class="q-pl-md">
          <li v-for="(w, wIndex) in detailData.witnesses" :key="'wIndex-' + wIndex" class="q-mb-md flex justify-between">
            <div class="">
              <div class="text-semibold">{{ w.witness_name }}</div>
              <div class="text-small text-italic">NIK: {{ w.witness_nik ? w.witness_nik : '-' }}</div>
            </div>
            <div class="flex items-center">
              <q-btn dense flat color="info" @click="openWitnessEditDialog(w)">
                <ph-icon name="PencilSimple" size="15"></ph-icon>
                <q-tooltip anchor="top middle" self="bottom middle">Edit</q-tooltip>
              </q-btn>
              <q-btn dense flat color="negative" class="q-ml-sm" @click="openWitnessDeleteDialog(w)">
                <ph-icon name="X" size="15"></ph-icon>
                <q-tooltip anchor="top middle" self="bottom middle">Hapus</q-tooltip>
              </q-btn>
            </div>
          </li>
        </ul>

        <div class="full-width q-mt-md">
          <q-btn no-caps size="sm" outline color="primary" class="q-mx-auto block" @click="openTpsWitnessDialog">
            <ph-icon name="Plus" size="16" class="q-mr-sm" />
            <span>Tambah Saksi TPS</span>
          </q-btn>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-semibold block">Hasil Pemilihan</div>
        <div class="text-small text-italic q-mt-sm" v-if="!detailData.result">Belum ada hasil pemilihan. Silakan
          input hasil pemilihan.</div>
        <div class="text-small text-italic q-mt-sm" v-else>Berikut adalah hasil pemilihan yang telah diinput. Anda dapat
          mengubahnya.</div>
        <q-separator v-if="!detailData.result" class="q-mt-md" />
        <q-form class="q-mt-md" @submit="onSubmitForm2" @reset="onResetForm2">
          <div class="flex justify-end">
            <div class="text-small text-warning">*) wajib</div>
          </div>
          <div class="q-mb-md">
            <label for="result_total_voters" class="text-small q-mb-sm block">Jumlah Pemilih <span class="text-warning">*</span></label>
            <q-input v-model="state2.total_voters" type="number" id="result_total_voters" class="text-small"
              :error-message="errorState2.total_voters" :error="errorState2.total_voters?.length > 0" outlined dense placeholder="Masukkan jumlah pemilih" />
          </div>
          <div class="q-mb-md">
            <label for="result_total_voted" class="text-small q-mb-sm block">Jumlah Memilih 07 <span class="text-warning">*</span></label>
            <q-input v-model="state2.total_voted" type="number" id="result_total_voted" class="text-small"
              :error-message="errorState2.total_voted" :error="errorState2.total_voted?.length > 0" outlined dense placeholder="Masukkan jumlah yang memilih 07" />
          </div>
          <div class="q-mb-md">
            <label for="result_c1_file" class="text-small q-mb-sm block">Unggah Foto C1 <span class="text-warning">*</span></label>
            <q-img v-if="state2.c1_file_image" :src="state2.c1_file_image" class="q-mb-sm" style="max-height: 400px" fit />
            <q-file v-model="state2.c1_file" id="result_c1_file" class="text-small" :error-message="errorState2.c1_file"
              :error="errorState2.c1_file?.length > 0" outlined dense accept=".jpg,.jpeg,.png,.pdf" counter>
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <div class="q-mb-md">
            <label for="witness_note" class="text-small q-mb-sm block">Keterangan</label>
            <q-input v-model="state2.note" type="textarea" autogrow id="witness_note" class="text-small"
              :error-message="errorState2.note" :error="errorState2.note?.length > 0" outlined placeholder="Tulis jika ada" />
          </div>

          <div class="q-mb-md flex justify-center">
            <q-btn type="submit" no-caps size="sm" color="primary" text-color="dark" :loading="submitLoading2"
              :disable="submitLoading2">
              <ph-icon name="FloppyDisk" size="16" class="q-mr-sm" />
              <span>Simpan Hasil</span>
            </q-btn>
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </q-page>

  <!-- TPS Witness Dialog -->
  <q-dialog v-model="tpsWitnessDialogShow" @hide="onHideForm1" full-width persistent>
    <q-card>
      <q-form @submit="onSubmitForm1" @reset="onResetForm1">
        <q-card-section class="flex items-center justify-between q-py-sm">
          <div class="text-h6 text-semibold">{{ isEdit1 ? 'Ubah' : 'Tambah' }} Saksi TPS</div>
          <q-btn type="reset" no-caps round color="warning" flat @click="tpsWitnessDialogShow = false">
            <ph-icon name="X" size="16" />
          </q-btn>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="flex items-center justify-end">
            <div class="text-small text-warning">*) wajib</div>
          </div>
          <div class="q-mb-md">
            <label for="witness_name" class="text-small q-mb-sm block">Nama <span class="text-warning">*</span></label>
            <q-input v-model="state1.name" type="text" id="witness_name" class="text-small"
              :error-message="errorState1.name" :error="errorState1.name?.length > 0" outlined :minlength="3"
              :maxlength="100" autofocus placeholder="Masukkan nama" />
          </div>
          <div class="q-mb-md">
            <label for="witness_nik" class="text-small q-mb-sm block">NIK</label>
            <q-input v-model="state1.nik" type="number" id="witness_nik" class="text-small"
              :error-message="errorState1.nik" :error="errorState1.nik?.length > 0" outlined counter :minlength="16"
              :maxlength="16" placeholder="Masukkan NIK" />
          </div>
          <div class="q-mb-md">
            <label for="witness_phone" class="text-small q-mb-sm block">No. HP / WA</label>
            <q-input v-model="state1.phone" type="text" id="witness_phone" class="text-small"
              :error-message="errorState1.phone" :error="errorState1.phone?.length > 0" outlined :minlength="5"
              :maxlength="15" placeholder="Masukkan No. HP / WA" />
          </div>
          <div class="q-mb-md">
            <label for="witness_address" class="text-small q-mb-sm block">Alamat</label>
            <q-input v-model="state1.address" type="textarea" autogrow id="witness_address" class="text-small"
              :error-message="errorState1.address" :error="errorState1.address?.length > 0" outlined :minlength="3"
              :maxlength="255" placeholder="Masukkan alamat" />
          </div>
          <div class="q-mb-md">
            <label for="witness_note" class="text-small q-mb-sm block">Keterangan</label>
            <q-input v-model="state1.note" type="textarea" autogrow id="witness_note" class="text-small"
              :error-message="errorState1.note" :error="errorState1.note?.length > 0" outlined :minlength="3" :maxlength="255" placeholder="Tulis jika ada" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="between" class="q-py-md">
          <q-btn type="reset" no-caps size="md" color="warning" flat @click="tpsWitnessDialogShow = false">
            <ph-icon name="X" size="16" class="q-mr-sm" />
            <span>Batal</span>
          </q-btn>
          <q-btn type="submit" no-caps size="md" color="primary" text-color="dark" :loading="submitLoading1"
            :disable="submitLoading1">
            <ph-icon name="FloppyDisk" size="16" class="q-mr-sm" />
            <span>Simpan</span>
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useGlobalStore } from 'src/stores/global-store'
import { mapErrorMessage } from 'src/utils/error'
import { showNotification } from 'src/utils/ui'
// import { showNotification } from 'src/utils/ui'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $q = useQuasar()
const $router = useRouter()

const detailData = ref({
  name: '',
  address: '',
  note: '',
  witnesses: [],
  // results: []
  result: null
})

const resetState = () => {
  detailData.value = {
    name: '',
    address: '',
    note: '',
    witnesses: [],
    // results: []
    result: null
  }
}

const $route = useRoute()
const fetchLoading = ref(false)
const getDetail = async () => {
  const id = $route.params.id
  fetchLoading.value = true

  // get detail tps data
  await api.get('v1/area-polling/' + id)
    .then(async (res) => {
      console.log('res', res)
      detailData.value = res.data.data

      state2.value = JSON.parse(JSON.stringify({
        total_voters: detailData.value.result?.total_voters,
        total_voted: detailData.value.result?.total_voted,
        c1_file: null,
        c1_file_image: process.env.STORAGE_URL + detailData.value.result?.c1_file,
        note: detailData.value.result?.note
      }))

      fetchLoading.value = false

      getDetailArea()
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

// area data
const areaLoading = ref(false)
const area = ref({})
const getDetailArea = async () => {
  await api.get('v1/area/' + detailData.value.area_id)
    .then((res) => {
      console.log('res', res)
      area.value = res.data.data
      areaLoading.value = false
    })
    .catch((err) => {
      console.log('err', err)
      areaLoading.value = false
    })
}

onMounted(() => {
  resetState()
  getDetail()
})

watch(() => $route.params.id, (val) => {
  if (val) {
    resetState()
    getDetail()
  }
})

/* WITNESS */
const tpsWitnessDialogShow = ref(false)
const openTpsWitnessDialog = () => {
  tpsWitnessDialogShow.value = true
}

const isEdit1 = ref(false)
const state1 = ref({
  name: '',
  nik: '',
  phone: '',
  address: '',
  note: ''
})

const errorState1 = ref({
  name: '',
  nik: '',
  phone: '',
  address: '',
  note: ''
})

const onResetForm1 = () => {
  state1.value = {
    name: '',
    nik: '',
    phone: '',
    address: '',
    note: ''
  }

  errorState1.value = {
    name: '',
    nik: '',
    phone: '',
    address: '',
    note: ''
  }
}

const onHideForm1 = () => {
  onResetForm1()
  isEdit1.value = false
  tpsWitnessDialogShow.value = false
}

const submitLoading1 = ref(false)
const onSubmitForm1 = () => {
  console.log('submit', state1.value)

  // reset error
  errorState1.value = {
    name: '',
    nik: '',
    phone: '',
    address: '',
    note: ''
  }

  submitLoading1.value = true
  if (!isEdit1.value) {
    api.post('v1/area-polling-witness', {
      ...state1.value,
      area_polling_id: $route.params.id
    })
      .then(async (res) => {
        console.log('res', res)
        showNotification('Saksi TPS berhasil ditambahkan', 'positive', 'check')
        submitLoading1.value = false

        // push new data to detailData.witnesses
        detailData.value.witnesses.push(res.data.data)

        onHideForm1()
      })
      .catch((err) => {
        console.log('err', err)
        const errorResponse = err.response
        submitLoading1.value = false
        if (errorResponse.status === 422) {
          errorState1.value = mapErrorMessage(errorResponse.data.errors)
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
  } else {
    api.put('v1/area-polling-witness/' + tpsWitnessTempId.value, state1.value)
      .then(async (res) => {
        console.log('res', res)
        showNotification('Saksi TPS berhasil diperbarui', 'positive', 'check')
        submitLoading1.value = false

        // update data to detailData.witnesses
        const index = detailData.value.witnesses.findIndex((row) => row.id === tpsWitnessTempId.value)
        if (index > -1) {
          detailData.value.witnesses[index] = res.data.data
        }

        onHideForm1()
      })
      .catch((err) => {
        console.log('err', err)
        const errorResponse = err.response
        submitLoading1.value = false
        if (errorResponse.status === 422) {
          errorState1.value = mapErrorMessage(errorResponse.data.errors)
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
}

// edit witness operation
const tpsWitnessTempId = ref(null)
const openWitnessEditDialog = (item) => {
  console.log('openWitnessEditDialog', item)
  isEdit1.value = true
  state1.value = {
    name: item.witness_name,
    nik: item.witness_nik,
    phone: item.witness_phone,
    address: item.witness_address,
    note: item.witness_note
  }
  tpsWitnessTempId.value = item.id
  tpsWitnessDialogShow.value = true
}

// delete witness operation
const globalStore = useGlobalStore()
const witnessDeleteLoading = ref(false)
const openWitnessDeleteDialog = (item) => {
  $q.dialog({
    title: 'Hapus Saksi TPS',
    message: 'Apakah Anda yakin ingin menghapus Saksi TPS ini?',
    persistent: witnessDeleteLoading.value,
    cancel: {
      label: 'Tidak',
      color: 'grey-7',
      noCaps: true
    },
    ok: {
      label: 'Ya',
      noCaps: true,
      loading: witnessDeleteLoading.value
    },
    color: 'negative'
  }).onOk(() => {
    witnessDeleteLoading.value = true
    globalStore.setLoadingState(true)
    globalStore.setLoadingTitleState('Menghapus...')
    api.delete('v1/area-polling-witness/' + item.id)
      .then(res => {
        console.log('res', res)
        showNotification('Saksi TPS berhasil dihapus', 'positive', 'check')

        // remove item from detailData witnesses
        const index = detailData.value.witnesses.findIndex((row) => row.id === item.id)
        if (index > -1) {
          detailData.value.witnesses.splice(index, 1)
        }
      }).catch(_ => {
        showNotification('Terjadi kesalahan. Coba lagi.', 'negative', 'error')
      }).finally(() => {
        witnessDeleteLoading.value = false
        globalStore.setLoadingState(false)
      })
  })
}

/* RESULT */
const state2 = ref({
  total_voters: '',
  total_voted: '',
  c1_file: null,
  note: ''
})

const errorState2 = ref({
  total_voters: '',
  total_voted: '',
  c1_file: '',
  note: ''
})

const onResetForm2 = () => {
  state2.value = {
    total_voters: '',
    total_voted: '',
    c1_file: null,
    note: ''
  }

  errorState2.value = {
    total_voters: '',
    total_voted: '',
    c1_file: '',
    note: ''
  }
}

const submitLoading2 = ref(false)
const onSubmitForm2 = () => {
  console.log('submit', state2.value)

  // reset error
  errorState2.value = {
    total_voters: '',
    total_voted: '',
    c1_file: '',
    note: ''
  }

  const formData = new FormData()
  formData.append('total_voters', state2.value.total_voters || '')
  formData.append('total_voted', state2.value.total_voted || '')
  formData.append('c1_file', state2.value.c1_file || '')
  formData.append('area_polling_id', $route.params.id)
  formData.append('note', state2.value.note || '')
  formData.append('_method', 'PUT')

  submitLoading2.value = true
  api.post('v1/area-polling-result', formData)
    .then(async (res) => {
      console.log('res', res)
      showNotification('Hasil pemilihan berhasil ditambahkan', 'positive', 'check')
      submitLoading2.value = false

      // update data to detailData.witnesses
      detailData.value.result = res.data.data
    })
    .catch((err) => {
      console.log('err', err)
      const errorResponse = err.response
      submitLoading2.value = false
      if (errorResponse.status === 422) {
        errorState2.value = mapErrorMessage(errorResponse.data.errors)
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

</script>

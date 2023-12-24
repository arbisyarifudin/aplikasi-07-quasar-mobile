<template>
  <div>
    <div class="q-mb-md">
      <div class="text-semibold">Wilayah Kerja</div>
      <div class="text-caption">
        Pilih wilayah kerja Anda sesuai dengan penugasan yang telah ditentukan oleh Pusat
      </div>
    </div>
    <div class="q-mb-md">
      <label for="regency_id" class="block q-mb-sm text-small text-semibold">Kabupaten <span
          class="text-primary">*</span></label>
      <q-select id="regency_id" v-model="state.regency_id" :options="regencyOptions" emit-value map-options
        :loading="regencyLoading" outlined dense type="regency_id" :error="errorState?.regency_id?.length > 0"
        :error-message="errorState?.regency_id" input-debounce="300" hide-bottom-space
        @update:model-value="onRegencyChange" />
    </div>
    <div class="q-mb-md" v-if="state.regency_id">
      <label for="district_id" class="block q-mb-sm text-small text-semibold">Kecamatan <span
          class="text-primary">*</span></label>
      <q-select id="district_id" v-model="state.district_id" :options="districtOptions" emit-value map-options
        :loading="districtLoading" outlined dense type="district_id" :error="errorState?.district_id?.length > 0"
        :error-message="errorState?.district_id" input-debounce="300" hide-bottom-space
        @update:model-value="onDistrictChange" />
    </div>
    <div class="q-mb-md" v-if="state.district_id">
      <label for="village_id" class="block q-mb-sm text-small text-semibold">Kalurahan <span
          class="text-primary">*</span></label>
      <q-select id="village_id" v-model="state.village_id" :options="villageOptions" emit-value map-options
        :loading="villageLoading" outlined dense type="village_id" :error="errorState?.village_id?.length > 0"
        :error-message="errorState?.village_id" input-debounce="300" hide-bottom-space
        @update:model-value="onVillageChange" />
    </div>
    <div class="q-mb-md" v-if="state.village_id">
      <label for="subvillage_id" class="block q-mb-sm text-small text-semibold">Dusun <span
          class="text-primary">*</span></label>
      <q-select :disable="!subvillageOptions.length" id="subvillage_id" v-model="state.subvillage_id"
        :options="subvillageOptions" emit-value map-options :loading="subvillageLoading" outlined dense
        type="subvillage_id" :error="errorState?.subvillage_id?.length > 0" :error-message="errorState?.subvillage_id"
        input-debounce="300" hide-bottom-space @update:model-value="onSubvillageChange" clearable />

      <div class="q-mt-sm alert-info q-py-sm text-caption" v-if="!subvillageLoading && !subvillageOptions.length">
        Dusun untuk Kalurahan ini belum tersedia. Silahkan tambahkan dengan mengisi form di
        bawah:
      </div>
      <div class="q-mt-sm alert-info q-py-sm text-caption" v-else-if="!subvillageLoading && subvillageOptions.length">
        <span class="text-success" v-if="newlySubvillageAdded">Dusun berhasil ditambahkan untuk
          kalurahan ini.</span>
        <span v-else>Jika dusun yang Anda cari tidak ada di daftar, silahkan tambahkan dengan
          mengisi form di
          bawah:</span>
      </div>

      <div class="q-mt-sm row items-center justify-start">
        <div class="col-12">
          <q-input v-model="state.subvillage_name" outlined dense type="text" placeholder="Masukkan nama dusun"
            hide-bottom-space @change="onSubvillageNameChange" />
        </div>
        <div class="col-12 hidden">
          <q-btn color="primary" text-color="dark" no-caps class="q-ml-sm">
            <ph-icon name="FloppyDisk" /> Tambah
          </q-btn>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, watch, computed } from 'vue'
import { LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'

const $props = defineProps({
  mode: {
    type: String,
    default: 'create'
  },
  data: {
    type: Object,
    default: () => ({})
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  autoFetch: {
    type: Boolean,
    default: false
  }
})

const isNeedAutoFetch = computed(() => {
  if (($props.mode === 'edit' || state.value.subvillage_id || state.value.subvillage_name) && $props.autoFetch) {
    if (districtOptions.value.length > 0 && villageOptions.value.length > 0 && subvillageOptions.value.length > 0) {
      return false
    }
    return true
  }
  return false
})

watch(
  () => $props.data,
  async (val) => {
    state.value = JSON.parse(JSON.stringify(val))

    if (state.value) {
      if (!state.value.subvillage_id && !state.value.subvillage_name) {
        return
      }

      if (isNeedAutoFetch.value) {
        await getRegency()
      }

      const payload = {
        subvillage_id: state.value.subvillage_id,
        subvillage_name: state.value.subvillage_name,
        village_id: state.value.village_id,
        district_id: state.value.district_id,
        regency_id: state.value.regency_id
      }

      emit('change', payload)
    }
  }, {
    deep: true
  }
)

watch(
  () => $props.errors,
  (val) => {
    errorState.value = JSON.parse(JSON.stringify(val))
  }, {
    deep: true
  }
)

const state = ref({
  regency_id: '',
  district_id: '',
  village_id: '',
  subvillage_id: '',
  subvillage_name: ''
})

const errorState = ref({
  regency_id: '',
  district_id: '',
  village_id: '',
  subvillage_id: '',
  subvillage_name: ''
})

const regencyLoading = ref(false)
const regencyOptions = ref([])
const districtLoading = ref(false)
const districtOptions = ref([])
const villageLoading = ref(false)
const villageOptions = ref([])
const subvillageLoading = ref(false)
const subvillageOptions = ref([])

// eslint-disable-next-line no-unused-vars
const getRegency = async () => {
  errorState.value.regency_id = ''
  regencyLoading.value = true
  try {
    const res = await api.get('/regency')
    regencyOptions.value = res.data.data.map((item) => ({
      label: item.name,
      value: item.id
    }))

    if (state.value.regency_id && isNeedAutoFetch.value) {
      onRegencyChange(state.value.regency_id, false)
    }
  } catch (err) {
    console.log(err)
  } finally {
    regencyLoading.value = false
  }
}

const resetState = () => {
  state.value = {
    regency_id: '',
    district_id: '',
    village_id: '',
    subvillage_id: '',
    subvillage_name: ''
  }
}

const resetErrorState = () => {
  errorState.value = {
    regency_id: '',
    district_id: '',
    village_id: '',
    subvillage_id: '',
    subvillage_name: ''
  }
}

onMounted(() => {
  resetState()
  resetErrorState()

  if ($props.mode === 'edit') {
    state.value = {
      regency_id: $props.data.regency_id,
      district_id: $props.data.district_id,
      village_id: $props.data.village_id,
      subvillage_id: $props.data.subvillage_id,
      subvillage_name: $props.data.subvillage_name
    }
  }

  getRegency()
})

const getDistrict = async (regencyId) => {
  districtLoading.value = true
  try {
    const res = await api.get(`/district?regency_id=${regencyId}`)
    districtOptions.value = res.data.data.map((item) => ({
      label: item.name,
      value: item.id
    }))

    if (state.value.district_id) {
      onDistrictChange(state.value.district_id, false)
    }
  } catch (err) {
    console.log(err)
  } finally {
    districtLoading.value = false
  }
}

const getVillage = async (districtId) => {
  villageLoading.value = true
  try {
    const res = await api.get(`/village?district_id=${districtId}`)
    villageOptions.value = res.data.data.map((item) => ({
      label: item.name,
      value: item.id
    }))

    if (state.value.village_id) {
      onVillageChange(state.value.village_id, false)
    }
  } catch (err) {
    console.log(err)
  } finally {
    villageLoading.value = false
  }
}

const getSubvillage = async (villageId) => {
  subvillageLoading.value = true
  try {
    const res = await api.get(`/subvillage?village_id=${villageId}`)
    subvillageOptions.value = res.data.data.map((item) => ({
      label: item.name,
      value: item.id
    }))
  } catch (err) {
    console.log(err)
  } finally {
    subvillageLoading.value = false
  }
}

const onRegencyChange = (val, reset = true) => {
  if (reset) {
    state.value.district_id = ''
    state.value.village_id = ''
    state.value.subvillage_id = ''

    errorState.value.district_id = ''
    districtOptions.value = []
    errorState.value.village_id = ''
    villageOptions.value = []
    errorState.value.subvillage_id = ''
    subvillageOptions.value = []
  }
  getDistrict(val)
}

const onDistrictChange = (val, reset = true) => {
  if (reset) {
    state.value.village_id = ''
    state.value.subvillage_id = ''

    errorState.value.village_id = ''
    villageOptions.value = []
    errorState.value.subvillage_id = ''
    subvillageOptions.value = []
  }
  getVillage(val)
}

const onVillageChange = (val, reset = true) => {
  if (reset) {
    state.value.subvillage_id = ''
    state.value.subvillage_name = ''

    errorState.value.subvillage_id = ''
    errorState.value.subvillage_name = ''
    subvillageOptions.value = []
  }
  getSubvillage(val)
}

const newlySubvillageAdded = ref(false)

/* USER */
// const userArea = ref([])
// const fetchUserArea = async () => {
//   const { data } = await api.get('v1/user-area')
//   userArea.value = data?.data?.data || []
//   console.log('userArea', userArea.value)
// }

// onMounted(() => {
//   fetchUserArea()
// })

/* */
const emit = defineEmits(['change'])

// watch(
//   () => state.value,
//   async (val) => {
//     // console.log('state.value', val)

//     if (!val.subvillage_id && !val.subvillage_name) {
//       return
//     }

//     if ($props.mode === 'edit') {
// await getRegency()
//     }

//     const payload = {
//       subvillage_id: val.subvillage_id,
//       subvillage_name: val.subvillage_name,
//       village_id: val.village_id,
//       district_id: val.district_id,
//       regency_id: val.regency_id
//     }

//     emit('change', payload)
//   }, {
//     deep: true
//   }
// )

const onSubvillageChange = (val) => {
  console.log('onSubvillageChange', val)
  if (!val) {
    return
  }

  const payload = {
    subvillage_id: val,
    subvillage_name: null,
    village_id: state.value.village_id,
    district_id: state.value.district_id,
    regency_id: state.value.regency_id
  }

  emit('change', payload)
  LocalStorage.set('app_selected_area', payload)
}

const onSubvillageNameChange = async (val) => {
  console.log('onSubvillageNameChange', val)
  if (!val) {
    return
  }

  const payload = {
    subvillage_id: null,
    subvillage_name: val,
    village_id: state.value.village_id,
    district_id: state.value.district_id,
    regency_id: state.value.regency_id
  }

  emit('change', payload)
  LocalStorage.set('app_selected_area', payload)
}

</script>

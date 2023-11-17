<template>
  <div>
    <div class="container">
      <div class="row justify-center q-col-gutter-md">
        <div class="col-md-6 col-12 auth-col-left">
          <div class="auth-left" style="margin-bottom: 60px">
            <div class="text-center q-mb-md">
              <img src="~/assets/logo.png" alt="logo" class="logo q-mx-auto" />
            </div>
            <div class="auth-left__header q-mb-xl text-center">
              <div class="text-h4 text-medium text-primary">Buat akun</div>
              <p class="text-medium text-grey-4">
                Masukkan data diri Anda untuk membuat akun baru
              </p>
            </div>

            <q-form @submit.prevent="onSubmit" class="auth-form">
              <div class="q-mb-md">
                <label for="name" class="block q-mb-sm text-small text-semibold">Nama Lengkap <span
                    class="text-primary">*</span></label>
                <q-input id="name" v-model="state.name" outlined dense type="text" placeholder="Masukkan nama lengkap"
                  :error="errorState?.name?.length > 0" :error-message="errorState?.name" :autofocus="false"
                  @update:model-value="errorState.name = ''" hide-bottom-space />
              </div>
              <div class="q-mb-md">
                <label for="nik" class="block q-mb-sm text-small text-semibold">NIK <span
                    class="text-primary">*</span></label>
                <q-input id="nik" v-model="state.nik" outlined dense type="number" placeholder="Masukkan NIK"
                  :error="errorState?.nik?.length > 0" :error-message="errorState?.nik"
                  @update:model-value="errorState.nik = ''" hide-bottom-space />
              </div>
              <div class="q-mb-md">
                <label for="ktp_file" class="block q-mb-sm text-small text-semibold">Foto KTP <span
                    class="text-primary">*</span></label>
                <!-- <q-input id="ktp_file" v-model="state.ktp_file" outlined dense type="file" :error="errorState?.ktp_file?.length > 0" :error-message="errorState?.ktp_file" @update:model-value="errorState.ktp_file = ''" hide-bottom-space /> -->
                <!-- <q-file v-model="state.ktp_file" outlined dense :error="errorState?.ktp_file?.length > 0"
                  :error-message="errorState?.ktp_file" @update:model-value="errorState.ktp_file = ''" hide-bottom-space
                  accept=".jpg,.jpeg,.png,.pdf" counter>
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file> -->
                <q-card>
                  <q-card-section v-if="capturedImageUrl">
                    <q-img :src="capturedImageUrl" class="image-captured" />
                  </q-card-section>
                  <q-card-section>
                    <q-btn outlined color="grey-9" text-color="white" class="full-width" @click="captureImage">
                      <ph-icon name="Camera" />
                    </q-btn>
                    <div class="q-mt-sm text-center text-caption">Klik untuk ambil foto KTP</div>
                    <div class="q-mt-sm text-center text-small text-negative q-mt-sm" v-if="errorState.ktp_file?.length">
                      {{ errorState.ktp_file }}</div>
                  </q-card-section>
                </q-card>

              </div>
              <div class="q-mb-md">
                <label for="phone" class="block q-mb-sm text-small text-semibold">No. HP <span
                    class="text-primary">*</span></label>
                <q-input id="phone" v-model="state.phone" outlined dense type="number" placeholder="Masukkan No. HP"
                  :error="errorState?.phone?.length > 0" :error-message="errorState?.phone"
                  @update:model-value="errorState.phone = ''" hide-bottom-space />
              </div>
              <div class="q-mb-md">
                <label for="address" class="block q-mb-sm text-small text-semibold">Alamat Domisili <span
                    class="text-primary">*</span></label>
                <q-input id="address" autogrow v-model="state.address" outlined dense type="textarea"
                  placeholder="Masukkan Alamat" :error="errorState?.address?.length > 0"
                  :error-message="errorState?.address" @update:model-value="errorState.address = ''" hide-bottom-space
                  input-style="min-height: 70px" />
              </div>
              <div class="q-mb-md">
                <label for="password" class="block q-mb-sm text-small text-semibold">Kata Sandi <span
                    class="text-primary">*</span></label>
                <q-input v-model="state.password" outlined dense :type="showPassword ? 'text' : 'password'"
                  placeholder="Masukkan kata sandi" :error="errorState?.password?.length > 0"
                  :error-message="errorState?.password" @update:model-value="errorState.password = ''" hide-bottom-space
                  autocomplete="new-password" hint="Minimal 6 karakter">
                  <template #append>
                    <q-icon :name="showPassword ? 'o_visibility_off' : 'o_visibility'" class="cursor-pointer"
                      @click="showPassword = !showPassword" />
                  </template>
                </q-input>
              </div>
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
                  :loading="districtLoading" outlined dense type="district_id"
                  :error="errorState?.district_id?.length > 0" :error-message="errorState?.district_id"
                  input-debounce="300" hide-bottom-space @update:model-value="onDistrictChange" />
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
                  type="subvillage_id" :error="errorState?.subvillage_id?.length > 0"
                  :error-message="errorState?.subvillage_id" input-debounce="300" hide-bottom-space
                  @update:model-value="onSubvillageChange" />

                <div class="q-mt-sm alert-info q-py-sm" v-if="!subvillageLoading && !subvillageOptions.length">
                  Dusun untuk Kalurahan ini belum tersedia. Silahkan tambahkan dengan mengisi form di
                  bawah:
                </div>
                <div class="q-mt-sm alert-info q-py-sm" v-else-if="!subvillageLoading && subvillageOptions.length">
                  <span class="text-success" v-if="newlySubvillageAdded">Dusun berhasil ditambahkan untuk
                    kalurahan ini.</span>
                  <span v-else>Jika dusun yang Anda cari tidak ada di daftar, silahkan tambahkan dengan
                    mengisi form di
                    bawah:</span>
                </div>

                <div class="q-mt-sm row items-center justify-start">
                  <div class="col-12">
                    <q-input v-model="state.subvillage_name" outlined dense type="text" placeholder="Masukkan nama dusun"
                      hide-bottom-space />
                  </div>
                  <div class="col-12 hidden">
                    <q-btn color="primary" text-color="dark" no-caps class="q-ml-sm">
                      <ph-icon name="FloppyDisk" /> Tambah
                    </q-btn>
                  </div>
                </div>

              </div>
              <q-btn class="q-mt-md full-width q-py-sm" color="primary" text-color="dark" label="Buat Akun" no-caps
                :loading="loading" :disable="loading" type="submit" />
              <div class="q-mt-md ">
                <div class="text-medium text-grey-7 text-center">
                  Sudah punya akun?
                  <router-link :to="{ name: 'Login Page' }" class="link text-medium">Masuk</router-link>
                </div>
              </div>
            </q-form>
          </div>
          <div class="auth-footer text-center full-width q-py-md">
            <div class="text-small text-grey-5">&copy;2023 TRESNO Wibisono.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LocalStorage, useQuasar, Platform } from 'quasar'
import { register } from 'src/services/auth.service'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mapErrorMessage } from 'src/utils/error'
import { api } from 'src/boot/axios'

// import { Plugins } from '@capacitor/core'
// const { Camera } = Plugins
import { Camera } from '@capacitor/camera'

const $q = useQuasar()
const $router = useRouter()

const state = ref({
  name: '',
  nik: '',
  phone: '',
  password: '',
  address: '',
  // area_id: '',
  regency_id: '',
  district_id: '',
  village_id: '',
  subvillage_id: '',
  subvillage_name: '',
  ktp_file: null
})

const errorState = ref({
  name: '',
  nik: '',
  phone: '',
  password: '',
  address: '',
  // area_id: '',
  regency_id: '',
  district_id: '',
  village_id: '',
  subvillage_id: '',
  subvillage_name: '',
  ktp_file: ''
})

const showPassword = ref(false)
const loading = ref(false)

const onSubmit = async () => {
  console.log(state.value)

  // reset error state
  Object.assign(errorState.value, {
    name: '',
    nik: '',
    phone: '',
    password: '',
    address: '',
    // area_id: '',
    regency_id: '',
    district_id: '',
    village_id: '',
    subvillage_id: '',
    subvillage_name: '',
    ktp_file: ''
  })

  // form data
  const formData = new FormData()
  formData.append('name', state.value.name)
  formData.append('nik', state.value.nik)
  formData.append('phone', state.value.phone)
  formData.append('password', state.value.password)
  formData.append('address', state.value.address)
  // formData.append('area_id', state.area_id)
  formData.append('regency_id', state.value.regency_id)
  formData.append('district_id', state.value.district_id)
  formData.append('village_id', state.value.village_id)
  formData.append('subvillage_id', state.value.subvillage_id)
  formData.append('subvillage_name', state.value.subvillage_name)
  formData.append('ktp_file', state.value.ktp_file ?? '')

  loading.value = true
  register(formData)
    .then(async (res) => {
      // console.log(res)

      // show alert success
      $q.notify({
        message: 'Registrasi berhasil',
        color: 'positive',
        position: 'top',
        icon: 'check_circle',
        timeout: 2000
      })

      // save token to local storage
      LocalStorage.set('app_auth_token', res.data.token)

      // redirect to dashboard page
      await $router.push({ name: 'Dashboard Page' })
    })
    .catch((err) => {
      console.log(err)
      if (err.status === 422) {
        Object.assign(errorState.value, mapErrorMessage(err.data.errors))
        $q.notify({
          message: 'Input tidak valid. Periksa kembali data Anda.',
          color: 'negative',
          position: 'top',
          icon: 'error',
          timeout: 2000
        })
      } else if (err.status === 401) {
        errorState.value.password = err.data.message
      } else {
        // show alert error
        $q.notify({
          message: err.data.message,
          color: 'negative',
          position: 'top',
          icon: 'error',
          timeout: 2000
        })
      }
    })
    .finally(() => {
      loading.value = false
    })
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
      // webUseInput: true,
      source: 'CAMERA',
      resultType: 'uri'
      // direction: CameraDirection.Rear,
      // resultType: CameraResultType.Uri
      // resultType: CameraResultType.Base64
      // resultType: CameraResultType.DataUrl
    })

    // The result will vary on the value of the resultType option.
    // CameraResultType.Uri - Get the result from image.webPath
    // CameraResultType.Base64 - Get the result from image.base64String
    // CameraResultType.DataUrl - Get the result from image.dataUrl
    // console.log('image', JSON.stringify(image))
    // console.log('image.webPath', JSON.stringify(image.webPath))
    // console.log('image.base64String', JSON.stringify(image.base64String))
    // console.log('image.dataUrl', JSON.stringify(image.dataUrl))
    capturedImageUrl.value = image.webPath

    const blob = await convertImagePathToBlob(image.webPath)
    state.value.ktp_file = blob
  } catch (error) {
    console.log('getPhoto error', JSON.stringify(error))
  }
}

const convertImagePathToBlob = async (image) => {
  const response = await fetch(image)
  const blob = await response.blob()
  return blob
}

/* AREA */
const regencyLoading = ref(false)
const regencyOptions = ref([])
const districtLoading = ref(false)
const districtOptions = ref([])
const villageLoading = ref(false)
const villageOptions = ref([])
const subvillageLoading = ref(false)
const subvillageOptions = ref([])

const getRegency = async () => {
  errorState.value.regency_id = ''
  regencyLoading.value = true
  try {
    const res = await api.get('/regency')
    regencyOptions.value = res.data.data.map((item) => ({
      label: item.name,
      value: item.id
    }))
  } catch (err) {
    console.log(err)
  } finally {
    regencyLoading.value = false
  }
}

onMounted(() => {
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

const onRegencyChange = (val) => {
  state.value.district_id = ''
  state.value.village_id = ''
  state.value.subvillage_id = ''

  errorState.value.district_id = ''
  districtOptions.value = []
  errorState.value.village_id = ''
  villageOptions.value = []
  errorState.value.subvillage_id = ''
  subvillageOptions.value = []
  getDistrict(val)
}

const onDistrictChange = (val) => {
  state.value.village_id = ''
  state.value.subvillage_id = ''

  errorState.value.village_id = ''
  villageOptions.value = []
  errorState.value.subvillage_id = ''
  subvillageOptions.value = []
  getVillage(val)
}

const onVillageChange = (val) => {
  state.value.subvillage_id = ''

  errorState.value.subvillage_id = ''
  errorState.value.subvillage_name = ''
  subvillageOptions.value = []
  getSubvillage(val)
}

const onSubvillageChange = (val) => {
  console.log(val)
}

const newlySubvillageAdded = ref(false)

</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  // max-width: 1200px;
  margin: 0 auto;
  padding: 20px 15px;

  .row {
    width: 100%;
    height: 100%;

    .col-md-6 {
      height: 100%;
      // display: flex;
      // align-items: center;
      // justify-content: center;
    }
  }
}

.logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.auth {
  &-col-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }

  &-left {
    width: 100%;
  }
}

.image-login {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>

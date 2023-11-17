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
                  :rules="[(val) => val.length > 0 || 'Nama lengkap diperlukan']" :error="errorState?.name?.length > 0"
                  :error-message="errorState?.name" :autofocus="true" @update:model-value="errorState.name = ''"
                  hide-bottom-space />
              </div>
              <div class="q-mb-md">
                <label for="nik" class="block q-mb-sm text-small text-semibold">NIK <span
                    class="text-primary">*</span></label>
                <q-input id="nik" v-model="state.nik" outlined dense type="number" placeholder="Masukkan NIK"
                  :rules="[(val) => val.length > 0 || 'NIK diperlukan']" :error="errorState?.nik?.length > 0"
                  :error-message="errorState?.nik" @update:model-value="errorState.nik = ''" hide-bottom-space />
              </div>
              <div class="q-mb-md">
                <label for="ktp_file" class="block q-mb-sm text-small text-semibold">Foto KTP <span
                    class="text-primary">*</span></label>
                <!-- <q-input id="ktp_file" v-model="state.ktp_file" outlined dense type="file" :error="errorState?.ktp_file?.length > 0" :error-message="errorState?.ktp_file" @update:model-value="errorState.ktp_file = ''" hide-bottom-space /> -->
                <q-file v-model="state.ktp_file" outlined dense :error="errorState?.ktp_file?.length > 0"
                  :error-message="errorState?.ktp_file" @update:model-value="errorState.ktp_file = ''" hide-bottom-space accept=".jpg,.jpeg,.png,.pdf"
                  counter>
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>
              <div class="q-mb-md">
                <label for="phone" class="block q-mb-sm text-small text-semibold">No. HP <span
                    class="text-primary">*</span></label>
                <q-input id="phone" v-model="state.phone" outlined dense type="number" placeholder="Masukkan No. HP"
                  :rules="[(val) => val.length > 0 || 'No. HP diperlukan']" :error="errorState?.phone?.length > 0"
                  :error-message="errorState?.phone" @update:model-value="errorState.phone = ''" hide-bottom-space />
              </div>
              <div class="q-mb-md">
                <label for="address" class="block q-mb-sm text-small text-semibold">Alamat Domisili <span
                    class="text-primary">*</span></label>
                <q-input id="address" autogrow v-model="state.address" outlined dense type="textarea"
                  placeholder="Masukkan Alamat" :rules="[(val) => val.length > 0 || 'Alamat diperlukan']"
                  :error="errorState?.address?.length > 0" :error-message="errorState?.address"
                  @update:model-value="errorState.address = ''" hide-bottom-space input-style="min-height: 70px" />
              </div>
              <div class="q-mb-md">
                <label for="password" class="block q-mb-sm text-small text-semibold">Kata Sandi <span
                    class="text-primary">*</span></label>
                <q-input v-model="state.password" outlined dense :type="showPassword ? 'text' : 'password'"
                  placeholder="Masukkan kata sandi" :rules="[(val) => val.length > 0 || 'Kata sandi diperlukan']"
                  :error="errorState?.password?.length > 0" :error-message="errorState?.password"
                  @update:model-value="errorState.password = ''" hide-bottom-space autocomplete="new-password"
                  hint="Minimal 6 karakter">
                  <template #append>
                    <q-icon :name="showPassword ? 'o_visibility_off' : 'o_visibility'" class="cursor-pointer"
                      @click="showPassword = !showPassword" />
                  </template>
                </q-input>
              </div>
              <div class="q-mb-md">
                <label for="area_id" class="block q-mb-sm text-small text-semibold">Wilayah Kerja <span
                    class="text-primary">*</span></label>
                <q-select id="area_id" v-model="state.area_id" :options="areaOptions" emit-value map-options
                  :loading="areaLoading" outlined dense type="area_id" :error="errorState?.area_id?.length > 0"
                  :error-message="errorState?.area_id" @update:model-value="errorState.area_id = ''"
                  @filter="onFilterArea" @virtual-scroll="onScrollArea" use-input hide-selected fill-input
                  input-debounce="300" hint="Cari wilayah" hide-bottom-space>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Tidak ada data.
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
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
import { LocalStorage, useQuasar } from 'quasar'
import { register } from 'src/services/auth.service'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mapErrorMessage } from 'src/utils/error'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const $router = useRouter()

const state = reactive({
  name: '',
  nik: '',
  phone: '',
  password: '',
  address: '',
  area_id: '',
  ktp_file: null
})

const errorState = reactive({
  name: '',
  nik: '',
  phone: '',
  password: '',
  address: '',
  area_id: '',
  ktp_file: ''
})

const showPassword = ref(false)
const loading = ref(false)

const onSubmit = () => {
  console.log(state)

  // reset error state
  Object.assign(errorState, {
    name: '',
    nik: '',
    phone: '',
    password: '',
    address: '',
    area_id: '',
    ktp_file: ''
  })

  // form data
  const formData = new FormData()
  formData.append('name', state.name)
  formData.append('nik', state.nik)
  formData.append('phone', state.phone)
  formData.append('password', state.password)
  formData.append('address', state.address)
  formData.append('area_id', state.area_id)
  formData.append('ktp_file', state.ktp_file)

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
        Object.assign(errorState, mapErrorMessage(err.data.errors))
      } else if (err.status === 401) {
        errorState.password = err.data.message
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

/* AREA */

const areaData = ref([])
const areaOptions = ref([])
const areaLoading = ref(false)
const searchAreaKeyword = ref('')
const paginationArea = ref({
  page: 1,
  perPage: 10,
  totalPage: 1
})

const getAreaData = async (append = false) => {
  // areaOptions.value = []
  areaLoading.value = true
  api
    .get('v1/area', {
      params: {
        keyword: searchAreaKeyword.value,
        page: paginationArea.value.page,
        limit: 20,
        sortBy: 'name',
        sortDir: 'asc'
      }
    })
    .then((res) => {
      const responseData = res.data?.data?.data || []
      const responsePagination = res.data?.data?.pagination || {}

      areaData.value = responseData

      paginationArea.value.page = parseInt(responsePagination.current_page)
      paginationArea.value.totalPage = responsePagination.total_pages

      if (append) {
        if (searchAreaKeyword.value && !areaData.value.length) {
          areaOptions.value = responseData.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
        } else {
          areaOptions.value.push(...responseData.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          }))
        }
      } else {
        areaOptions.value = responseData.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
        if (responseData && responseData.length > 0) {
          areaOptions.value.unshift({
            label: '- Pilih Wilayah Kerja -',
            value: ''
          })
        }
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      areaLoading.value = false
    })
}

const onFilterArea = (val, update) => {
  if (val === '') {
    update(() => {
      areaOptions.value = areaData.value.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })
      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    const filterData = areaData.value.filter(v => {
      return v.name.toLowerCase().indexOf(needle) > -1
    })
      .map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })

    if (filterData.length > 0) {
      areaOptions.value = filterData
    } else {
      searchAreaKeyword.value = needle
      getAreaData(true)
    }
  })
}

const onScrollArea = (detail) => {
  // console.log('onScrollArea', detail)
  if (detail.direction === 'increase' && !searchAreaKeyword.value) {
    if (detail.index === detail.to && paginationArea.value.page < paginationArea.value.totalPage) {
      paginationArea.value.page++
      getAreaData(true)
    }
  }
}
onMounted(() => {
  getAreaData()
})

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

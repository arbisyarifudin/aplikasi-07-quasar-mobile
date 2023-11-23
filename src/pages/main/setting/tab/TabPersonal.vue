<template>
  <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md q-px-md">
    <div class="q-mb-sm hidden">
      <label for="picture" class="text-h6 text-semibold q-mb-sm block">Foto profil</label>
      <div class="flex">
        <q-avatar size="100px" color="primary" style="border-radius: 50%">
          <img v-if="state.photoUrl" :src="state.photoUrl" @error="onPictureError" />
          <img v-else src="~assets/logo.png" />
        </q-avatar>
      </div>
    </div>
    <div class="q-mb-sm hidden">
      <label for="status" class="text-h6 text-semibold q-mb-sm block">Status Akun</label>
      <div class="flex">
        <div :class="['inline', badgeStatus(state.is_verified)]">Terverifikasi</div>
      </div>
    </div>
    <div class="q-mb-sm">
      <label for="user_uname" class="text-h6 text-semibold q-mb-sm block">ID
      </label>
      <q-input id="user_uname" uname="user_uname" v-model="state.uname" placeholder="NIK" outlined
        :error="errState?.uname?.length > 0" :error-message="errState?.uname" @update:model-value="errState.uname = ''"
        hide-bottom-space readonly disable />
    </div>
    <div class="q-mb-sm">
      <label for="user_name" class="text-h6 text-semibold q-mb-sm block">Nama lengkap
      </label>
      <q-input id="user_name" name="user_name" v-model="state.name" placeholder="Nama lengkap" outlined
        :error="errState?.name?.length > 0" :error-message="errState?.name" @update:model-value="errState.name = ''"
        hide-bottom-space />
    </div>
    <div class="q-mb-sm">
      <label for="user_nik" class="text-h6 text-semibold q-mb-sm block">NIK
      </label>
      <q-input id="user_nik" nik="user_nik" v-model="state.nik" placeholder="NIK" outlined
        :error="errState?.nik?.length > 0" :error-message="errState?.nik" @update:model-value="errState.nik = ''"
        hide-bottom-space readonly disable />
    </div>
    <div class="q-mb-sm hidden">
      <label for="user_email" class="text-h6 text-semibold q-mb-sm block">Email
      </label>
      <q-input id="user_email" name="user_email" v-model="state.email" placeholder="Email" outlined
        :error="errState?.email?.length > 0" :error-message="errState?.email" @update:model-value="errState.email = ''"
        hide-bottom-space readonly disable />
    </div>
    <div class="q-mb-sm">
      <label for="user_phone" class="text-h6 text-semibold q-mb-sm block">No. HP
      </label>
      <q-input id="user_phone" name="user_phone" v-model="state.phone" placeholder="No. HP" outlined
        :error="errState?.phone?.length > 0" :error-message="errState?.phone" @update:model-value="errState.phone = ''"
        hide-bottom-space :readonly="!isEditMode" />
    </div>
    <div class="q-mb-sm">
      <label for="user_address" class="text-h6 text-semibold q-mb-sm block">Alamat Domisili
      </label>
      <q-input id="user_address" name="user_address" v-model="state.address" placeholder="Alamat Domisili" outlined
        :error="errState?.address?.length > 0" :error-message="errState?.address"
        @update:model-value="errState.address = ''" hide-bottom-space :readonly="!isEditMode" />
    </div>
    <div class="flex justify-between q-mt-lg">
      <div class="hidden">
        <q-btn label="Hapus Akun" icon="o_delete" color="dark" text-color="negative" no-caps class="q-px-sm" />
      </div>
      <div class="flex items-center justify-between full-width">
        <q-btn v-if="!isEditMode" color="primary" text-color="dark" no-caps type="submit" @click="isEditMode = true">
          <ph-icon name="PencilSimple" class="q-mr-sm" />
          Edit
        </q-btn>
        <q-btn v-if="isEditMode" label="Simpan" color="primary" text-color="dark" no-caps type="submit" icon="save" class="q-px-sm"
          :disable="loading || submissionDisabled" :loading="loading" />
        <q-btn v-if="isEditMode" label="Batal" color="grey-5" outline no-caps icon="close" class="q-ml-md q-px-sm"
          @click="onCancel" />
      </div>
    </div>
  </q-form>
</template>

<script setup>

import { useQuasar } from 'quasar'
import { getAPI, putAPI } from 'src/services/fetch.service'
import { onMounted, ref } from 'vue'
// import { useRoute, useRouter } from 'vue-router'

const $q = useQuasar()
// const $route = useRoute()
// const $router = useRouter()

const isEditMode = ref(false)

const state = ref({
  uname: '',
  name: '',
  email: '',
  phone: '',
  address: ''
})

const errState = ref({
  uname: '',
  name: '',
  email: '',
  phone: '',
  address: ''
})

const onReset = () => {
  state.value = {
    uname: '',
    name: '',
    email: '',
    phone: '',
    address: ''
  }
  errState.value = {
    uname: '',
    name: '',
    email: '',
    phone: '',
    address: ''
  }
  getPersonalInfo()
}
const onCancel = () => {
  isEditMode.value = false
  onReset()
}

// eslint-disable-next-line no-unused-vars
const onPictureError = () => {
  state.value.photoUrl = 'https://via.placeholder.com/150'
}

/* STATUS */
const badgeStatus = (status) => {
  switch (status) {
    case 0:
    case false:
    case 'inactive':
    case 'Not Verified':
      return 'badge-status badge-status--warning'
    case 1:
    case true:
    case 'active':
    case 'Verified':
      return 'badge-status badge-status--positive'
    case 2:
    case 'banned':
    case 'Rejected':
      return 'badge-status badge-status--negative'
    default:
      return 'badge-status badge-status--info'
  }
}

const loading = ref(false)
const onSubmit = () => {
  if (loading.value) return
  if (isEditMode.value) {
    __savePersonal()
  }
}

const submissionDisabled = ref(false)

const getPersonalInfo = async () => {
  loading.value = true
  await getAPI('v1/user/profile')
    .then((res) => {
      state.value = {
        uname: res.data.uname,
        name: res.data.name,
        email: res.data.email,
        nik: res.data.profile?.nik,
        phone: res.data.profile?.phone,
        address: res.data.profile?.address,
        picture: res.data.profile?.picture
      }
      console.log(state.value)
    })
    .catch(async (err) => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}

const __savePersonal = async () => {
  loading.value = true
  await putAPI('v1/user/profile', state.value)
    .then((res) => {
      $q.notify({
        message: 'Data berhasil diperbarui',
        type: 'positive',
        position: 'top'
      })
      isEditMode.value = false
    })
    .catch((err) => {
      console.log(err)
      $q.notify({
        message: err.data.message ?? 'Something went wrong',
        type: 'negative',
        position: 'top'
      })
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getPersonalInfo()
})

</script>

<template>
  <q-form
    @submit.prevent="onSubmit"
    @reset="onReset"
    class="q-gutter-md q-px-md"
  >
    <div class="q-mb-sm">
      <label for="picture" class="text-h5 text-semibold q-mb-sm block"
        >Profile picture</label
      >
      <div class="flex">
        <!-- <q-img
          src="https://cdn.quasar.dev/img/boy-avatar.png"
          style="width: 100px; height: 100px; border-radius: 50%"
        /> -->
        <q-avatar size="100px" color="primary" style="border-radius: 50%">
          <img
            v-if="state.photoUrl"
            :src="state.photoUrl"
            @error="onPictureError"
          />
          <img v-else src="/avatar.jpg"/>
        </q-avatar>
      </div>
    </div>
    <div class="q-mb-sm">
      <label for="status" class="text-h5 text-semibold q-mb-sm block"
        >Account Status</label
      >
      <div class="flex">
        <div :class="['inline',badgeStatus(state.status)]">{{state.statusLabel}}</div>
      </div>
    </div>
    <div class="q-mb-sm">
      <label for="status" class="text-h5 text-semibold q-mb-sm block"
        >Document Status</label
      >
      <div class="flex">
        <div :class="['inline',badgeStatus(state.documentStatus)]">{{state.documentStatus}}</div>
      </div>
    </div>
    <div class="q-mb-sm">
      <label for="member_name" class="text-h5 text-semibold q-mb-sm block"
        >Fullname
      </label>
      <q-input
        id="member_name"
        name="member_name"
        v-model="state.name"
        placeholder="Fullname"
        outlined
        :error="errState?.name?.length > 0"
        :error-message="errState?.name"
        @update:model-value="errState.name = ''"
        hide-bottom-space
        readonly
        disable
        />
        <!-- :readonly="!isEditMode" -->
    </div>
    <div class="q-mb-sm">
      <label for="member_email" class="text-h5 text-semibold q-mb-sm block"
        >Email
      </label>
      <q-input
        id="member_email"
        name="member_email"
        v-model="state.email"
        placeholder="Email"
        outlined
        :error="errState?.email?.length > 0"
        :error-message="errState?.email"
        @update:model-value="errState.email = ''"
        hide-bottom-space
        readonly
        disable
      />
    </div>
    <div class="q-mb-sm">
      <label for="member_phone" class="text-h5 text-semibold q-mb-sm block"
        >Phone number
      </label>
      <q-input
        id="member_phone"
        name="member_phone"
        v-model="state.phone"
        placeholder="Phone number"
        outlined
        :error="errState?.phone?.length > 0"
        :error-message="errState?.phone"
        @update:model-value="errState.phone = ''"
        hide-bottom-space
        :readonly="!isEditMode"
      />
    </div>
    <div class="q-mb-sm">
      <label for="member_address" class="text-h5 text-semibold q-mb-sm block"
        >Address
      </label>
      <q-input
        id="member_address"
        name="member_address"
        v-model="state.address"
        placeholder="Address"
        outlined
        :error="errState?.address?.length > 0"
        :error-message="errState?.address"
        @update:model-value="errState.address = ''"
        hide-bottom-space
        :readonly="!isEditMode"
      />
    </div>
    <div class="q-mb-sm">
      <label for="member_city" class="text-h5 text-semibold q-mb-sm block"
        >City
      </label>
      <q-input
        id="member_city"
        name="member_city"
        v-model="state.city"
        placeholder="Address"
        outlined
        :error="errState?.city?.length > 0"
        :error-message="errState?.city"
        @update:model-value="errState.city = ''"
        hide-bottom-space
        :readonly="!isEditMode"
      />
    </div>
    <div class="q-mb-sm">
      <label for="member_country" class="text-h5 text-semibold q-mb-sm block"
        >Country
      </label>
      <q-input
        id="member_country"
        name="member_country"
        v-model="state.country"
        placeholder="Address"
        outlined
        :error="errState?.country?.length > 0"
        :error-message="errState?.country"
        @update:model-value="errState.country = ''"
        hide-bottom-space
        :readonly="!isEditMode"
      />
    </div>
    <div class="q-mb-sm">
      <label for="member_zip" class="text-h5 text-semibold q-mb-sm block"
        >ZIP / Postal code
      </label>
      <q-input
        id="member_zip"
        name="member_zip"
        v-model="state.zip"
        placeholder="Address"
        outlined
        :error="errState?.zip?.length > 0"
        :error-message="errState?.zip"
        @update:model-value="errState.zip = ''"
        hide-bottom-space
        :readonly="!isEditMode"
      />
    </div>
    <div class="row justify-between q-mt-lg">
      <div>
        <q-btn
          label="Delete account"
          icon="o_delete"
          color="negative"
          no-caps
          class="q-px-lg"
        />
      </div>
      <div>
        <q-btn
          v-if="!isEditMode"
          label="Edit"
          color="info"
          no-caps
          type="submit"
          class="q-ml-md q-px-lg"
          icon="o_edit"
          @click="isEditMode = true"
        />
        <q-btn
          v-if="isEditMode"
          label="Save Changes"
          color="positive"
          no-caps
          type="submit"
          icon="save"
          class="q-px-lg"
          :disable="loading || submissionDisabled"
          :loading="loading"
        />
        <q-btn
          v-if="isEditMode"
          label="Cancel"
          color="grey-8"
          outline
          no-caps
          icon="close"
          class="q-ml-md q-px-lg"
          @click="onCancel"
        />
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
  name: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  zip: '',
  address: ''
})

const errState = ref({
  name: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  zip: '',
  address: ''
})

const onReset = () => {
  state.value = {
    name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    zip: '',
    address: ''
  }
  errState.value = {
    name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    zip: '',
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
    case 'inactive':
    case 0:
    case 'Not Verified':
      return 'badge-status badge-status--warning'
    case 'active':
    case 1:
    case 'Verified':
      return 'badge-status badge-status--positive'
    case 'banned':
    case 2:
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
  await getAPI('v1/member/profile')
    .then((res) => {
      state.value = res.data
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
  await putAPI('v1/member/update-profile', state.value)
    .then((res) => {
      $q.notify({
        message: 'Your personal information updated',
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

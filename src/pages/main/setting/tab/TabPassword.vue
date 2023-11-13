<template>
  <q-form @submit.prevent="onSubmit" class="q-gutter-md q-px-md">
    <div class="text-h5 text-semibold q-mb-md">Change Password</div>
    <div class="q-mb-sm">
      <label for="old_password" class="text-h5 text-semibold q-mb-sm block"
        >Old Password
      </label>
      <q-input
        id="old_password"
        name="old_password"
        type="password"
        v-model="state.oldPassword"
        placeholder="Ener your old password"
        outlined
        :error="errState?.oldPassword?.length > 0"
        :error-message="errState?.oldPassword"
        @update:model-value="errState.oldPassword = ''"
        hide-bottom-space
      />
    </div>
    <div class="q-mb-sm">
      <label for="new_password" class="text-h5 text-semibold q-mb-sm block"
        >New Password
      </label>
      <q-input
        id="new_password"
        name="new_password"
        type="password"
        v-model="state.newPassword"
        placeholder="Enter your new password"
        outlined
        :error="errState?.newPassword?.length > 0"
        :error-message="errState?.newPassword"
        @update:model-value="errState.newPassword = ''"
        hide-bottom-space
      />
    </div>
    <div class="q-mb-sm">
      <label for="confirm_password" class="text-h5 text-semibold q-mb-sm block"
        >Confirm Password
      </label>
      <q-input
        id="confirm_password"
        name="confirm_password"
        type="password"
        v-model="state.confirmPassword"
        placeholder="Enter your new password again"
        outlined
        :error="errState?.confirmPassword?.length > 0"
        :error-message="errState?.confirmPassword"
        @update:model-value="errState.newPassword = ''"
        hide-bottom-space
      />
    </div>
    <div class="q-mt-md">
      <q-btn
        label="Save Changes"
        color="positive"
        no-caps
        type="submit"
        icon="save"
        class="q-px-lg"
        :disable="loading"
        :loading="loading"
      />
    </div>
  </q-form>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { putAPI } from 'src/services/fetch.service'
import { ref } from 'vue'
import { mapErrorMessage } from 'src/utils/error'

const $q = useQuasar()

/* DATA */
const loading = ref(false)
const state = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const errState = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

/* UPDATE OPERATION */
const onSubmit = () => {
  loading.value = true
  putAPI('v1/member/auth/change-password', state.value)
    .then((res) => {
      $q.notify({
        message: 'Password updated successfully',
        type: 'positive',
        position: 'top'
      })

      state.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }

      errState.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    })
    .catch(async (err) => {
      console.log(err)
      if (err.status === 422) {
        errState.value = mapErrorMessage(err.data.errors)
      } else {
        $q.notify({
          message: err.data.message ?? 'Something went wrong',
          type: 'negative',
          position: 'top'
        })
      }
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

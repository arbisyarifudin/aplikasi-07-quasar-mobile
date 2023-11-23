<template>
  <q-form @submit.prevent="onSubmit" class="q-gutter-md q-px-md">
    <!-- <div class="text-h5 text-semibold q-mb-md">Ubah Kata Sandi</div> -->
    <div class="q-mb-sm">
      <label for="old_password" class="text-h6 text-semibold q-mb-sm block">Kata sandi lama
      </label>
      <q-input id="old_password" name="old_password" type="password" v-model="state.old_password"
        placeholder="Masukkan kata sandi lama" outlined :error="errState?.old_password?.length > 0"
        :error-message="errState?.old_password" @update:model-value="errState.old_password = ''" hide-bottom-space />
    </div>
    <div class="q-mb-sm">
      <label for="new_password" class="text-h6 text-semibold q-mb-sm block">Kata sandi baru
      </label>
      <q-input id="new_password" name="new_password" type="password" v-model="state.password"
        placeholder="Masukkan kata sandi baru" outlined :error="errState?.password?.length > 0"
        :error-message="errState?.password" @update:model-value="errState.password = ''" hide-bottom-space />
    </div>
    <div class="q-mb-sm">
      <label for="confirm_password" class="text-h6 text-semibold q-mb-sm block">Konfirmasi kata sandi baru
      </label>
      <q-input id="confirm_password" name="confirm_password" type="password" v-model="state.password_confirmation"
        placeholder="Masukkan kata sandi baru lagi" outlined :error="errState?.password_confirmation?.length > 0"
        :error-message="errState?.password_confirmation" @update:model-value="errState.password = ''" hide-bottom-space />
    </div>
    <div class="q-mt-md">
      <q-btn label="Simpan" color="primary" text-color="dark" no-caps type="submit" icon="save"
        :disable="loading" :loading="loading" />
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
  old_password: '',
  password: '',
  password_confirmation: ''
})
const errState = ref({
  old_password: '',
  password: '',
  password_confirmation: ''
})

/* UPDATE OPERATION */
const onSubmit = () => {
  loading.value = true
  putAPI('v1/user/password', state.value)
    .then((res) => {
      $q.notify({
        message: 'Kata sandi berhasil diperbarui',
        type: 'positive',
        position: 'top'
      })

      state.value = {
        old_password: '',
        password: '',
        password_confirmation: ''
      }

      errState.value = {
        old_password: '',
        password: '',
        password_confirmation: ''
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

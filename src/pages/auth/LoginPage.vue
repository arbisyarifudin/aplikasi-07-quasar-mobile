<template>
  <div>
    <div class="container">
      <div class="row justify-center q-col-gutter-md">
        <div class="col-md-6 col-12 auth-col-left">
          <div class="auth-left">
            <div class="text-center q-mb-md">
              <img src="~/assets/logo.png" alt="logo" class="logo q-mx-auto" />
            </div>
            <div class="auth-left__header q-mb-xl text-center">
              <div class="text-h4 text-medium text-primary">Log in</div>
              <p class="text-medium text-grey-4">
                Masukkan kredensial akun Anda untuk masuk ke dalam aplikasi
              </p>
            </div>

            <q-form @submit.prevent="onSubmit" class="auth-form">
              <div class="q-mb-md">
                <label for="uid" class="block q-mb-sm text-small text-semibold">ID / NIK / No. HP <span
                    class="text-primary">*</span></label>
                <q-input id="uid" v-model="state.uid" outlined dense type="uid"
                  placeholder="Masukkan ID / NIK / No. HP"
                  :rules="[(val) => val.length > 0 || 'ID / NIK / No HP diperlukan']"
                  :error="errorState?.uid?.length > 0" :error-message="errorState?.uid" :autofocus="false"
                  @update:model-value="errorState.uid = ''" hide-bottom-space />
              </div>
              <div class="q-mb-md">
                <label for="password" class="block q-mb-sm text-small text-semibold">Kata Sandi <span
                    class="text-primary">*</span></label>
                <q-input v-model="state.password" outlined dense :type="showPassword ? 'text' : 'password'"
                  placeholder="Masukkan kata sandi" :rules="[(val) => val.length > 0 || 'Kata sandi diperlukan']"
                  :error="errorState?.password?.length > 0" :error-message="errorState?.password"
                  @update:model-value="errorState.password = ''" hide-bottom-space autocomplete="new-password">
                  <template #append>
                    <q-icon :name="showPassword ? 'o_visibility_off' : 'o_visibility'" class="cursor-pointer"
                      @click="showPassword = !showPassword" />
                  </template>
                </q-input>
              </div>
              <div class="q-mb-sm row items-center justify-between hidden">
                <div class="col-7">
                  <q-checkbox v-model="state.rememberMe" label="Remember me" class="text-medium flex" />
                </div>
                <div class="col-5 text-right hidden">
                  <router-link :to="{ name: 'Forgot Password Page' }" class="link text-medium">Forgot your
                    password?</router-link>
                </div>
              </div>
              <q-btn class="q-mt-md full-width q-py-sm" color="primary" text-color="dark" label="Login" no-caps
                :loading="loading" :disable="loading" type="submit" />
              <div class="q-mt-md ">
                <div class="text-medium text-grey-7 text-center">
                  Belum punya akun?
                  <router-link :to="{ name: 'Register Page' }" class="link text-medium">Daftar</router-link>
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
import { login } from 'src/services/auth.service'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mapErrorMessage } from 'src/utils/error'

const $q = useQuasar()
const $router = useRouter()

const state = reactive({
  uid: '',
  password: '',
  rememberMe: true
})

const errorState = reactive({
  uid: '',
  password: ''
})

const showPassword = ref(false)
const loading = ref(false)

const onSubmit = () => {
  // console.log(state)

  // reset error state
  Object.assign(errorState, {
    uid: '',
    password: ''
  })

  loading.value = true
  login(state)
    .then(async (res) => {
      // console.log(res)

      // show alert success
      $q.notify({
        message: 'Login berhasil',
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

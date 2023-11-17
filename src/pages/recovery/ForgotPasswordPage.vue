<template>
  <div>
    <!-- login page that split into 2 grid, the left on is for form, the right is image -->
    <div class="container">
      <div class="row q-col-gutter-md">
        <div class="col-md-6 col-12 auth-col-left">
          <img src="~/assets/logo.png" alt="logo" class="logo" />
          <div class="auth-left">
            <div class="auth-left__header q-mb-xl">
              <div class="text-h2 text-medium text-primary">Forgot Password</div>
              <p class="text-h5 text-medium text-grey-7">
                Enter your email address to reset your password
              </p>
            </div>

            <q-form @submit.prevent="onSubmit" class="auth-form">
              <div class="q-mb-md">
                <label for="email" class="block q-mb-sm text-h5 text-semibold"
                  >Email <span class="text-primary">*</span></label
                >
                <q-input
                  id="email"
                  v-model="state.email"
                  outlined
                  type="email"
                  placeholder="Enter your email address"
                  :rules="[(val) => val.length > 0 || 'Email is required']"
                  :error="errorState?.email?.length > 0"
                  :error-message="errorState?.email"
                  @update:model-value="errorState.email = ''"
                  hide-bottom-space
                />
              </div>
              <q-btn
                class="q-mt-md full-width q-py-sm"
                color="primary"
                label="Submit Request"
                no-caps
                :loading="loading"
                :disable="loading"
                type="submit"
              />
              <div class="q-mt-md ">
                <div class="text-h6 text-medium text-grey-7 text-center">
                  <router-link :to="{ name: 'Login Page' }" class="link text-h5 text-medium"
                    >Back to Login</router-link
                  >
                </div>
              </div>
            </q-form>
          </div>
          <div class="auth-footer">
            <div class="text-h5 text-medium text-grey-5">&copy;2023 ONERO Solutions All rights reserved.</div>
          </div>
        </div>
        <div class="col-md-6 col-12" v-if="$q.screen.gt.sm">
          <!-- <img
            class="image-login"
            src="~/assets/banner-login.png"
            alt="login"
          /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { postAPI } from 'src/services/fetch.service'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mapErrorMessage } from 'src/utils/error'

const $q = useQuasar()
const $router = useRouter()

const state = ref({
  email: ''
})

const errorState = ref({
  email: ''
})

const loading = ref(false)

const onSubmit = async () => {
  if (loading.value) return

  loading.value = true

  await postAPI('/v1/member/recovery/forgot-password-request', state.value)
    .then((res) => {
      console.log(res)
      $q.notify({
        type: 'positive',
        position: 'top',
        message: 'Reset password link has been sent to your email'
      })
      $router.push({ name: 'Login Page' })
    })
    .catch((err) => {
      console.log(err)
      if (err.status === 422) {
        errorState.value = mapErrorMessage(err.data.errors)
      } else {
        $q.notify({
          type: 'negative',
          position: 'top',
          message: 'Failed to send reset password link'
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
  padding: 100px;

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

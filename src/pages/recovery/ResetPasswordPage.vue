<template>
  <div>
    <!-- login page that split into 2 grid, the left on is for form, the right is image -->
    <div class="container">
      <div class="row q-col-gutter-md">
        <div class="col-md-6 col-12 auth-col-left">
          <img src="~/assets/logo.png" alt="logo" class="logo" />
          <div class="auth-left">
            <div class="auth-left__header q-mb-xl">
              <div class="text-h2 text-medium text-primary">Reset Password</div>
              <p class="text-h5 text-medium text-grey-7">

              </p>
            </div>

            <q-form @submit.prevent="onSubmit" class="auth-form">
              <div class="q-mb-md">
                <label for="password" class="block q-mb-sm text-h5 text-semibold"
                  >New Password <span class="text-primary">*</span></label
                >
                <q-input
                  id="password"
                  v-model="state.password"
                  outlined
                  type="password"
                  placeholder="Enter your new password"
                  :rules="[(val) => val.length > 0 || 'New password is required']"
                  :error="errorState?.password?.length > 0"
                  :error-message="errorState?.password"
                  @update:model-value="errorState.password = ''"
                  hide-bottom-space
                />
              </div>
              <div class="q-mb-md">
                <label for="passwordConfirmation" class="block q-mb-sm text-h5 text-semibold"
                  >Re-type New Password <span class="text-primary">*</span></label
                >
                <q-input
                  id="passwordConfirmation"
                  v-model="state.passwordConfirmation"
                  outlined
                  type="password"
                  placeholder="Re-type your new password"
                  :rules="[(val) => val.length > 0 || 'Re-type new password is required']"
                  :error="errorState?.passwordConfirmation?.length > 0"
                  :error-message="errorState?.passwordConfirmation"
                  @update:model-value="errorState.passwordConfirmation = ''"
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
          <img
            class="image-login"
            src="~/assets/banner-login.png"
            alt="login"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { getAPI, postAPI } from 'src/services/fetch.service'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mapErrorMessage } from 'src/utils/error'
import { showLoading, showNotification } from 'src/utils/ui'

const $q = useQuasar()
const $router = useRouter()

const state = ref({
  password: '',
  passwordConfirmation: ''
})

const errorState = ref({
  password: '',
  passwordConfirmation: ''
})

const loading = ref(false)

const onSubmit = async () => {
  if (loading.value) return

  loading.value = true

  await postAPI('/v1/member/recovery/forgot-password-reset', {
    ...state.value,
    recoveryUuid: recoveryUuid.value || ''
  })
    .then((res) => {
      console.log(res)
      $q.notify({
        type: 'positive',
        position: 'top',
        message: 'Reset password success'
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
          message: 'Reset password failed'
        })
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const $route = useRoute()

const token = $route.query.token
const email = $route.query.email
const recoveryUuid = ref(null)

const verifyRequest = () => {
  showLoading(true, 'Verifying request...')
  getAPI('/v1/member/recovery/forgot-password-verify-request', {
    params: {
      token,
      email
    }
  })
    .then(async (res) => {
      console.log(res)
      recoveryUuid.value = res.data?.uuid
    })
    .catch(async (err) => {
      console.log(err)
      showNotification(err.data?.message || 'Something went wrong', 'negative')
      await $router.push({ name: 'Login Page' })
    }).finally(() => {
      showLoading(false)
    })
}

onMounted(async () => {
  if (!token || !email) {
    await $router.push({ name: 'Login Page' })
    return
  }

  verifyRequest()
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

<template>
  <div>
    <!-- login page that split into 2 grid, the left on is for form, the right is image -->
    <div class="container">
      <div class="row q-col-gutter-md">
        <div class="col-md-6 col-12 auth-col-left">
          <img src="~/assets/logo.png" alt="logo" class="logo" />
          <div class="auth-left">
            <div class="auth-left__header q-mb-xl">
              <div class="text-h2 text-medium text-primary">
                Create an account
              </div>
              <p class="text-h5 text-medium text-grey-7">
                Enter your details to create your account and start your journey
              </p>
            </div>

            <q-form @submit.prevent="onSubmit" class="auth-form">
              <div class="q-mb-md">
                <label for="name" class="block q-mb-sm text-h5 text-semibold"
                  >Fullname <span class="text-primary">*</span></label
                >
                <q-input
                  id="name"
                  v-model="state.name"
                  outlined
                  type="name"
                  placeholder="Enter your fullname"
                  :rules="[(val) => val.length > 0 || 'Fullname is required']"
                  :error="errorState?.name?.length > 0"
                  :error-message="errorState?.name"
                  @update:model-value="errorState.name = ''"
                  hide-bottom-space
                />
              </div>
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
              <div class="q-mb-md">
                <label
                  for="password"
                  class="block q-mb-sm text-h5 text-semibold"
                  >Password <span class="text-primary">*</span></label
                >
                <q-input
                  v-model="state.password"
                  outlined
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  :rules="[(val) => val.length > 0 || 'Password is required']"
                  :error="errorState?.password?.length > 0"
                  :error-message="errorState?.password"
                  @update:model-value="errorState.password = ''"
                  hide-bottom-space
                  autocomplete="new-password"
                >
                  <template #append>
                    <q-icon
                      :name="showPassword ? 'o_visibility_off' : 'o_visibility'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>
              </div>
              <div class="q-mb-md">
                <label
                  for="confirmPassword"
                  class="block q-mb-sm text-h5 text-semibold"
                  >Confirm Password <span class="text-primary">*</span></label
                >
                <q-input
                  v-model="state.confirmPassword"
                  outlined
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password again"
                  :rules="[(val) => val.length > 0 || 'Confirm Password is required']"
                  :error="errorState?.confirmPassword?.length > 0"
                  :error-message="errorState?.confirmPassword"
                  @update:model-value="errorState.confirmPassword = ''"
                  hide-bottom-space
                  autocomplete="new-password"
                >
                  <template #append>
                    <q-icon
                      :name="showPassword ? 'o_visibility_off' : 'o_visibility'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>
              </div>
              <div class="q-mb-sm">
                <q-checkbox
                  v-model="state.agree"
                  class="q-mr-sm"
                  dense
                  color="primary"
                  style="display: flex !important; align-items: center;"
                >
                  <div class="text-h5 text-medium text-grey-7">
                    I agree to the
                    <a href="javascript:void()" class="link text-h5 text-medium"
                      >Terms of Service</a
                    >
                    and
                    <a href="javascript:void()" class="link text-h5 text-medium"
                      >Privacy Policy</a
                    >
                  </div>
                </q-checkbox>
              </div>
              <q-btn
                class="q-mt-md full-width q-py-sm"
                color="primary"
                label="Register"
                no-caps
                :loading="loading"
                :disable="loading"
                type="submit"
              />
              <div class="q-mt-md">
                <div class="text-h5 text-medium text-grey-7 text-center">
                  Already have an account?
                  <router-link
                    :to="{ name: 'Login Page' }"
                    class="link text-h5 text-medium"
                    >Login</router-link
                  >
                </div>
              </div>
            </q-form>
          </div>
          <div class="auth-footer">
            <div class="text-h5 text-medium text-grey-5">
              &copy;2023 ONERO Solutions All rights reserved.
            </div>
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
import { register } from 'src/services/auth.service'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mapErrorMessage } from 'src/utils/error'

const $q = useQuasar()
const $router = useRouter()

const state = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false
})

const errorState = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const loading = ref(false)

const onSubmit = () => {
  console.log(state)

  loading.value = true
  register(state)
    .then(async (res) => {
      // console.log(res)

      // show alert success
      $q.notify({
        message: 'Register success! Please check your email to verify your account.',
        color: 'positive',
        position: 'top',
        icon: 'check_circle',
        timeout: 2000
      })

      // redirect to dashboard page
      await $router.push({ name: 'Login Page' })
    })
    .catch((err) => {
      // console.log(err)
      if (err.status === 422) {
        Object.assign(errorState, mapErrorMessage(err.data.errors))
      } else if (err.status === 401) {
        errorState.password = err.data.message
      } else {
        // show alert error
        $q.notify({
          message: err.data.message || 'Something went wrong!',
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
  padding: 50px 100px;

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

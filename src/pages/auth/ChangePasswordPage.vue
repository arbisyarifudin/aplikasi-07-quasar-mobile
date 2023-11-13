<template>
  <div>
    <!-- login page that split into 2 grid, the left on is for form, the right is image -->
    <div class="container">
      <div class="row q-col-gutter-md">
        <div class="col-md-6 col-12 auth-col-left">
          <img src="~/assets/logo.png" alt="logo" class="logo" />
          <div class="auth-left">
            <div class="auth-left__header q-mb-xl">
              <div class="text-h2 text-medium text-primary">Change Password</div>
              <p class="text-h5 text-medium text-grey-7">
                Please enter your new password to change your password.
              </p>
            </div>

            <q-form @submit.prevent="onSubmit" class="auth-form">
              <div class="q-mb-md">
                <label
                  for="password"
                  class="block q-mb-sm text-h5 text-semibold"
                  >New Password <span class="text-primary">*</span></label
                >
                <q-input
                  v-model="state.password"
                  outlined
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your new password"
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
                  >Confirm New Password <span class="text-primary">*</span></label
                >
                <q-input
                  v-model="state.confirmPassword"
                  outlined
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your new password again"
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
              <q-btn
                class="q-mt-md full-width q-py-sm"
                color="primary"
                label="Reset Password"
                no-caps
                :loading="loading"
                :disable="loading"
                type="submit"
              />
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
// import { login } from 'src/services/auth.service'
import { reactive, ref } from 'vue'
// import { useRouter } from 'vue-router'
// import { mapErrorMessage } from 'src/utils/error'

const $q = useQuasar()
// const $router = useRouter()

const state = reactive({
  email: ''
})

const errorState = reactive({
  email: ''
})

const showPassword = ref(false)
const loading = ref(false)

const onSubmit = () => {
  console.log(state)
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

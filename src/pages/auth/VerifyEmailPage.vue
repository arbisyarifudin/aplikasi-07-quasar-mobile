<template>
  <div class="container">
    <div v-if="loading" class="flex items-center justify-center">
      <q-spinner size="sm" color="grey-6"></q-spinner>
      <div class="text-h4 text-semibold text-grey-6 q-ml-md">Verifying email...</div>
    </div>
  </div>
</template>

<script setup>
import { LocalStorage, useQuasar } from 'quasar'
import { getAPI } from 'src/services/fetch.service'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $q = useQuasar()
const $route = useRoute()
const $router = useRouter()

const loading = ref(true)

const verifyEmail = () => {
  loading.value = true
  // check if token and email exist
  if (!$route.query.token || !$route.query.email) {
    $q.notify({
      message: 'Invalid token or expired!',
      color: 'negative',
      position: 'top',
      icon: 'error',
      timeout: 2000
    })
    $router.push({ name: 'Login Page' })
    loading.value = false
  } else {
    // remove token from local storage
    LocalStorage.remove('app_auth_token')

    // verify email
    getAPI('v1/member/auth/verify-email', {
      params: {
        token: $route.query.token,
        email: $route.query.email
      }
    })
      .then((res) => {
        console.log(res)
        $q.notify({
          message: 'Email verified successfully!',
          color: 'positive',
          position: 'top',
          icon: 'check_circle',
          timeout: 2000
        })
      })
      .catch((err) => {
        console.log(err)
        $q.notify({
          message: 'Invalid token or expired!',
          color: 'negative',
          position: 'top',
          icon: 'error',
          timeout: 2000
        })
      })
      .finally(async () => {
        await $router.push({ name: 'Login Page' })
        loading.value = false
      })
  }
}

onMounted(() => {
  verifyEmail()
})

</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 100px;
}

</style>

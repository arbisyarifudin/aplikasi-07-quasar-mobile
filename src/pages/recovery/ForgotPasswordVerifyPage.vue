<template>
  <div>
    <span>Verifying request...</span>
  </div>
</template>

<script setup>

import { getAPI } from 'src/services/fetch.service'
import { showLoading, showNotification } from 'src/utils/ui'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $router = useRouter()
const $route = useRoute()
const token = $route.query.token
const email = $route.query.email

const verifyRequest = () => {
  showLoading(true, 'Verifying request...')
  getAPI('/v1/member/recovery/forgot-password-verify-request', {
    params: {
      token,
      email
    }
  })
    .then(async () => {
      await $router.push({ name: 'Reset Password Page', query: { token, email } })
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

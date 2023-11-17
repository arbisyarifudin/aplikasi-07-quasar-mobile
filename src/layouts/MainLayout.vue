<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated v-if="$q.screen.lt.md">
      <q-toolbar class="text-dark hidden">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Aplikasi07 </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>

      <q-toolbar class="flex justify-between">
        <div class="q-py-sm header-logo">
          <q-img src="~/assets/logo.png" width="30px" fit="contain"></q-img>
          <div class="text-bold text-dark q-ml-sm">Aplikasi 07</div>
        </div>

        <q-btn text-color="dark" flat no-caps dense @click="logout">
          <span class="q-mr-sm text-semibold">Logout</span>
          <ph-icon name="SignOut" size="20" />
        </q-btn>
      </q-toolbar>

    </q-header>

    <SidebarMenu :open="sidebarOpen" />

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive :exclude="[]">
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab v-if="fabRightWrapperShow" v-model="fabRightState" vertical-actions-align="right" color="primary"
          text-color="dark" icon="add" direction="up">
          <!-- <q-fab-action color="primary" text-color="dark" label="Input Hasil & C1" /> -->
          <q-fab-action color="primary" text-color="dark" :to="{ name: 'TPS Create Page' }" label="Input TPS" />
          <q-fab-action color="primary" text-color="dark" :to="{ name: 'Constituent Create Page' }"
            label="Input Konstituen" />
        </q-fab>
      </q-page-sticky>
    </q-page-container>

    <BottomMenu :items="[]" />
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'

import SidebarMenu from 'components/menu/SidebarMenu.vue'
import BottomMenu from 'components/menu/BottomMenu.vue'
import { LocalStorage, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useRoute, useRouter } from 'vue-router'
import { showNotification } from 'src/utils/ui'
import { useGlobalStore } from 'src/stores/global-store'

const sidebarOpen = ref(false)
const toggleLeftDrawer = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const fabRightState = ref(false)

const $q = useQuasar()
const $router = useRouter()
const globalStore = useGlobalStore()

const logout = () => {
  console.log('logout')
  $q.dialog({
    title: 'Logout',
    message: 'Are you sure you want to logout?',
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(() => {
    console.log('logout')

    globalStore.setLoadingState(true)

    // remove token
    api.post('v1/auth/logout')
      .then(res => {
        LocalStorage.remove('app_auth_token')
        LocalStorage.remove('app_auth_user')

        $router.push({ name: 'Login Page' })
      })
      .catch(() => {
        showNotification('Terjadi kesalahan. Coba lagi.', 'negative', 'error')
      }).finally(() => {
        globalStore.setLoadingState(false)
      })
  })
}

const $route = useRoute()
const fabRightWrapperShow = ref(false)
watch(() => $route.name, (val) => {
  checkRouteName()
})

const checkRouteName = () => {
  const routeName = $route.name.toLowerCase() // ex: 'constituent create page'
  console.log('routeName', routeName)
  // if routeName includes 'create' or 'edit', then hide fabRightWrapper
  if (routeName.includes('index') || routeName.includes('dashboard')) {
    fabRightWrapperShow.value = true
  } else {
    fabRightWrapperShow.value = false
  }
}

checkRouteName()

</script>

<style lang="scss" scoped>
.header-logo {
  color: $dark;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0 0 15px 0px #fefe5d47;
  border: 1px solid $primary;
  margin: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

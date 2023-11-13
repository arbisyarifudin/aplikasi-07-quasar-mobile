<template>
  <q-drawer :model-value="open" :width="320" class="sidebar-menu flex flex-col justify-between">
    <q-list class="menu-list">
      <q-item-label header>
        <img src="~/assets/logo.png" alt="logo" class="menu-logo q-mx-auto block" />
      </q-item-label>

      <MenuItem v-for="menu in mainMenus" :key="menu.title" v-bind="menu" />
    </q-list>

    <div class="fixed-bottom">
      <q-list class="menu-list">
        <MenuItem v-for="menu in secondMenus" :key="menu.title" v-bind="menu" />
        <q-item>
          <q-item-section avatar>
            <q-img src="https://cdn.quasar.dev/img/boy-avatar.png" width="56px" fit="contain"
              style="border-radius: 50%" />
          </q-item-section>

          <q-item-section>
            <!-- <q-item-label caption class="text-small">Login as:</q-item-label> -->
            <q-item-label class="text-h5 text-semibold">{{ userProfile.name }}</q-item-label>
            <q-item-label caption class="text-small text-medium">Affiliator</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

    </div>
  </q-drawer>
</template>

<script setup>
import MenuItem from 'components/MenuItem.vue'
import { computed } from 'vue'
import { LocalStorage, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const $q = useQuasar()
const $router = useRouter()

const userProfile = computed(() => {
  return LocalStorage.getItem('app_auth_user')
})

const mainMenus = [
  {
    title: 'Dashboard',
    caption: null,
    icon: 'SquaresFour',
    route: { name: 'Dashboard Page' }
  },
  {
    title: 'Product',
    caption: null,
    icon: 'Cube',
    route: { name: 'Product Index Page' }
  },
  {
    title: 'Cashout',
    caption: null,
    icon: 'ArrowCircleUpRight',
    route: { name: 'Cashout Index Page' }
  }
]

const secondMenus = [
  {
    title: 'Setting',
    caption: null,
    icon: 'GearSix',
    route: { name: 'Setting Index Page' }
  },
  {
    title: 'Logout',
    color: 'primary',
    caption: null,
    icon: {
      name: 'SignOut',
      color: '#9C1915'
    },
    route: null,
    onClick: () => {
      $q.dialog({
        title: 'Logout',
        message: 'Are you sure want to logout?',
        ok: 'Yes',
        cancel: true,
        persistent: false
      }).onOk(async () => {
        // $q.loading.show()
        LocalStorage.remove('app_auth_token')
        await $router.push({ name: 'Login Page' })
        // $q.loading.hide()
      })
    }
  }
]
</script>

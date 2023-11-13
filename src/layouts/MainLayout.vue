<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated v-if="$q.screen.lt.md">
      <q-toolbar class="text-dark hidden">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Aplikasi07 </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>

      <div class="q-py-sm header-logo">
        <q-img src="~/assets/logo.png" width="30px" fit="contain"></q-img>
        <div class="text-bold text-dark q-ml-sm">Aplikasi07</div>
      </div>

    </q-header>

    <SidebarMenu :open="sidebarOpen" />

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive :exclude="[]">
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab
          v-model="fabRight"
          vertical-actions-align="right"
          color="primary"
          text-color="dark"
          icon="add"
          direction="up"
        >
        <q-fab-action color="primary" text-color="dark" @click="onClick" label="Input Hasil & C1" />
        <q-fab-action color="primary" text-color="dark" @click="onClick" label="Input Saksi Pemilu" />
        <q-fab-action color="primary" text-color="dark" @click="onClick" label="Input Konstituen" />
        </q-fab>
      </q-page-sticky>
    </q-page-container>

    <BottomMenu v-if="$q.screen.lt.md" :items="[]"/>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

import SidebarMenu from 'components/menu/SidebarMenu.vue'
import BottomMenu from 'components/menu/BottomMenu.vue'

const sidebarOpen = ref(false)
const toggleLeftDrawer = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const fabRight = ref(false)
const onClick = () => {
  console.log('click')
}

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

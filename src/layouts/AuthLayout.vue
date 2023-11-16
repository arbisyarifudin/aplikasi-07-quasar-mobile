<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { LocalStorage } from 'quasar'
LocalStorage.remove('app_selected_user_area')
</script>

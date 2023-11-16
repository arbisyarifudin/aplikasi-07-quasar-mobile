<template>
  <q-page class="main">
    <q-card style="min-height: 600px;" class="q-pb-xl">
      <q-card-section>
        <div class="flex justify-between items-center">
          <div class="text-h5 text-semibold">Pengaturan</div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-tabs v-model="tab" inline-label class="" dense active-class="text-primary text-bold">
              <q-tab
                style="justify-content: space-between"
                name="personal"
                icon="person"
                label="Pribadi"
                class="q-py-md q-my-sm"
                />
              <q-tab
                style="justify-content: space-between"
                name="account"
                icon="lock"
                label="Kata Sandi"
                class="q-py-md q-my-sm"
                />
            </q-tabs>
          </div>

          <div class="col-12">
            <q-tab-panels v-model="tab" animated vertical keep-alive>
              <q-tab-panel name="personal" class="q-px-none">
               <TabPersonal />
              </q-tab-panel>
              <q-tab-panel name="account" class="q-px-none">
                <TabPassword />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>

import { ref } from 'vue'
import TabPersonal from './tab/TabPersonal.vue'
import TabPassword from './tab/TabPassword.vue'

const tab = ref('personal')

</script>

<template>
  <q-page class="main">
    <div class="flex justify-between items-center q-mb-lg">
      <div class="text-h2 text-semibold">Setting</div>
    </div>
    <q-card style="min-height: 600px;" class="q-pb-xl">
      <!-- <q-card-section>
        <div class="text-h3 text-semibold">Account Information</div>
      </q-card-section>
      <q-separator /> -->
      <q-card-section>
        <div class="row">
          <div class="col">
            <q-tabs v-model="tab" vertical inline-label class="text-dark" active-class="text-primary text-bold">
              <q-tab
                style="justify-content: space-between"
                name="personal"
                icon="person"
                label="Personal"
                class="q-py-md q-my-sm"
                />
              <q-tab
                style="justify-content: space-between"
                name="documents"
                icon="fact_check"
                label="Document"
                class="q-py-md q-my-sm"
                />
              <q-tab
                style="justify-content: space-between"
                name="account"
                icon="lock"
                label="Change Password"
                class="q-py-md q-my-sm"
                />
            </q-tabs>
            <!-- <div class="q-pl-md">
              <q-btn
                label="Delete account"
                icon="o_delete"
                color="negative"
                no-caps
                class="q-px-lg"
              />
            </div> -->
          </div>

          <div class="col-sm-10">
            <q-tab-panels v-model="tab" animated vertical keep-alive>
              <q-tab-panel name="personal">
               <TabPersonal />
              </q-tab-panel>
              <q-tab-panel name="documents">
                <TabDocument />
              </q-tab-panel>
              <q-tab-panel name="account">
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
import TabDocument from './tab/TabDocument.vue'
import TabPassword from './tab/TabPassword.vue'

const tab = ref('personal')

</script>

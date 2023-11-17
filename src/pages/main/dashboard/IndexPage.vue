<template>
  <q-page class="main">
    <!-- <div class="text-h4 text-semibold q-mb-sm">Dashboard</div> -->
    <div class="hidden">
      <div class="alert alert--negative q-mb-md" v-if="userProfile.status !== 'active'">
        <ph-icon name="WarningCircle" size="40px" />
        <span class="text-dark">Akun Anda belum aktif. Silahkan cek nomor Anda untuk melakukan aktivasi akun.</span>
      </div>
    </div>
    <div class="text-medium">
      Selamat datang, <span class="text-bold">{{ userProfile.name }}</span>! Berikut adalah ringkasan data Anda.
    </div>

    <q-separator class="q-mt-lg q-mb-lg" />

    <div class="q-mt-lg">
      <div class="text-h4 text-semibold q-mb-md">Statistik</div>
    </div>
    <div class="row q-col-gutter-lg">
      <div class="col-md-4 col-12 hidden">
        <q-card class="stat q-px-md q-py-md">
          <div class="flex items-center no-wrap">
            <div class="stat-icon">
              <ph-icon name="Users" />
            </div>
            <div class="text-h4 text-semibold">Total Wilayah Kerja</div>
          </div>
          <div class="flex items-center">
            <div class="text-h1 text-bold text-primary">0</div>
            <div class="text-h6 q-ml-sm">wilayah</div>
          </div>
          <div class="text-small text-semibold text-grey-6">
            Total wilayah kerja yang ditugasikan kepada Anda
          </div>
        </q-card>
      </div>
      <div class="col-md-4 col-12">
        <q-card class="stat q-px-md q-py-md">
          <div class="flex items-center no-wrap">
            <div class="stat-icon">
              <ph-icon name="Users" />
            </div>
            <div class="text-h4 text-semibold">Total Konstituen</div>
          </div>
          <div class="flex items-center">
            <div class="text-h1 text-bold text-primary">{{ summaryData?.total_constituent }}</div>
            <div class="text-h4 q-ml-sm">orang</div>
          </div>
          <div class="text-small text-semibold text-grey-6">
            Total konstituen yang telah Anda daftarkan
          </div>
        </q-card>
      </div>
    </div>

    <div class="q-mt-lg hidden">
      <div class="text-h4 text-semibold q-mb-md">Aktivitas Terakhir</div>

        <div class="q-px-lg q-py-md">
          <q-timeline color="primary">
            <q-timeline-entry>
              <template v-slot:title>
                <div class="text-h6 text-medium">Aktifitas 1</div>
              </template>
              <template v-slot:subtitle>
                <div class="text-small text-grey-6">20 Feb 2023, 10:12</div>
              </template>
            </q-timeline-entry>
          </q-timeline>
        </div>

    </div>

  </q-page>
</template>

<style lang="scss">
.stat {
  min-height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 24px;
  gap: 8px;
  // box-shadow: 0 0 15px 0px #fefe5d47;
  // border: 1px solid $primary;

  .stat-icon {
    width: 40px;
    height: 40px;
    padding: 8px;
    border-radius: 5px;
    // background-color: #f2f2f2;
    background-color: transparent;
    // border: 1px solid #e0e0e0;
    border: 1px solid #646464;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
  }
}
</style>

<script setup>
import { LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'
import { computed, onMounted, ref } from 'vue'

/* USER PROFILE */
const userProfile = computed(() => {
  return LocalStorage.getItem('app_auth_user')
})

/* DATA */
const summaryData = ref({
  total_constituent: 0
})

onMounted(() => {
  api.get('v1/statistic/summary')
    .then(res => {
      console.log(res)
      summaryData.value = res.data?.data || {}
    })
    .catch(err => {
      console.log(err)
    })
})

// const activityData = ref([])

</script>

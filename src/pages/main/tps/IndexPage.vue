<template>
  <q-page class="main">
    <q-card class="page-content">
      <div class="page-content__header sticky q-px-md">
        <div class="flex items-center justify-between ">
          <div class="text-h6 text-semibold">TPS</div>
          <q-input borderless dense debounce="300" v-model="search" placeholder="Cari">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <q-separator />
        <div class="flex q-mt-sm justify-end">
          <div class="text-small">Total: {{ pagination.rowsNumber }}</div>
        </div>
      </div>
      <div class="page-content__body">
        <q-table ref="tableRef" grid flat :rows="rows" :columns="columns" row-key="uuid" v-model:pagination="pagination"
          :loading="loading" :filter="search" binary-state-sort @request="onRequest" hide-pagination
          table-header-class="bg-primaryx text-darkx">
          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 q-mb-sm">
              <q-card flat bordered>
                <q-badge class="absolute top-left bg-grey-8" style="border-radius: 50%;">{{ props.rowIndex + 1
                }}</q-badge>
                <q-card-section class="column q-py-sm q-pl-lg">
                  <div class="flex items-center justify-between">
                    <div class="">
                      <div class="text-h6 text-semibold">{{ props.row.name }}</div>
                      <div class="text-small text-italic">Saksi: 0 orang</div>
                    </div>
                    <div class="flex items-center">
                      <q-btn dense flat color="info"
                        :to="{ name: 'Constituent Edit Page', params: { id: props.row.id } }">
                        <ph-icon name="PencilSimple" size="15"></ph-icon>
                      </q-btn>
                      <q-btn dense flat color="negative" class="q-ml-sm" @click="openDeleteDialog(props.row)">
                        <ph-icon name="X" size="15"></ph-icon>
                      </q-btn>
                    </div>
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-section class="q-py-sm q-pl-lg">
                  <div class="flex items-center justify-between text-small q-mb-sm">
                    <div class="">Alamat TPS:</div>
                    <!-- <div class="text-small text-italic">{{ props.row.address ?? '[tidak ada]' }}</div> -->
                     <div class="text-small text-italic" style="font-size: 10px; line-height: 16px;">{{ props.row.address }}</div>
                  </div>
                  <div class="flex items-center justify-between text-small q-mb-sm">
                    <div class="">Wilayah Kerja:</div>
                    <!-- <div class="text-small text-italic" style="font-size: 10px; line-height: 16px;">{{ props.row.area_name }}</div> -->
                    <div class="text-small text-italic">{{ props.row.area_code }}</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
          <template v-slot:no-data>
            <div class="flex justify-center full-width">
              <div class="text-h6 text-center">Belum ada data. <br>Silahkan <router-link :to="{ name: 'TPS Create Page' }"
                  class="text-primary">input data</router-link> lebih dahulu.</div>
            </div>
          </template>
        </q-table>
        <div class="q-px-md q-py-md q-mb-md" v-if="pagesNumber > 1">
          <div class="flex justify-center q-gutter-md">
            <q-pagination v-model="pagination.page" :max="pagesNumber" :max-pages="1" direction-links color="grey-3"
              text-color="grey-7" active-color="primary" active-text-color="dark" size="sm" gutter="10px" unelevated
              @update:model-value="onPaginationChange" />
          </div>
          <div class="text-center q-mt-sm" v-if="loading">
            <q-spinner></q-spinner>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { getAPI } from 'src/services/fetch.service'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { showNotification } from 'src/utils/ui'
import { useGlobalStore } from 'src/stores/global-store'

const columns = [
  {
    name: 'index',
    label: '#',
    align: 'left',
    sortable: false
  },
  {
    name: 'name',
    label: 'Nama',
    field: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'area_name',
    label: 'Wilayah Kerja',
    field: 'area_name',
    align: 'left',
    sortable: true
  },
  {
    name: 'action',
    label: 'Action',
    align: 'center'
  }
]

const tableRef = ref()
const rows = ref([])
const search = ref('')
const loading = ref(false)
const pagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0
})

const pagesNumber = computed(() => {
  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
})

// const rowsPerPageOptions = [5, 10, 15, 25]

// fetch data from server
async function fetchFromServer ({
  filter,
  sortBy,
  descending,
  page,
  rowsPerPage
}) {
  return await getAPI('/v1/area-polling', {
    params: {
      keyword: filter,
      page,
      limit: rowsPerPage,
      sortBy,
      sortDir: descending ? 'desc' : 'asc'
    }
  })
    .then((res) => {
      console.log('res', res)

      // update rowsCount with appropriate value
      pagination.value.rowsNumber = res.data.pagination.total

      // rows.value = res.data.data
      return res.data.data || []
    })
    .catch((err) => {
      console.log('err', err)
    })
    .finally(() => {
      loading.value = false
    })
}

async function onRequest (props) {
  // console.log('onRequest', props)

  const { page, rowsPerPage, sortBy, descending } = props.pagination
  const filter = props.filter

  loading.value = true

  // get all rows if "All" (0) is selected
  const fetchCount = rowsPerPage === 0 ? 0 : rowsPerPage

  // fetch data from server
  const returnedData = await fetchFromServer({
    filter,
    sortBy,
    descending,
    page,
    rowsPerPage: fetchCount
  })

  // clear out existing data and add new
  if (returnedData) {
    rows.value.splice(0, rows.value.length, ...returnedData) // or rows.value = returnedData
  }

  // update local pagination object
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending

  // ...and turn off loading indicator
  loading.value = false
}

// eslint-disable-next-line no-unused-vars
const onSearch = (keyword) => {
  console.log('onSearch', keyword)
  tableRef.value.requestServerInteraction()
}

const onPaginationChange = (page) => {
  console.log('onPaginationChange', page)
  tableRef.value.requestServerInteraction()
}

onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction()
})

/* WATCHER */
// watch per page
watch(
  () => pagination.value.rowsPerPage,
  () => {
    tableRef.value.requestServerInteraction()
  }
)

// watch route query
const $route = useRoute()
const $router = useRouter()
watch(
  () => $route.query,
  (val) => {
    if (val && val.refresh === 'true') {
      tableRef.value.requestServerInteraction()

      // clear query
      $router.replace({ query: {} })
    }
  }
)

/* ACTION */
const $q = useQuasar()
const globalStore = useGlobalStore()

const deleteLoading = ref(false)

const openDeleteDialog = (item) => {
  console.log('openDeleteDialog', item)

  $q.dialog({
    title: 'Hapus TPS',
    message: 'Apakah Anda yakin ingin menghapus TPS ini?',
    persistent: deleteLoading.value,
    cancel: {
      label: 'Tidak',
      color: 'grey-7',
      noCaps: true
    },
    ok: {
      label: 'Ya',
      noCaps: true,
      loading: deleteLoading.value
    },
    color: 'negative'
  }).onOk(() => {
    deleteLoading.value = true
    globalStore.setLoadingState(true)
    globalStore.setLoadingTitleState('Menghapus...')
    api.delete('v1/area-polling/' + item.id)
      .then(res => {
        console.log('res', res)
        showNotification('TPS berhasil dihapus', 'positive', 'check')

        // remove item from rows
        const index = rows.value.findIndex((row) => row.id === item.id)
        rows.value.splice(index, 1)

        tableRef.value.requestServerInteraction()
      }).catch(_ => {
        showNotification('Terjadi kesalahan. Coba lagi.', 'negative', 'error')
      }).finally(() => {
        deleteLoading.value = false
        globalStore.setLoadingState(false)
      })
  })
}

</script>

<style lang="scss" scoped>
.main {
  height: 0;
}

// page content with sticky header
.page-content {
  display: flex;
  flex-direction: column;
  height: 80vh;

  &__header {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  &__body {
    flex: 1;
    overflow-y: auto;
  }
}
</style>

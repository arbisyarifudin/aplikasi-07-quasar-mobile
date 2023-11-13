<template>
  <q-page class="main">
    <div class="flex justify-between items-center q-mb-lg">
      <div class="text-h2 text-semibold">Konstituen</div>
    </div>
    <q-card>
      <div class="flex q-px-md q-py-md">
        <div class="text-h4 text-semibold">Konstituen</div>
        <q-space />
      </div>
      <q-separator />
      <q-table
        ref="tableRef"
        flat
        :rows="rows"
        :columns="columns"
        row-key="uuid"
        v-model:pagination="pagination"
        :loading="loading"
        :filter="search"
        binary-state-sort
        @request="onRequest"
        hide-pagination
        table-header-class="bg-primary text-dark"
      >
      <template v-slot:loading>
          <div class="flex flex-center">
            <q-spinner-dots size="30px" color="primary" />
          </div>
        </template>
        <template v-slot:top="">
          <q-toolbar class="q-px-none">
            <PerPageSelector
              v-model="pagination.rowsPerPage"
              :options="rowsPerPageOptions"
            />
            <q-space />
            <q-input
              dense
              outlined
              debounce="300"
              v-model="search"
              @update:model-value="onSearch"
              placeholder="Search"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-toolbar>
        </template>
        <template v-slot:body-cell-index="props">
          <q-td :props="props">
            {{ props.rowIndex + 1 }}
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">

          </q-td>
        </template>
        <template v-slot:body="props">
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="q-pa-lg" v-if="pagesNumber > 1">
        <div class="flex justify-center q-gutter-md">
          <q-pagination
            v-model="pagination.page"
            :max="pagesNumber"
            :max-pages="1"
            direction-links
            color="grey-3"
            text-color="grey-7"
            active-color="primary"
            active-text-color="white"
            size="md"
            gutter="10px"
            unelevated
            @update:model-value="onPaginationChange"
          />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import PerPageSelector from 'src/components/UI/PerPageSelector.vue'

import { ref, onMounted, computed, watch } from 'vue'
import { getAPI } from 'src/services/fetch.service'

const columns = [
  {
    name: 'index',
    label: '#',
    align: 'left',
    sortable: false
  },
  {
    name: 'name',
    label: 'Konstituen Name',
    field: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'nik',
    label: 'NIK',
    field: 'nik',
    align: 'left',
    sortable: true
  },
  {
    name: 'phone',
    label: 'No. HP / WA',
    field: 'phone',
    align: 'left',
    sortable: true
  },
  {
    name: 'address',
    label: 'Alamat',
    field: 'address',
    align: 'left',
    // wrap cell content
    style: 'max-width: 250px; word-wrap: break-word; white-space: break-spaces;',
    headerStyle: 'max-width: 250px',
    format: (val) => val || '-',
    required: true
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
  sortBy: 'createdAt',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0
})

const pagesNumber = computed(() => {
  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
})

const rowsPerPageOptions = [5, 10, 15, 25]

// fetch data from server
async function fetchFromServer ({
  filter,
  sortBy,
  descending,
  page,
  rowsPerPage
}) {
  return await getAPI('/v1/coordinator/constituent', {
    params: {
      keyword: filter,
      page,
      limit: rowsPerPage,
      sortBy,
      sortDir: descending ? 'desc' : 'asc'
    }
  })
    .then((res) => {
      // update rowsCount with appropriate value
      pagination.value.rowsNumber = res.data.pagination.total

      // rows.value = res.data.data
      return res.data.data
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
  rows.value.splice(0, rows.value.length, ...returnedData) // or rows.value = returnedData

  // update local pagination object
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending

  // ...and turn off loading indicator
  loading.value = false
}

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

</script>

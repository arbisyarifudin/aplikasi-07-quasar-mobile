<template>
  <div class="text-h5 text-semibold q-mb-md">Document Verification</div>
  <div class="row q-col-gutter-md">
    <div class="col-md-12 text-center" v-if="loading">
      <div class="flex items-center justify-center">
        <q-spinner></q-spinner>
        <div class="text-small q-ml-sm">Loading...</div>
      </div>
    </div>
    <div class="col-md-12 text-left">
        <div class="alert alert--negative q-mb-sm" v-if="userProfile.documentStatus === 'Not Verified'">
          <ph-icon name="WarningCircle" size="40px"/>
          <span class="text-dark">Your document is not uploaded yet. Please upload your document first to be able to
            use our services.</span>
        </div>
        <div class="alert alert--warning q-mb-sm" v-else-if="userProfile.documentStatus === 'In Review'">
          <ph-icon name="WarningCircle" size="40px"/>
          <span class="text-dark">Your document is in review. Please wait until your document is verified to be able to use our services.</span>
        </div>
        <div class="alert alert--negative q-mb-sm" v-else-if="userProfile.documentStatus === 'Rejected'">
          <ph-icon name="WarningCircle" size="40px"/>
          <span class="text-dark">Your document is rejected. Please upload your document again to be able to use our services.</span>
        </div>
        <div class="alert alert--positive q-mb-sm" v-else-if="userProfile.documentStatus === 'Verified'">
          <ph-icon name="WarningCircle" size="40px"/>
          <span class="text-dark">Your document is verified. You can use our services now.</span>
        </div>
    </div>
    <div class="col-md-4" v-for="(document, index) in documents" :key="index">
      <q-card bordered>
        <q-card-section class="q-pb-none">
          <q-img :src="document.memberDocument.fileUrl" v-if="document.memberDocument && document.memberDocument.fileUrl" height="250px" fit="contain"/>
          <q-img src="/document.png" v-else height="250px" fit=""/>
        </q-card-section>
        <q-card-section>
          <div class="text-h5 text-medium">{{document.name}}</div>
          <div class="text-small q-mb-md">({{document.description}})</div>
          <div class="flex items-center justify-between"><span class="text-h6">Status: </span>
            <span class="flex items-center" v-if="document.memberDocument" :class="['inline', badgeStatus(document.memberDocument.status)]">{{ document.memberDocument.statusLabel }} <q-icon v-if="document.memberDocument.note" name="error" size="15px"><q-tooltip>{{ document.memberDocument.note }}</q-tooltip></q-icon></span>
            <span v-else :class="['inline', badgeStatus(2)]">Not Uploaded</span>
          </div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="between">
          <!-- <q-file v-model="document.file">
            <template v-slot:default="props">
              <div>{{ props.label }}</div>
              <q-btn no-caps unelevated rounded label="Upload Document" color="primary" icon="upload" class="full-width q-px-xl"/>
            </template>
          </q-file> -->
          <q-file clearable color="primary" bottom-slots v-model="document.file" label="Choose File" counter class="full-width">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>

            <template v-slot:hint>
              Max 10MB
            </template>
          </q-file>

          <q-btn no-caps unelevated rounded label="Upload Document" color="primary" icon="upload" class="q-mt-md full-width q-px-xl" :disable="uploading || !document.file" :loading="uploading" @click="uploadDocument(document)"/>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { LocalStorage, useQuasar } from 'quasar'
import { getAPI, postAPI } from 'src/services/fetch.service'
import { computed, onMounted, ref } from 'vue'

const $q = useQuasar()

/* USER PROFILE */
const userProfile = computed(() => {
  return LocalStorage.getItem('app_auth_user')
})

/* STATUS */
const badgeStatus = (status) => {
  switch (status) {
    case 'inactive':
    case 0:
      return 'badge-status badge-status--warning'
    case 'active':
    case 1:
      return 'badge-status badge-status--positive'
    case 'banned':
    case 2:
      return 'badge-status badge-status--negative'
    default:
      return 'badge-status badge-status--info'
  }
}

/* DATA */
const loading = ref(true)
const documents = ref([])

const getDocumentList = async () => {
  loading.value = true
  await getAPI('v1/member/document', {
    params: {
      sortBy: 'createdAt',
      sortDirection: 'asc'
    }
  })
    .then((res) => {
      documents.value = res.data.data
    })
    .catch(async (err) => {
      console.log(err)
      $q.notify({
        message: err.data.message ?? 'Something went wrong',
        type: 'negative',
        position: 'top'
      })
    })
    .finally(() => {
      loading.value = false
    })
}

/* LIFECYCLE */
onMounted(() => {
  getDocumentList()
})

/* OPERATION */
const uploading = ref(false)

const uploadDocument = (document) => {
  uploading.value = true

  postAPI('v1/member/document/upload', {
    file: document.file,
    documentUuid: document.uuid
  })
    .then((res) => {
      $q.notify({
        message: 'Document uploaded successfully',
        type: 'positive',
        position: 'top'
      })
      getDocumentList()
    })
    .catch(async (err) => {
      console.log(err)
      $q.notify({
        message: err.data.message ?? 'Something went wrong',
        type: 'negative',
        position: 'top'
      })
    })
    .finally(() => {
      uploading.value = false
    })
}

</script>

<!-- path: src\pages\main\product\components\DialogForm.vue -->
<template>
  <q-dialog :model-value="visible" :persistent="false" @hide="onHide">
    <q-card style="width: 410px">
      <q-card-section>
        <div class="text-h6">{{ editMode ? 'Edit' : 'Add' }} Konstituen</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <div class="q-mb-sm">
            <label for="name" class="text-h5 text-semibold q-mb-sm block"
              >Konstituen name <span class="text-negative">*</span></label
            >
            <q-input
              id="name"
              name="name"
              v-model="state.name"
              placeholder="Enter product name"
              outlined
              lazy-rules
              :rules="[(val) => val.length > 0 || 'Name is required']"
              :error="errState?.name?.length > 0"
              :error-message="errState?.name"
              @update:model-value="errState.name = ''"
              hide-bottom-space
            />
          </div>
          <div class="q-mb-sm">
            <label for="code" class="text-h5 text-semibold q-mb-sm block"
              >Code <span class="text-negative">*</span></label
            >
            <q-input
              id="code"
              name="code"
              v-model="state.code"
              placeholder="Enter product code"
              outlined
              lazy-rules
              :rules="[(val) => val.length > 0 || 'Code is required']"
              :error="errState?.code?.length > 0"
              :error-message="errState?.code"
              @update:model-value="errState.code = ''"
              hide-bottom-space
            />
          </div>
          <div class="q-mb-sm">
            <label for="url" class="text-h5 text-semibold q-mb-sm block"
              >Url <span class="text-negative">*</span></label
            >
            <q-input
              id="url"
              name="url"
              v-model="state.url"
              placeholder="Enter product url"
              outlined
              lazy-rules
              :rules="[(val) => val.length > 0 || 'Url is required']"
              :error="errState?.url?.length > 0"
              :error-message="errState?.url"
              @update:model-value="errState.url = ''"
              hide-bottom-space
            >
              <template #prepend>
                <div style="min-width: 40px" class="flex items-center justify-center cursor-pointer">
                  <span class="text-h6 text-semibold">https://</span>
                </div>
              </template>
          </q-input>
          </div>
          <div class="q-mb-sm">
            <label for="description" class="text-h5 text-semibold q-mb-sm block"
              >Description <span class="text-negative text-small">[optional]</span></label
            >
            <q-input
              id="description"
              name="description"
              autogrow
              v-model="state.description"
              placeholder="Enter product description"
              outlined
              :error="errState?.description?.length > 0"
              :error-message="errState?.description"
              @update:model-value="errState.description = ''"
              hide-bottom-space
            />
          </div>
          <div class="q-mb-sm">
            <label for="url" class="text-h5 text-semibold q-mb-sm block"
              >Commission <span class="text-negative">*</span></label
            >
            <q-input
              id="commission"
              name="commission"
              type="number"
              v-model="state.commission"
              placeholder="Enter product commission"
              outlined
              lazy-rules
              :rules="[(val) => val.length > 0 || 'Commission is required']"
              :error="errState?.commission?.length > 0"
              :error-message="errState?.commission"
              @update:model-value="errState.commission = ''"
              hide-bottom-space
            >
              <template #prepend>
                <div style="min-width: 40px" class="flex items-center justify-center cursor-pointer">
                  <span class="text-h5 text-bold">{{ state.commissionType === 'percentage' ? '%' : 'Rp' }}</span>
                  <ph-icon name="CaretDown" size="10" class="q-ml-sm"/>
                  <q-menu auto-close>
                    <q-list>
                      <q-item clickable @click="state.commissionType = 'percentage'" style="min-height: unset; font-size: 13px">Percentage</q-item>
                      <q-item clickable @click="state.commissionType = 'fixed'" style="min-height: unset; font-size: 13px">Fixed</q-item>
                    </q-list>
                  </q-menu>
                </div>
              </template>
            </q-input>
          </div>
          <div class="row justify-end">
            <q-btn label="Cancel" color="grey-8" outline no-caps class="q-px-lg" @click="onHide" />
            <q-btn label="Submit" color="positive" no-caps type="submit" class="q-ml-md q-px-lg" :disable="loading || submissionDisabled" :loading="loading"/>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { postAPI, putAPI } from 'src/services/fetch.service'
import { mapErrorMessage } from 'src/utils/error'
import { ref, onMounted, watch } from 'vue'

const $props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  editMode: {
    type: Boolean,
    default: false
  },
  editState: {
    type: Object,
    default: () => ({})
  }
})

const $emit = defineEmits(['close', 'submit'])
const $q = useQuasar()

const loading = ref(false)
const submissionDisabled = ref(false)

const state = ref({
  name: '',
  code: '',
  url: '',
  commission: '',
  commissionType: 'percentage',
  description: '',
  imageUrl: ''
})

const errState = ref({
  name: '',
  code: '',
  url: '',
  commission: '',
  commissionType: '',
  description: '',
  imageUrl: ''
})

watch(() => $props.visible, (visible) => {
  onReset()
  if (visible && $props.editMode) {
    state.value = $props.editState
    state.value.commission = state.value.commission.toString()
  }
})

watch(() => state.value.commissionType, (type) => {
  if (type === 'percentage') {
    state.value.commission = state.value.commission > 100 ? 100 : state.value.commission
  }
})

watch(() => state.value.commission, (commission) => {
  if (state.value.commissionType === 'percentage') {
    if (commission > 100) {
      state.value.commission = '100'
      errState.value.commission = 'Commission cannot be more than 100% if commission type is percentage'
    } else {
      state.value.commission = commission
      errState.value.commission = ''
    }
  }
})

watch(() => errState.value.commission, (err) => {
  if (err) {
    submissionDisabled.value = true
  } else {
    submissionDisabled.value = false
  }
})

onMounted(() => {
  if ($props.editMode) {
    state.value = $props.editState
    state.value.commission = state.value.commission.toString()
  }
})

const onSubmit = async () => {
  // console.log(state.value)

  loading.value = true
  if (!$props.editMode) {
    await __createData()
  } else {
    await __updateData()
  }
  loading.value = false
}

const __createData = async () => {
  console.log('create')
  await postAPI('/v1/admin/product', state.value)
    .then((res) => {
      console.log(res)
      $q.notify({
        message: 'Konstituen created successfully',
        type: 'positive',
        position: 'top',
        icon: 'check_circle'
      })

      $emit('close', {
        mode: 'create',
        data: res.data.data
      })
    })
    .catch((err) => {
      console.log(err)
      if (err.status === 422) {
        errState.value = mapErrorMessage(err.data.errors)
      } else {
        errState.value = {
          name: 'Something went wrong'
        }
        $q.notify({
          message: err.data.message || 'Something went wrong',
          type: 'negative',
          position: 'top',
          icon: 'report_problem'
        })
      }
    })
}

const __updateData = async () => {
  console.log('update')
  await putAPI('/v1/admin/product/' + $props.editState.uuid, state.value)
    .then((res) => {
      console.log(res)
      $q.notify({
        message: 'Konstituen updated successfully',
        type: 'positive',
        position: 'top',
        icon: 'check_circle'
      })

      $emit('close', {
        mode: 'create',
        data: res.data.data
      })
    })
    .catch((err) => {
      console.log(err)
      if (err.status === 422) {
        errState.value = mapErrorMessage(err.data.errors)
      } else {
        errState.value = {
          name: 'Something went wrong'
        }
        $q.notify({
          message: err.data.message || 'Something went wrong',
          type: 'negative',
          position: 'top',
          icon: 'report_problem'
        })
      }
    })
}

const onReset = () => {
  state.value = {
    name: '',
    code: '',
    url: '',
    commission: '',
    commissionType: 'percentage',
    description: '',
    imageUrl: ''
  }

  errState.value = {
    name: '',
    code: '',
    url: '',
    commission: '',
    commissionType: '',
    description: '',
    imageUrl: ''
  }
}

const onHide = () => {
  $emit('close', {
    mode: 'hide',
    data: null
  })
}

onMounted(() => {
  console.log('mounted')
})
</script>

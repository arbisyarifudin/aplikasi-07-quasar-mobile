<template>
  <q-dialog v-model="visibleState" @update:model-value="onVisibleUpdate">
    <q-card class="dialog-box" style="width: 410px;">
      <div class="dialog-header">
        <div class="text-h4 text-semibold">{{ title }}</div>
        <q-btn icon="close" flat round dense size="13px" color="grey-6" @click="onCancel" />
      </div>
      <div class="dialog-body">
        <div class="dialog-text" v-if="message && message.length > 0">
          <div class="text-h6" v-html="message"></div>
        </div>
        <div class="q-mt-md">
          <slot name="content"></slot>
         </div>
      </div>
      <div class="dialog-footer">
        <q-btn class="dialog-btn" :label="btnCancelLabel" :color="btnCancelColor" outline no-caps @click="onCancel" />
        <q-btn
          class="dialog-btn"
          :label="btnConfirmLabel"
          :color="btnConfirmColor"
          no-caps
          @click="onConfirm"
          :disable="loading || submissionDisabled"
          :loading="loading"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog {
  &-box {
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  }

  &-header {
    padding: 10px 20px 0 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-body {
    padding: 20px;
  }

  &-text {
    color: #757575;
  }

  &-footer {
    padding: 20px;
    display: flex;
    justify-content: flex-end;
  }

  &-btn {
    margin-left: 15px;
    padding-left: 25px;
    padding-right: 25px;
  }
}

</style>

<script setup>
import { ref, watch } from 'vue'

const $props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Title'
  },
  message: {
    type: String,
    default: 'Message'
  },
  btnCancelLabel: {
    type: String,
    default: 'Cancel'
  },
  btnCancelColor: {
    type: String,
    default: 'grey-8'
  },
  btnConfirmLabel: {
    type: String,
    default: 'Confirm'
  },
  btnConfirmColor: {
    type: String,
    default: 'primary'
  },
  loading: {
    type: Boolean,
    default: false
  },
  submissionDisabled: {
    type: Boolean,
    default: false
  }
})

const visibleState = ref($props.visible)

const $emit = defineEmits(['cancel', 'confirm'])

const onCancel = () => {
  $emit('cancel')
}

const onConfirm = () => {
  $emit('confirm')
}

watch(() => $props.visible, (visible) => {
  visibleState.value = visible
})

const onVisibleUpdate = (visible) => {
  if (!visible) onCancel()
}

</script>

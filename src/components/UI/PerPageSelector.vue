<template>
  <div class="flex items-center">
    <span v-if="$q.screen.gt.md">Show</span>
    <q-btn no-caps unelevated color="grey-3" class="text-grey-8 q-mx-md">
      <div class="flex items-center">
        <span class="q-mr-sm">{{ modelValue }}</span>
        <ph-icon name="CaretDown" size="12"></ph-icon>
      </div>
      <q-menu auto-close fit>
        <q-list>
          <q-item
            v-for="perPage in options"
            :key="perPage"
            :active="perPage === modelValue"
            clickable
            style="min-height: auto"
            @click="selectPerPage(perPage)"
          >
            <q-item-section>{{ perPage }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <span  v-if="$q.screen.gt.md">entries</span>
  </div>
</template>

<script setup>

defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  options: {
    type: Array,
    required: true
  }
})

const $emit = defineEmits(['update:modelValue'])

const selectPerPage = (perPage) => {
  $emit('update:modelValue', perPage)
}

</script>

<template>
  <component :is="iconComponent" v-bind="iconProps" />
</template>

<script setup>
import { computed } from 'vue'
import * as icons from '@phosphor-icons/vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 24
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  weight: {
    type: String,
    default: 'light'
  },
  mirrored: {
    type: Boolean,
    default: false
  }
})

const iconComponent = computed(() => {
  return icons['Ph' + props.name]
})

const iconProps = computed(() => {
  return {
    size: typeof props.size === 'number' ? props.size + 'px' : props.size,
    color: props.color,
    weight: props.weight,
    mirrored: props.mirrored
  }
})

</script>

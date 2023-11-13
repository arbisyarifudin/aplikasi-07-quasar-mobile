<template>
  <q-item
    clickable
    tag="a"
    :to="route"
    :href="link"
    :target="link ? '_blank' : ''"
    @click="onClick"
    class="text-h5 text-medium"
    :class="[color ? `text-${color}` : '']"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <!-- <q-icon :name="icon" /> -->
      <ph-icon v-if="typeof icon === 'object'" v-bind="icon" />
      <ph-icon v-else :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption v-if="caption">{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    default: ''
  },

  link: {
    type: String,
    default: undefined
  },

  route: {
    type: Object,
    default: () => ({})
  },

  icon: {
    type: [String, Object],
    default: undefined
  },

  color: {
    type: String,
    default: undefined
  },

  onClick: {
    type: Function,
    default: () => {}
  }
}
)

</script>

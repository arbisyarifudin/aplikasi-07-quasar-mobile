<template>
  <q-footer class="bottom-menu">
    <q-toolbar class="full-width justify-around">
      <q-btn
        v-for="item in items"
        :key="item.label"
        @click="item.action"
        class="bottom-menu__item"
        no-caps
        :class="{'text-primary': isActive(item.name) }"
      >
      <div class="flex column justify-center items-center">
        <div class="bottom-menu__item-icon">
          <ph-icon class="ph-icon" :name="item.icon" />
        </div>
        <div class="text-caption">{{ item.label }}</div>
      </div>
      </q-btn>
    </q-toolbar>
  </q-footer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const $router = useRouter()

const items = ref([
  {
    label: 'Dashboard',
    name: 'Dashboard Page',
    icon: 'SquaresFour',
    action: () => {
      console.log('Dashboard')
      $router.push({ name: 'Dashboard Page' })
    }
  },
  {
    label: 'Konstituen',
    name: 'Constituent Page',
    icon: 'Users',
    action: () => {
      console.log('Konstituen')
      $router.push({ name: 'Constituent Index Page' })
    }
  },
  {
    label: 'TPS',
    icon: 'MapPinLine',
    name: 'TPS Page',
    action: () => {
      console.log('TPS')
      $router.push({ name: 'TPS Index Page' })
    }
  },
  {
    label: 'Pengaturan',
    name: 'Setting Page',
    icon: 'Gear',
    action: () => {
      console.log('Pengaturan')
      $router.push({ name: 'Setting Index Page' })
    }
  }
])

const isActive = (name) => {
  let routeName = $router.currentRoute.value.name
  const currentActiveName = name

  switch (routeName) {
    case 'Constituent Index Page':
    case 'Constituent Create Page':
    case 'Constituent Edit Page':
      routeName = 'Constituent Page'
      break
    case 'TPS Index Page':
    case 'TPS Create Page':
    case 'TPS Edit Page':
      routeName = 'TPS Page'
      break
    case 'Setting Index Page':
      routeName = 'Setting Page'
      break
  }

  // console.log('routeName', routeName)
  // console.log('currentActiveName', currentActiveName)

  return routeName === currentActiveName
}

</script>

<style lang="scss" scoped>
.bottom-menu {
  background-color: $dark;
  padding: 8px 0;
  .q-toolbar {
    // padding-top: 10px;
    padding: 0;
  }

  &__item {
    &-icon {
      // background-color: $primary;
      // color: $dark;
      // color: $primary;
      // padding: 10px;
      display: flex;
      align-items: center;
      border-radius: 10px;
    }
  }
}
</style>

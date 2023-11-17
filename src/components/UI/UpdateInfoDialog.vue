<template>
  <q-dialog :model-value="show" persistent>
    <q-card style="width: 600px; max-width: 100%;" class="dialog-update">
      <q-card-section class="dialog-update__header">
        <span class="title">Update Aplikasi</span>
      </q-card-section>
      <q-separator />
      <q-card-section class="dialog-update__content">
        <div class="text-caption">
          <span>Versi terbaru telah tersedia. Silahkan update aplikasi untuk mendapatkan fitur terbaru dan/atau perbaikan bug.</span>
        </div>
        <div class="item">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <g clip-path="url(#clip0_15018_36718)">
              <path
                d="M25 28H7C6.73478 28 6.48043 27.8946 6.29289 27.7071C6.10536 27.5196 6 27.2652 6 27V5C6 4.73478 6.10536 4.48043 6.29289 4.29289C6.48043 4.10536 6.73478 4 7 4H19L26 11V27C26 27.2652 25.8946 27.5196 25.7071 27.7071C25.5196 27.8946 25.2652 28 25 28Z"
                :stroke="dark ? 'white' : '#0A0A0A'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M19 4V11H26" :stroke="dark ? 'white' : '#0A0A0A'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 17H20" :stroke="dark ? 'white' : '#0A0A0A'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 21H20" :stroke="dark ? 'white' : '#0A0A0A'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_15018_36718">
                <rect width="32" height="32" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <div class="item__column">
            <span class="subject">Versi</span>
            <span class="object">v{{ updateInfo.version }}</span>
          </div>
        </div>
        <div class="item">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <g clip-path="url(#clip0_15018_36728)">
              <path
                d="M26 5H6C5.44772 5 5 5.44772 5 6V26C5 26.5523 5.44772 27 6 27H26C26.5523 27 27 26.5523 27 26V6C27 5.44772 26.5523 5 26 5Z"
                :stroke="dark ? 'white' : '#0A0A0A'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M22 3V7" :stroke="dark ? 'white' : '#0A0A0A'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 3V7" :stroke="dark ? 'white' : '#0A0A0A'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M5 11H27" :stroke="dark ? 'white' : '#0A0A0A'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_15018_36728">
                <rect width="32" height="32" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <div class="item__column">
            <span class="subject">Tgl. rilis</span>
            <span class="object">{{ formatDate(updateInfo.released_at) }}</span>
          </div>
        </div>
        <div class="item">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <g clip-path="url(#clip0_15018_36738)">
              <path d="M4 22L16 29L28 22" :stroke="dark ? 'white' : '#0A0A0A'" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M4 16L16 23L28 16" :stroke="dark ? 'white' : '#0A0A0A'" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M4 10L16 17L28 10L16 3L4 10Z" :stroke="dark ? 'white' : '#0A0A0A'" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_15018_36738">
                <rect width="32" height="32" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <div class="item__column">
            <span class="subject">Level</span>
            <q-badge v-if="updateInfo.is_mandatory" class="badge__mandatory">Wajib Update</q-badge>
            <q-badge v-else-if="!updateInfo.is_mandatory" class="badge__optional">Tidak Wajib Update</q-badge>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions class="dialog-update__footer">
        <q-btn v-if="!updateInfo.is_mandatory" flat no-caps dense label="Tutup" class="cancel"
          @click="globalStore.setIsUpdateAvailable(false)" />
        <q-btn no-caps dense label="Update" class="update" @click="openUpdateLink" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useGlobalStore } from 'src/stores/global-store'
import { computed } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const dark = true

const globalStore = useGlobalStore()
const updateInfo = computed(() => {
  return globalStore.updateAvailableInfo
})

/* FORMAT DATE */
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}

const openUpdateLink = () => {
  window.open(updateInfo.value.url, '_blank')
}

</script>

<style lang="scss" scoped>
.dialog-update {
  border-radius: 8px;

  &__header {
    display: flex;
    padding: 16px;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    border-bottom: 1px solid #e0e0e0;

    .title {
      color: $positive;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;
    }
  }

  &__content {
    display: flex;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;

    .item {
      display: flex;
      align-items: center;
      gap: 8px;
      align-self: stretch;

      &__column {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        flex: 1 0 0;

        .subject {
          color: #9a9a9a;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 18px;
        }

        .object {
          color: #cccccc;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: 22px;
        }

        .badge {
          &__optional {
            background-color: $grey-7;
            color: $white;
            padding: 5px 16px;
            border-radius: 8px;
          }

          &__mandatory {
            background-color: $negative;
            color: $white;
            padding: 5px 16px;
            border-radius: 8px;
          }
        }
      }
    }
  }

  &__footer {
    display: flex;
    padding: 16px;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;

    .cancel {
      display: flex;
      padding: 0 8px 8px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      flex: 1 0 0;
      align-self: stretch;
      border-radius: 8px;
      background: $dark;
    }

    .update {
      display: flex;
      padding: 0 8px 8px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      flex: 1 0 0;
      align-self: stretch;
      border-radius: 8px;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: 18px;
      background: $positive;
      color: $white;
    }
  }
}</style>

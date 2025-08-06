<template>
  <UNavigationMenu
    variant="pill"
    orientation="horizontal"
    :items
    class="border-default px-4 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:border-b data-[orientation=vertical]:w-48"
  />
</template>

<script setup lang="ts">
import { createClient } from '@/composables/apiUtils'
import { showModal } from '@/composables/modalUtils'
import { useAuth0 } from '@auth0/auth0-vue'
import type { NavigationMenuItem } from '@nuxt/ui'
import { ref } from 'vue'
import ClientModal from '@/components/ClientModal.vue'

const { logout } = useAuth0()

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Add new client',
      icon: 'i-lucide-user-round-plus',
      class: 'cursor-pointer',
      active: true,
      onSelect() {
        const modal = showModal(ClientModal, {
          edit: true,
          onSubmit: async (data) => {
            await createClient(data)
            modal.close()
          },
        })
      },
    },
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      class: 'cursor-pointer',

      onSelect() {
        logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        })
      },
    },
  ],
])
</script>

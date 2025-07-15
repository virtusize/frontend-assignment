<script setup lang="ts">
import { ref } from 'vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'

const isAuthenticated = ref(!!localStorage.getItem('authToken'))
</script>

<!-- TODO: create an auth provider for this part instead to make it more cleaner -->

<template>
  <template v-if="isAuthenticated">
    <DashboardView>
      <router-view />
    </DashboardView>
  </template>
  <template v-else>
    <router-view />
  </template>
</template>

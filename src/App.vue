<template>
  <UApp>
    <UProgress
      v-if="isLoading || !isAuthenticated"
      animation="swing"
    />

    <template v-else>
      <NavHeader />
      <RouterView />
    </template>
  </UApp>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
const { isLoading, isAuthenticated } = useAuth0()
</script>

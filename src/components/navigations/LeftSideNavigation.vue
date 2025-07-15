<template>
  <aside class="sidebar">
    <div class="logo-container">
      <img src="@/assets/images/logo-inverted.svg" alt="Virtusize Logo" class="logo" />
    </div>
    <div class="nav-buttons">
      <LeftSideNavigationButton
        v-for="item in leftNav"
        :key="item.key || item.label"
        :label="item.label"
        :icon="item.icon"
        :route="item.route"
        :active="route.path.startsWith(item.route)"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import LeftSideNavigationButton from '@/components/buttons/LeftSideNavigationButton.vue'

const route = useRoute()

defineProps<{
  leftNav: Array<{
    key?: string | number
    label: string
    icon: object
    route: string
  }>
}>()
</script>

<style scoped>
.sidebar {
  width: 220px;
  background: #001529;
  color: #fff;
  padding: 24px 0;
  min-height: 100vh;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 42px;
}

.logo {
  max-width: 140px;
  height: auto;
}

.nav-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
}
</style>

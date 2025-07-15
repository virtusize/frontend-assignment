<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <LeftSideNavigation :leftNav="leftNav" />
    </aside>
    <div class="main-content">
      <TopBarNavigation />
      <div class="dashboard-container">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import LeftSideNavigation from '@/components/navigations/LeftSideNavigation.vue'
import { PhLightUsersThree, BxHome } from '@kalimahapps/vue-icons'
import TopBarNavigation from '@/components/navigations/TopBarNavigation.vue'

const leftNav = computed(() => {
  return [
    {
      label: 'Home',
      route: '/home',
      icon: h(BxHome),
    },
    {
      label: 'Clients',
      route: '/clients',
      icon: h(PhLightUsersThree),
    },
  ]
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f0f2f5;
}

.sidebar {
  width: 220px;
  background: #001529;
  min-height: 100vh;
  color: #fff;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 21, 41, 0.08);
  z-index: 10;
}

.dashboard-container {
  flex: 1;
  padding: 24px;
  background: #f0f2f5;
}
</style>

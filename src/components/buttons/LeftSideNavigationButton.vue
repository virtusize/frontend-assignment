<template>
  <RouterLink
    :to="route"
    class="nav-button"
    :class="{ active: $route.path === route || $route.path.startsWith(route + '/') }"
    :aria-label="label"
    :tabindex="route ? 0 : -1"
  >
    <span class="icon" v-if="icon">
      <component :is="icon" />
    </span>
    <span class="label">{{ label }}</span>
    <slot />
  </RouterLink>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  icon?: object
  route: string
}>()
</script>

<style scoped>
.nav-button {
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  background: #001529;
  border: none;
  outline: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  font-weight: 500;
  border-radius: 0;
  transition:
    background 0.2s,
    color 0.2s;
  cursor: pointer;
  outline-offset: 0;
  padding-left: 16px;
  text-decoration: none;
}

.nav-button:hover,
.nav-button.active {
  background: #1677ff;
  color: #fff;
}

.nav-button .icon {
  font-size: 18px;
  display: flex;
  align-items: center;
  color: inherit;
  margin-right: 8px;
}

.nav-button .label {
  flex: 1;
  text-align: left;
  color: inherit;
}

.nav-button[aria-disabled='true'] {
  color: #434343;
  cursor: not-allowed;
  background: #001529;
  opacity: 0.5;
}
</style>

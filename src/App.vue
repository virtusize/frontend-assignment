<template>
  <header class="app-title">Client Management System</header>
  <RouterView />
</template>

<style scoped lang="scss">
@use '/src/styles/variables' as vars;

.app-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  background-color: vars.$background-color;
  padding: 2rem 0 1rem;
  margin: 0;
  color: vars.$text-color;
  user-select: none;
}
</style>

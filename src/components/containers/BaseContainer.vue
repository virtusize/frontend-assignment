<template>
  <div class="card-container" :class="{ 'card-bordered': bordered }">
    <div v-if="title" class="card-header">
      <span class="card-title">{{ title }}</span>
      <slot name="extra"></slot>
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  bordered: {
    type: Boolean,
    default: true,
  },
})
</script>

<style scoped>
.card-container {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: box-shadow 0.3s;
  padding: 16px;
  margin: 16px 0;
  border: 1px solid transparent;
}
.card-bordered {
  border: 1px solid #f0f0f0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 500;
  font-size: 16px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}
.card-title {
  color: #262626;
}
.card-body {
  font-size: 14px;
  color: #595959;
}
.card-footer {
  border-top: 1px solid #f0f0f0;
  margin-top: 12px;
  padding-top: 8px;
  text-align: right;
}
</style>

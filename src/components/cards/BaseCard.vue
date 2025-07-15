<template>
  <div :class="cardClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default', // 'default', 'primary', 'success', 'danger', etc.
    validator: (value: string) =>
      ['default', 'primary', 'success', 'danger', 'warning', 'info'].includes(value),
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  shadow: {
    type: Boolean,
    default: false,
  },
})

const cardClass = computed(() => [
  'base-card',
  `base-card--${props.type}`,
  { 'base-card--bordered': props.bordered, 'base-card--shadow': props.shadow },
])
</script>

<style scoped>
.base-card {
  background: #fff;
  border-radius: 6px;
  padding: 24px;
  transition: box-shadow 0.3s;
  border: 1px solid #f0f0f0;
  box-sizing: border-box;
  font-size: 16px;
}

.base-card--bordered {
  border: 1px solid #f0f0f0;
}

.base-card--shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.base-card--default {
  border-color: #f0f0f0;
}

.base-card--primary {
  border-color: #1677ff;
  background: #e6f4ff;
}

.base-card--success {
  border-color: #52c41a;
  background: #f6ffed;
}

.base-card--danger {
  border-color: #ff4d4f;
  background: #fff2f0;
}

.base-card--warning {
  border-color: #faad14;
  background: #fffbe6;
}

.base-card--info {
  border-color: #1890ff;
  background: #e6f7ff;
}
</style>

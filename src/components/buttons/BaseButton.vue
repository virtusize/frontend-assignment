<template>
  <div class="base-btn-wrapper">
    <button
      :class="[
        'ant-btn',
        `ant-btn-${type}`,
        { 'ant-btn-loading': loading, 'ant-btn-disabled': disabled },
      ]"
      :disabled="disabled || loading"
      @click="handleClick"
    >
      <span v-if="loading" class="ant-btn-loading-icon"></span>
      <slot />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'primary', // can be 'primary', 'default', 'success', or 'danger'
    validator: (value: string) => ['primary', 'default', 'success', 'danger'].includes(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const isLoading = computed(() => props.loading)

function handleClick(event: MouseEvent) {
  if (!props.disabled && !isLoading.value) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-btn-wrapper {
  width: 100%;
  margin-bottom: 16px;
}
.ant-btn {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5715;
  white-space: nowrap;
  text-align: center;
  background: #1677ff;
  border: 1px solid #1677ff;
  color: #fff;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  width: 100%;
}

.ant-btn-default {
  background: #fff;
  color: #1677ff;
  border: 1px solid #1677ff;
}

.ant-btn-primary {
  background: #1677ff;
  color: #fff;
  border: 1px solid #1677ff;
}
.ant-btn-primary:hover,
.ant-btn-primary:focus {
  background: #0958d9;
  border-color: #0958d9;
  color: #fff;
}
.ant-btn-primary:active {
  background: #003eb3;
  border-color: #003eb3;
  color: #fff;
}

.ant-btn-success {
  background: #52c41a;
  color: #fff;
  border: 1px solid #52c41a;
}
.ant-btn-success:hover,
.ant-btn-success:focus {
  background: #389e0d;
  border-color: #389e0d;
  color: #fff;
}
.ant-btn-success:active {
  background: #237804;
  border-color: #237804;
  color: #fff;
}

/* Danger button styles */
.ant-btn-danger {
  background: #ff4d4f;
  color: #fff;
  border: 1px solid #ff4d4f;
}
.ant-btn-danger:hover,
.ant-btn-danger:focus {
  background: #cf1322;
  border-color: #cf1322;
  color: #fff;
}
.ant-btn-danger:active {
  background: #a8071a;
  border-color: #a8071a;
  color: #fff;
}

.ant-btn-disabled,
.ant-btn:disabled {
  background: #f5f5f5;
  color: #bfbfbf;
  border: 1px solid #d9d9d9;
  cursor: not-allowed;
}

.ant-btn-loading {
  pointer-events: none;
  opacity: 0.65;
}

.ant-btn-loading-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: 0.5em;
  border: 2px solid #fff;
  border-top: 2px solid #1677ff;
  border-radius: 50%;
  animation: ant-spin 0.8s linear infinite;
  vertical-align: middle;
}

@keyframes ant-spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>

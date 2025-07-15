<template>
  <select class="dropdown-input" v-model="inputValue" :id="id" :required="required">
    <option disabled value="">{{ placeholder }}</option>
    <option v-for="item in items" :key="String(item)" :value="item">
      {{ item }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Email',
  },
  type: {
    type: String,
    default: 'text',
  },
  items: {
    type: Array as () => string[],
    required: true,
  },
  selectedItem: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const inputValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
})
</script>

<style scoped>
.dropdown-input {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
  margin-bottom: 16px;
  width: 100%;
  background: #fff;
  transition: border-color 0.2s;
}
.dropdown-input:focus {
  border-color: #0078d4;
  outline: none;
}
</style>

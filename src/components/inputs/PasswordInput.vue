<template>
  <div class="password-input">
    <span v-if="icon" class="icon">
      <component :is="icon" class="icon-svg" />
    </span>
    <input
      :id="id"
      v-model="inputValue"
      type="password"
      :required="required"
      :placeholder="placeholder"
      :class="{ 'with-icon': icon }"
    />
  </div>
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
  autocomplete: {
    type: String,
    default: 'email',
  },
  placeholder: {
    type: String,
    default: 'Email',
  },
  type: {
    type: String,
    default: 'text',
  },
  icon: {
    type: [Object, Function], // Accepts a component
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const inputValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
})
</script>

<style scoped>
.password-input {
  display: flex;
  align-items: center;
  gap: 8px; /* spacing between icon and input */
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
  margin-bottom: 16px;
  transition: border-color 0.2s;
}

.password-input:focus-within {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
}

.icon {
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-svg {
  width: 20px;
  height: 20px;
}

.password-input input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
}
</style>

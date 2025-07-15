<template>
  <div class="text-input" :class="{ 'label-mode': labelMode }">
    <span v-if="icon" class="icon">
      <component :is="icon" class="icon-svg" />
    </span>
    <template v-if="!labelMode">
      <input
        :id="id"
        v-model="inputValue"
        :type="type"
        :required="required"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
      />
    </template>
    <template v-else>
      <span class="label-text">{{ inputValue }}</span>
    </template>
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
  },
  placeholder: {
    type: String,
  },
  type: {
    type: String,
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  labelMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const inputValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
})
</script>

<style scoped>
.text-input {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
  margin-bottom: 16px;
  transition: border-color 0.2s;
  background-color: #fff;
}

.text-input:focus-within {
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

.text-input input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
}

.label-mode {
  border: none;
  padding: 0;
  box-shadow: none;
  background: transparent;
}

.label-text {
  font-size: 14px;
  color: #333;
  flex: 1;
  padding-left: 2px;
}
</style>

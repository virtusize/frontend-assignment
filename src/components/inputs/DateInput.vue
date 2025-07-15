<template>
  <div
    class="date-input"
    :class="{ 'label-mode': labelMode }"
    @click="showDatePicker = true"
    style="cursor: pointer"
  >
    <span v-if="icon" class="icon">
      <component :is="icon" class="icon-svg" />
    </span>
    <template v-if="!labelMode">
      <input
        v-if="!showDatePicker"
        :id="id"
        v-model="inputValue"
        :type="type"
        :required="required"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        style="background: transparent; cursor: pointer"
      />
      <DatePicker
        v-else
        v-model:value="inputValue"
        valueFormat="YYYY-MM-DD"
        @blur="showDatePicker = false"
        @change="onDateChange"
        style="width: 100%"
        :bordered="false"
        :open="showDatePicker"
        @openChange="onOpenChange"
        :disabledDate="disabledDate"
      />
    </template>
    <template v-else>
      <span class="label-text">{{ inputValue }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { DatePicker } from 'ant-design-vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
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
  blockSucceedingDates: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])
import dayjs from 'dayjs'

const inputValue = ref(props.modelValue || '')

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal || ''
  },
)

const showDatePicker = ref(false)

function onDateChange(date: unknown, dateString: string) {
  emit('update:modelValue', dateString)
  showDatePicker.value = false
}

function onOpenChange(open: boolean) {
  showDatePicker.value = open
}

function disabledDate(current: dayjs.Dayjs) {
  if (!props.blockSucceedingDates) return false
  return current && current > dayjs().endOf('day')
}
</script>

<style scoped>
.date-input {
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

.date-input input {
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

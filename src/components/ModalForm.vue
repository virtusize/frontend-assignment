<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { RecordItem } from '../record';
import { Gender } from '../record';
import apiService from '../apiService';
import currencyCodes from 'currency-codes';

const props = defineProps<{
  records: RecordItem[];
  initialData?: RecordItem | null;
  mode: 'add' | 'view' | 'edit';
}>();

const emit = defineEmits(['close', 'saved']);

// Reactive form state
const form = reactive<RecordItem>({
  id: 0,
  gender: null,
  name: '',
  company: '',
  age: null,
  picture: '',
  registered: '',
  currency: '',
  subscriptionCost: 0,
});

// List of currency options filtered and mapped from currency-codes
const currencyList = currencyCodes.data
  .filter(c => c.code && c.currency)
  .map(c => ({
    code: c.code,
    name: c.currency,
  }));

const currencyError = ref('');

// Validation computed property for enabling/disabling Save button
const isValid = computed(() =>
  form.name.trim() !== '' &&
  form.company.trim() !== '' &&
  form.currency.trim() !== '' &&
  form.subscriptionCost >= 0 &&
  !currencyError.value
);

// Find and normalize currency code from input string (code or currency name)
function findCurrencyCode(input: string): string | null {
  if (!input) return null;

  const byCode = currencyCodes.data.find(c => c.code.toUpperCase() === input.toUpperCase());
  if (byCode) return byCode.code;

  const byName = currencyCodes.data.find(c => c.currency.toLowerCase() === input.toLowerCase());
  if (byName) return byName.code;

  return null;
}

// Parse gender string to Gender enum or null
function parseGender(gender: string | Gender | null | undefined): Gender | null {
  if (!gender) return null;

  if (typeof gender === 'string') {
    const g = gender.toLowerCase();
    if (g === 'male') return Gender.Male;
    if (g === 'female') return Gender.Female;
  }

  return null;
}

// Convert Gender enum to string for API
function genderToString(gender: Gender | null | ''): string | null {
  if (gender === Gender.Male) return 'Male';
  if (gender === Gender.Female) return 'Female';
  return null;
}

// Format date with local timezone offset (used for registered date)
function formatDateWithLocalOffset(date = new Date()): string {
  const pad = (num: number) => String(num).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const tzOffsetMin = date.getTimezoneOffset();
  const tzSign = tzOffsetMin > 0 ? '-' : '+';
  const absOffsetMin = Math.abs(tzOffsetMin);
  const tzHours = pad(Math.floor(absOffsetMin / 60));
  const tzMinutes = pad(absOffsetMin % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds} ${tzSign}${tzHours}:${tzMinutes}`;
}

// Fetch next ID from API, fallback to 0 on error or empty list
async function getNextIdFromAPI(): Promise<number> {
  try {
    const records = await apiService.getRecords();
    if (records.length === 0) return 0;
    return Math.max(...records.map(r => r.id)) + 1;
  } catch (error) {
    console.error('Error fetching records:', error);
    return 0;
  }
}

// Watch for subscriptionCost changes to validate non-negative
watch(() => form.subscriptionCost, newVal => {
  currencyError.value = newVal < 0 ? 'Subscription cost cannot be less than 0.' : '';
});

// Watch for initialData prop changes to populate or reset form
watch(
  () => props.initialData,
  async newVal => {
    if (newVal) {
      // Normalize currency code
      let currencyCode = findCurrencyCode(newVal.currency) || newVal.currency;

      // Format registered date nicely for display (only in view mode)
      let formattedRegistered = '';
      if (newVal.registered) {
        const cleaned = newVal.registered.replace(/\s(?=[+-]\d{2}:?\d{2})/, '');
        const date = new Date(cleaned);
        if (!isNaN(date.getTime())) {
          formattedRegistered = date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
      }

      Object.assign(form, {
        ...newVal,
        registered: formattedRegistered,
        currency: currencyCode,
        gender: parseGender(newVal.gender as string),
        subscriptionCost: Number(newVal.subscriptionCost) || 0,
      });
    } else {
      // Reset form for 'add' mode
      form.id = await getNextIdFromAPI();
      form.gender = null;
      form.name = '';
      form.company = '';
      form.age = null;
      form.picture = 'http://placehold.it/32x32';
      form.registered = '';
      form.currency = '';
      form.subscriptionCost = 0;
    }
  },
  { immediate: true }
);

// Save form data via API (create or update)
async function save() {
  if (props.mode === 'view') return;

  if (form.subscriptionCost === null) {
    form.subscriptionCost = 0;
  }

  const formattedCost = form.subscriptionCost.toFixed(2);
  const genderStr = genderToString(form.gender);
  const registeredStr = formatDateWithLocalOffset(new Date());

  if (props.mode === 'edit') {
    await apiService.updateRecord(form.id, {
      ...form,
      subscriptionCost: formattedCost,
      gender: genderStr,
    });
  } else if (props.mode === 'add') {
    form.id = await getNextIdFromAPI();

    const { id, ...newRecord } = form;
    await apiService.createRecord({
      id: String(form.id),
      ...newRecord,
      subscriptionCost: formattedCost,
      gender: genderStr,
      registered: registeredStr,
    });
  }

  emit('saved');
  emit('close');
}
</script>

<template>
  <div class="modal-overlay">
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <header class="modal-header">
        <h2 id="modalTitle" class="modal-title">
          {{ props.mode === 'add'
            ? 'Create new record'
            : props.mode === 'edit'
            ? 'Edit record'
            : 'View record' }}
        </h2>
        <button
          class="close-btn"
          aria-label="Close modal"
          @click="$emit('close')"
          type="button"
        >
          <font-awesome-icon icon="times" />
        </button>
      </header>

      <form @submit.prevent="save" class="modal-form" novalidate>
        <!-- Profile picture visible only in view mode -->
        <div v-if="props.mode === 'view' && form.picture" class="client-picture">
          <img :src="form.picture" alt="Profile Picture" />
        </div>

        <!-- Name input -->
        <div class="form-group">
          <label for="name">
            Name
            <span v-if="props.mode === 'add' || props.mode === 'edit'">*</span>
          </label>
          <input
            id="name"
            v-model="form.name"
            :readonly="props.mode === 'view'"
            :required="props.mode !== 'view'"
            type="text"
            autocomplete="name"
          />
        </div>

        <!-- Company input -->
        <div class="form-group">
          <label for="company">
            Company
            <span v-if="props.mode === 'add' || props.mode === 'edit'">*</span>
          </label>
          <input
            id="company"
            v-model="form.company"
            :readonly="props.mode === 'view'"
            :required="props.mode !== 'view'"
            type="text"
            autocomplete="organization"
          />
        </div>

        <!-- Subscription Cost input -->
        <div class="form-group">
          <label for="subscription">
            Subscription Cost
            <span v-if="props.mode !== 'view'">*</span>
          </label>

          <input
            v-if="props.mode !== 'view'"
            id="subscription"
            type="number"
            step="0.01"
            v-model.number="form.subscriptionCost"
            required
            min="0"
          />
          <input
            v-else
            id="subscription"
            type="text"
            :value="form.subscriptionCost.toFixed(2)"
            readonly
          />

          <p
            v-if="currencyError && props.mode !== 'view'"
            class="validation-error"
          >
            {{ currencyError }}
          </p>
        </div>

        <!-- Currency select -->
        <div class="form-group">
          <label for="currency">
            Currency
            <span v-if="props.mode === 'add' || props.mode === 'edit'">*</span>
          </label>
          <select
            id="currency"
            v-model="form.currency"
            :disabled="props.mode === 'view'"
            :class="{ 'select-no-arrow': props.mode === 'view' }"
            required
          >
            <option disabled value="" hidden>Select Currency</option>
            <option v-for="c in currencyList" :key="c.code" :value="c.code">
              {{ c.code }} — {{ c.name }}
            </option>
          </select>
        </div>

        <!-- Age input (hidden in view mode if null) -->
        <div class="form-group" v-if="!(props.mode === 'view' && form.age === null)">
          <label for="age">Age</label>
          <input
            id="age"
            type="number"
            v-model.number="form.age"
            :readonly="props.mode === 'view'"
            min="0"
          />
        </div>

        <!-- Gender select (hidden in view mode if null) -->
        <div
          class="form-group"
          v-if="!(props.mode === 'view' && form.gender === null)"
        >
          <label for="gender">Gender</label>
          <select
            id="gender"
            v-model="form.gender"
            :disabled="props.mode === 'view'"
            :class="{ 'select-no-arrow': props.mode === 'view' }"
          >
            <option disabled value="" hidden>Select Gender</option>
            <option :value="Gender.Male">Male</option>
            <option :value="Gender.Female">Female</option>
          </select>
        </div>

        <!-- Registered date (only in view mode) -->
        <div class="form-group" v-if="form.registered && props.mode === 'view'">
          <label>Date Registered</label>
          <input id="registered" type="text" :value="form.registered" readonly />
        </div>

        <!-- Modal footer buttons (not shown in view mode) -->
        <footer class="modal-footer" v-if="props.mode !== 'view'">
          <button
            type="submit"
            class="button btn-primary"
            :disabled="!isValid"
            :aria-disabled="!isValid"
          >
            <font-awesome-icon icon="save" style="margin-right: 2px;" />
            Save
          </button>
          <button
            type="button"
            class="button btn-secondary"
            @click="$emit('close')"
          >
            Cancel
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables' as vars;

.modal-overlay {
  position: fixed;
  inset: 0;
  background: vars.$modal-overlay-bg;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.2s ease-in-out;
  z-index: 999;
  padding: 1rem;
  overflow-y: auto;
}

.modal {
  background: vars.$background-white;
  padding: 2.5rem;
  border-radius: 10px;
  width: 90vw;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.25s ease-in-out;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid vars.$nav-border;
  padding-bottom: 1rem;
}

.modal-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid vars.$nav-border;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: vars.$text-color-dark;
  margin: 0;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.client-picture {
  display: flex;
  justify-content: center;

  img {
    width: 100%;
    max-width: 160px;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    background-color: vars.$background-color;
    text-align: center;
    line-height: 160px;
  }
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: vars.$text-color-dark;
  transition: color 0.3s ease;
  padding: 0;
  margin: 0;

  &:hover {
    color: vars.$primary;
  }

  &:focus {
    outline: 2px solid vars.$primary-darker;
    outline-offset: 2px;
  }
}

.validation-error {
  color: vars.$danger;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 400px) {
  .modal {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .button {
    font-size: 0.9rem;
    padding: 0.4rem 1rem;
    max-width: 100px;
  }
}
</style>

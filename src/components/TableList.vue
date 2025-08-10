<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { RecordItem } from '../record';

// Props and Emits
const props = defineProps<{ items: RecordItem[] }>();
const emit = defineEmits(['view', 'edit', 'delete']);

// State for dropdown menu and delete modal
const openDropdownId = ref<number | null>(null);
const showDeleteModal = ref(false);
const recordToDelete = ref<RecordItem | null>(null);

// Pagination state
const currentPage = ref(1);
const pageSize = 10;

// Computed total pages
const totalPages = computed(() => Math.ceil(props.items.length / pageSize));

// Computed items for current page
const pagedItems = computed(() => {
  const sortedItems = [...props.items].sort((a, b) => b.id - a.id);
  const start = (currentPage.value - 1) * pageSize;
  return sortedItems.slice(start, start + pageSize);
});

// Toggle dropdown open/close
function toggleDropdown(id: number) {
  openDropdownId.value = openDropdownId.value === id ? null : id;
}

// Close dropdown menu
function closeDropdown() {
  openDropdownId.value = null;
}

// Pagination navigation
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    closeDropdown();
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    closeDropdown();
  }
}

// Handle delete action initiation
function onDeleteClick(record: RecordItem) {
  recordToDelete.value = record;
  showDeleteModal.value = true;
  closeDropdown();
}

// Confirm delete and emit event
function confirmDelete() {
  if (recordToDelete.value) {
    emit('delete', recordToDelete.value);
  }
  showDeleteModal.value = false;
  recordToDelete.value = null;
}

// Close dropdown if clicking outside
function onClickOutside(event: MouseEvent) {
  const path = event.composedPath();
  const clickedInsideDropdown = path.some(el => {
    if (!(el instanceof HTMLElement)) return false;
    return el.classList?.contains('dropdown') || el.classList?.contains('action-btn');
  });
  if (!clickedInsideDropdown) {
    openDropdownId.value = null;
  }
}

// Add and remove event listener for outside clicks
onMounted(() => {
  document.addEventListener('click', onClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
});
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>Actions</th>
        <th>Name</th>
        <th>Company</th>
        <th>Subscription Cost</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="record in pagedItems" :key="record.id">
        <td class="actions">
          <div class="dropdown" @click.stop>
            <button class="button btn-primary action-btn" @click="toggleDropdown(record.id)">
              <font-awesome-icon icon="cog" style="margin-right: 1px;" />
              Actions
              <font-awesome-icon icon="chevron-down" style="margin-right: 1px;" />
            </button>
            <ul v-if="openDropdownId === record.id" class="dropdown-menu">
              <li @click="() => { emit('view', record); closeDropdown(); }">View</li>
              <li @click="() => { emit('edit', record); closeDropdown(); }">Edit</li>
              <li @click="onDeleteClick(record)">Delete</li>
            </ul>
          </div>
        </td>
        <td>{{ record.name }}</td>
        <td>{{ record.company }}</td>
        <td>{{ record.subscriptionCost + ' ' + record.currency.toUpperCase() }}</td>
        <td>{{ record.age ?? '-' }}</td>
      </tr>
    </tbody>
  </table>

  <div class="pagination">
    <span class="nav-buttons">
      <button
        class="pagination-button"
        @click="currentPage = 1; closeDropdown()"
        :disabled="currentPage === 1"
        aria-label="First Page"
      >
        <font-awesome-icon icon="angles-left" />
      </button>
      <button
        class="pagination-button"
        @click="prevPage"
        :disabled="currentPage === 1"
        aria-label="Previous Page"
      >
        <font-awesome-icon icon="angle-left" />
      </button>
    </span>

    <span class="page-numbers">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="currentPage = page; closeDropdown()"
        :class="['pagination-button', { active: currentPage === page }]"
        aria-current="page"
      >
        {{ page }}
      </button>
    </span>

    <span class="nav-buttons">
      <button
        class="pagination-button"
        @click="nextPage"
        :disabled="currentPage === totalPages"
        aria-label="Next Page"
      >
        <font-awesome-icon icon="angle-right" />
      </button>
      <button
        class="pagination-button"
        @click="currentPage = totalPages; closeDropdown()"
        :disabled="currentPage === totalPages"
        aria-label="Last Page"
      >
        <font-awesome-icon icon="angles-right" />
      </button>
    </span>
  </div>

  <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="deleteConfirmTitle">
      <h3 id="deleteConfirmTitle" style="margin-bottom: 1rem;">Confirm Delete</h3>
      <p>Are you sure you want to delete <strong>{{ recordToDelete?.name }}</strong>?</p>
      <div class="modal-buttons">
        <button @click="confirmDelete" class="btn-danger">Yes</button>
        <button @click="showDeleteModal = false" class="btn-secondary">No</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables' as vars;

.table {
  margin-bottom: 5rem;

  .actions {
    display: flex;
    gap: 0.5rem;
    position: relative;
  }
}

.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;

  .nav-buttons {
    display: flex;
    gap: 0.1rem;

    .pagination-button {
      background-color: vars.$primary;
      border: 1px solid vars.$primary-dark;
      color: vars.$background-white;
      padding: 0.3rem 0.7rem;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s ease;

      &:disabled {
        background-color: vars.$secondary;
        border-color: vars.$secondary-hover;
        color: vars.$text-color-light;
        cursor: not-allowed;
      }

      &:hover:not(:disabled) {
        background-color: vars.$primary-dark;
      }

      &.active {
        background-color: vars.$primary-darker;
        border-color: vars.$primary-darker;
      }
    }
  }

  .page-numbers {
    display: flex;
    gap: 0.4rem;
    margin: 0 0.6rem;

    .pagination-button {
      background-color: vars.$background-white;
      border: 1px solid vars.$border-color;
      color: vars.$text-color-dark;
      padding: 0.3rem 0.7rem;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s ease, color 0.3s ease;

      &:hover {
        background-color: vars.$dropdown-hover-bg;
      }

      &.active {
        background-color: vars.$primary;
        border-color: vars.$primary-dark;
        color: vars.$background-white;
        cursor: default;
      }
    }
  }
}

.modal-buttons button:not(:last-child) {
  margin-right: 0.5rem;
}
</style>

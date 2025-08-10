<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { RecordItem } from '../record';
import { deleteRecord, getRecords } from '../apiService';
import TableList from '../components/TableList.vue';
import ModalForm from '../components/ModalForm.vue';

const router = useRouter();

// Reactive state to manage records, modal visibility, and modal mode/data
const state = reactive({
  records: [] as RecordItem[],
  showModal: false,
  modalMode: 'view' as 'view' | 'edit' | 'add',
  modalData: null as RecordItem | null
});

// Separate refs for logout modals
const showLogoutModal = ref(false);
const showLogoutConfirmModal = ref(false);

// Fetch all records from API
async function fetchRecords() {
  state.records = await getRecords();
}

// Modal openers for add/view/edit modes
function openAddModal() {
  state.modalData = null;
  state.modalMode = 'add';
  state.showModal = true;
}
function openViewModal(record: RecordItem) {
  state.modalData = { ...record };
  state.modalMode = 'view';
  state.showModal = true;
}
function openEditModal(record: RecordItem) {
  state.modalData = { ...record };
  state.modalMode = 'edit';
  state.showModal = true;
}

// Delete a record and refresh the list
async function handleDelete(record: RecordItem) {
  await deleteRecord(record.id);
  await fetchRecords();
}

// Logout related functions
function logout() {
  localStorage.removeItem('loggedIn');
  router.push('/signin');
}

function onLogoutClick() {
  showLogoutConfirmModal.value = true;
}
function confirmLogout() {
  showLogoutConfirmModal.value = false;
  logout();
}
function cancelLogout() {
  showLogoutConfirmModal.value = false;
}

// Inactivity logout timer setup
const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes
let inactivityTimeout: ReturnType<typeof setTimeout> | null = null;

function resetInactivityTimer() {
  if (inactivityTimeout) clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    showLogoutModal.value = true;
  }, INACTIVITY_LIMIT_MS);
}

const inactivityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

function setupInactivityWatcher() {
  inactivityEvents.forEach((event) => {
    window.addEventListener(event, resetInactivityTimer);
  });
}

function removeInactivityWatcher() {
  inactivityEvents.forEach((event) => {
    window.removeEventListener(event, resetInactivityTimer);
  });
  if (inactivityTimeout) clearTimeout(inactivityTimeout);
}

// Called when inactivity logout modal closes (logs out user)
function onLogoutModalClose() {
  showLogoutModal.value = false;
  logout();
}

// Lifecycle hooks
onMounted(() => {
  fetchRecords();
  resetInactivityTimer();
  setupInactivityWatcher();
});
onBeforeUnmount(() => {
  removeInactivityWatcher();
});
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <div>
        <button class="button primary" @click="openAddModal" style="margin-right: 10px;">
          <font-awesome-icon icon="plus" style="margin-right: 6px;" />
          Create new record
        </button>
        <button class="button logout" @click="onLogoutClick">
          <font-awesome-icon icon="sign-out-alt" style="margin-right: 6px;" />
          Logout
        </button>
      </div>
    </header>

    <section class="dashboard-content">
      <TableList
        :items="state.records"
        @view="openViewModal"
        @edit="openEditModal"
        @delete="handleDelete"
      />
    </section>

    <ModalForm
      v-if="state.showModal"
      :initial-data="state.modalData"
      :mode="state.modalMode"
      :records="state.records"
      @close="state.showModal = false"
      @saved="fetchRecords"
    />

    <!-- Logout Confirmation Modal -->
    <div
      v-if="showLogoutConfirmModal"
      class="modal-overlay"
      @click.self="cancelLogout"
    >
      <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logoutConfirmTitle"
      >
        <h3 id="logoutConfirmTitle" style="margin-bottom: 1rem;">Confirm Logout</h3>
        <p>Are you sure you want to logout?</p>
        <div style="margin-top: 1.5rem;">
          <button @click="confirmLogout" class="btn-danger" style="margin-right: 1rem;">Yes</button>
          <button @click="cancelLogout" class="btn-secondary">No</button>
        </div>
      </div>
    </div>

    <!-- Inactivity Logout Modal -->
    <div
      v-if="showLogoutModal"
      class="modal-overlay"
      @click.self="onLogoutModalClose"
    >
      <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logoutModalTitle"
      >
        <h3
          id="logoutModalTitle"
          style="color:#d93025; margin-bottom: 1rem;"
        >
          Logged Out
        </h3>
        <p>You have been logged out due to inactivity.</p>
        <button @click="onLogoutModalClose" class="modal-close-btn">OK</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables' as vars;

.dashboard {
  background: vars.$background-white;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h1 {
    font-size: 1.5rem;
    color: vars.$text-color;
  }

  > div {
    display: flex;
    align-items: center;
  }
}

.dashboard-header .button.primary {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  background-color: vars.$primary;
  border: 1.5px solid vars.$primary-dark;
  color: vars.$background-white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: vars.$primary-dark;
  }
}

/* Logout button unique styling */
.dashboard-header .button.logout {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  color: vars.$danger;
  background-color: transparent;
  border: 1.5px solid vars.$danger;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: vars.$danger;
    color: vars.$background-white;
  }
}

.dashboard-content {
  overflow-x: auto;
}
</style>

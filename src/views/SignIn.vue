<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Reactive refs for form inputs
const email = ref('');
const password = ref('');

// Router instance for navigation
const router = useRouter();

// Mock user credentials for demo login
const MOCK_USER = {
  email: 'user@example.com',
  password: 'password123',
};

// Controls visibility of the error modal
const showErrorModal = ref(false);

/**
 * Handles the login form submission.
 * Checks credentials against mock user and navigates on success.
 * Shows error modal if credentials are invalid.
 */
function login() {
  if (email.value === MOCK_USER.email && password.value === MOCK_USER.password) {
    localStorage.setItem('loggedIn', 'true');
    router.push('/dashboard');
  } else {
    showErrorModal.value = true;
  }
}

/** Closes the error modal */
function closeModal() {
  showErrorModal.value = false;
}
</script>

<template>
  <div class="signin-container">
    <h2 class="signin-title">Sign In</h2>

    <form @submit.prevent="login" class="signin-form">
      <label for="email">Email:</label>
      <input id="email" v-model="email" type="email" required placeholder="user@example.com" />

      <label for="password">Password:</label>
      <input id="password" v-model="password" type="password" required placeholder="••••••••" />

      <button type="submit" class="signin-button">Login</button>
    </form>

    <!-- Error modal displayed when login fails -->
    <div v-if="showErrorModal" class="modal-overlay" @click.self="closeModal">
      <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <h3 id="modalTitle">Invalid Credentials</h3>
        <p>The email or password you entered is incorrect.</p>
        <button @click="closeModal" class="modal-close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables' as vars;

.signin-container {
  max-width: 320px;
  margin: 3rem auto;
  padding: 2rem;
  border: 1px solid vars.$border-light;
  border-radius: 8px;
  background-color: vars.$background-white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.signin-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: vars.$text-color;
}

.signin-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

label {
  font-weight: 600;
  color: vars.$text-color-dark;
}

input {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid vars.$border-color;
  border-radius: 6px;
  outline-offset: 2px;
  outline-color: vars.$border-color;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

input:focus {
  border-color: vars.$input-focus-color;
  outline-color: vars.$input-focus-color;
  box-shadow: 0 0 6px vars.$input-focus-shadow;
}

.signin-button {
  padding: 0.6rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: vars.$background-white;
  background-color: vars.$primary;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s ease;
  user-select: none;
}

.signin-button:hover {
  background-color: vars.$primary-dark;
}

/* Modal overlay and content */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: vars.$modal-overlay-bg;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
}

.modal-content {
  background: vars.$background-white;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  max-width: 320px;
  width: 100%;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
}

.modal-content h3 {
  margin-bottom: 1rem;
  color: vars.$danger;
  font-weight: 700;
}

.modal-content p {
  margin-bottom: 1.5rem;
  font-size: 1rem;
  color: vars.$text-color;
}

.modal-close-btn {
  padding: 0.5rem 1.25rem;
  background-color: vars.$danger;
  border: none;
  color: vars.$background-white;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;
}

.modal-close-btn:hover {
  background-color: vars.$danger-hover;
}
</style>

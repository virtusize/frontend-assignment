<template>
  <div class="login-view">
    <div class="backdrop-image"></div>
    <div class="login-form">
      <div class="login-form-logo">
        <img
          src="@/assets/images/logo.svg"
          alt="Virtusize Logo"
          width="300"
          height="120"
          style="margin-bottom: 20px"
        />
      </div>
      <form @submit.prevent="onSubmit">
        <TextInput
          id="login-email"
          v-model="email"
          type="email"
          required
          autocomplete="email"
          placeholder="Email"
          :icon="AnOutlinedMail"
        />
        <PasswordInput
          id="login-password"
          v-model="password"
          required
          placeholder="Password"
          :icon="ReLockPasswordLine"
        />
        <div class="login-button-container">
          <BaseButton type="primary" :loading="loading"> Login </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AnOutlinedMail, ReLockPasswordLine } from '@kalimahapps/vue-icons'
import TextInput from '@/components/inputs/TextInput.vue'
import PasswordInput from '@/components/inputs/PasswordInput.vue'
import BaseButton from '@/components/buttons/BaseButton.vue'
import { login } from '@/services/auth/login'
import type { LoginResponse } from '@/services/auth/login'

const email = ref<string>('gmanalili@virtusize.com')
const password = ref<string>('Virtusize2025*')
const loading = ref(false)

const onSubmit = async (): Promise<void> => {
  loading.value = true
  const [response, error]: [LoginResponse | null, Error | null] = await login(
    email.value,
    password.value,
  )
  loading.value = false
  if (error || !response) {
    alert('Invalid email or password')
    return
  }

  // TODO: no refresh token yet since this is just a simulation of the backend
  localStorage.setItem('authToken', response.token)
  localStorage.setItem('email', JSON.stringify(response.email))

  // TODO: somehow hacking needs fixing since App.vue is not yet set properly
  window.location.reload()
}
</script>

<style>
.login-view {
  display: flex;
  flex: 1;
  flex-direction: row;
}

.backdrop-image {
  display: flex;
  flex: 1;
  background-image: url('@/assets/images/login-backdrop.png');
  background-size: cover;
  background-position: center;
}

.login-form {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  border-right: 10px solid black;
}

.login-form-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-form form {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.login-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

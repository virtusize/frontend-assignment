<template>
  <header class="topbar">
    <div>
      <AnOutlinedUser class="welcome-icon" />
      <span class="welcome-label">Welcome, German Manalili</span>
    </div>
    <span class="logout-container">
      <span class="logout-btn" @click="logout()">
        <span class="logout-text">Logout</span>
        <MdLogout class="logout-icon" />
      </span>
    </span>
  </header>
</template>

<script setup lang="ts">
import { MdLogout, AnOutlinedUser } from '@kalimahapps/vue-icons'

async function logout() {
  await Promise.resolve(localStorage.removeItem('authToken'))
  await Promise.resolve(localStorage.removeItem('email'))

  // reroute to base route with full reload
  window.location.href = '/'
}
</script>

<style scoped>
.topbar {
  height: 60px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.welcome-icon {
  margin-right: 8px;
  vertical-align: middle;
}

.logout-container {
  margin-left: auto;
  margin-right: 16px;
  font-size: 16px;
  cursor: pointer;
}

.logout-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;
  padding: 6px 12px;
  border-radius: 6px;
}

.logout-container:hover .logout-text,
.logout-container:hover .logout-icon {
  color: #1677ff;
}

.logout-text {
  vertical-align: middle;
}

.logout-icon {
  margin-left: 8px;
  vertical-align: middle;
}
</style>

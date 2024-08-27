<script setup>
import { RouterView, useRouter } from 'vue-router';
import { routes } from './router';
import { computed } from 'vue';

const router = useRouter();
const goToLoginPage = () => {
  router.push(routes.login.path);  
}

const isClientsPage = computed(() => {
  if(router.currentRoute.value.path === routes.client.home.path) {
    return true;
  }
  return false;
});
</script>

<template>
  <div class="bg-blue-50 cms__container">
    <button v-if="isClientsPage" class="block ml-auto mr-0 bg-gray-700 text-white px-2 py-1 m-1 rounded-sm" @click="goToLoginPage">
      <i class="pi pi-sign-out"></i>
        Log out
    </button>
    <h3 class="text-center p-5">Virtusize CMS</h3>
    <RouterView />
  </div>  
</template>

<style>
  .cms__container {
    height: 100vh;
    width: 100%;
    padding: 15px;
  }
</style>
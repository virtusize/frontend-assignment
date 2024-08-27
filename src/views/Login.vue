<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { routes } from '../router';

  const router = useRouter();
  let username = "";
  let password = "";

  const login = () => {
    if(!username || !password) {
      return;
    } else {
      router.push(routes.client.home.path)
    }
  }
</script>

<template>
  <div class="login__container items-center justify-center bg-white p-6 rounded-lg shadow-md">

    <div class="form__field">
      <label for="username" class="form__label">Username</label>
      <input type="text" id="username" class="form__input" v-model="username">
    </div>

    <div class="form__field">
      <label for="password" class="form__label">Password</label>
      <input type="password" id="password" class="form__input" v-model="password">
    </div>

    <button class="login__button rounded-lg inline-block py-1 bg-blue-400 text-white" @click="login()">
      Log In
    </button>
  </div>
</template>

<style scoped>
  .form__field {
    max-width: 100%;
  }
  .login__button {
    max-width: 95%;
    margin: 16px auto 6px auto;
    ;
  }


</style>
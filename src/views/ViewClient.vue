<script setup>
  import axios from 'axios';
  import { codes } from 'currency-codes';

  import { reactive, ref, onMounted, computed } from 'vue';
  import { routes } from '../router';
  import { useRoute, useRouter, RouterLink } from 'vue-router';
  import { useToast } from 'vue-toastification';

  import Modals from '../components/Modals.vue';
  
  const route = useRoute();
  const router = useRouter();
  const toast = useToast();
  const api = "http://localhost:4090/clients";
  const clientId = route.params.id;
  const currencyCodes = ref(codes());
  const state = reactive({
    client: {},
    form: {},
    isOpen: false,
  })

  const closeModal = async() => {
    state.isModalVisible = false;
    state.form = {};
  }

  const deleteClient = async(id) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to delete this client?")
      if(!isConfirmed) return;
      await axios.delete(`${api}/${id}`)
      router.push(routes.client.home.path);
      toast.success("Client deleted successfully")
    } catch (error) {
      console.error("Error deleting client ", error)
      toast.error("Client was not deleted.")
    }
  }

  const fetchClientDetails = async() => {
    try {
      const response = await axios.get(`${api}/${clientId}`);
      state.client = response.data;
    } catch (error) {
      console.error("Error fetching clients ", error);
    }
  }

  const formattedDate = computed(() => {
    if(!state.client.registered) return;

    const date = new Date((state.client.registered).split(' ').join(''));
    const newDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date); 

    return newDate;
  });

  const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown')) {
      state.isOpen = false;
    }
  };

  document.addEventListener('click', handleClickOutside);

  const toggleDropdown = () => {
    state.isOpen = !state.isOpen;
  }

  const openUpdateModal = async() => {
    state.isModalVisible = true;
    state.form = { ...state.client };
  }

  onMounted(async() => {
    await fetchClientDetails();
  })

</script>

<template>
  <section class="bg-blue-50">
    <div class="container">
      <div class="m-auto py-6 text-xl client__nav">
        <RouterLink to="/clients">
          <i class="icon pi pi-arrow-left text-lg inline"></i>
          <p class="text-lg inline mb-10 pb-2 "> Back to Clients View </p>
        </RouterLink>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md client__container">
        <div class="client__buttons flex justify-end">
          <button class="dropdown" @click="toggleDropdown">
            <i class="pi pi-ellipsis-v text-sm"></i>
          </button>
          <div class="dropdown__content bg-white shadow-md" v-if="state.isOpen">
            <ul>
              <li @click="openUpdateModal"> <i class="pi pi-pencil"></i> Edit </li>
              <li @click="deleteClient(state.client.id)"> <i class="pi pi-trash"></i> Delete </li>
            </ul>
          </div>
        </div>
        <div class="client__image">
          <img :src="state.client.picture" alt="Client Picture">
        </div>
        <div class="client__information">
          <p class="client__label">Name: {{ state.client.name }}</p>
          <p class="client__detail">  </p>

          <p class="client__label">Age: {{ state.client.age }}</p>
          <p class="client__detail">  </p>

          <p class="client__label">Gender: {{ state.client.gender }}</p>
          <p class="client__detail">  </p>

          <p class="client__label">Company: {{ state.client.company }}</p>
          <p class="client__detail">  </p>

          <p class="client__label">Subscription Cost: {{ state.client.subscriptionCost + ' ' + state.client.currency }}</p>
          <p class="client__detail">  </p>

          <p class="client__label">Date of registration: {{ formattedDate }}</p>
          <p class="client__detail">  </p>
        </div>

      </div>
    </div>

    <Modals 
      :show="state.isModalVisible"
      :isEdit="true"
      :clientData="state.form"
      @close="closeModal"
      @submit="fetchClientDetails"
    />
    
  
</section>
</template>

<style>
  

</style>
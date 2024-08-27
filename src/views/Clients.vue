<script setup>
  import axios from 'axios';
  import { codes } from 'currency-codes';
  import { reactive, onMounted, ref, computed } from 'vue';
  import { useRouter, RouterLink } from 'vue-router';
  import { routes, api } from '../router';


  import Modals from '../components/Modals.vue';
  const currencyCodes = ref(codes());
  const router = useRouter();
  const state = reactive({
    clientId: null,
    clientRows: [],
    clients: [],
    currentIndex: 0,
    currentPage: 1,
    isEditMode: false,
    isModalVisible: false,
    form: {},
    nextPage: null,
    previousPage: null,
    rowsPerPage: 10,    
  })

  const closeModal = () => {
    state.isEditMode = false;
    state.isModalVisible = false;
    state.form = {};
  }

  const fetchClients = async() => {
    try {
      const response = await axios.get(api);
      state.clients = response.data;
      setupPagination();
    } catch (error) {
      console.error("Error fetching clients ", error);
    }
  }

  const goToNextPage = () => {
    if(state.currentIndex + state.rowsPerPage < state.clients.length) {
      state.currentIndex += state.rowsPerPage;
      setupPagination();
      state.currentPage += 1;
    }
  }

  const goToPreviousPage = () => {
    if(state.currentIndex > 0) {
      state.currentIndex -= state.rowsPerPage;
      if(state.currentIndex < 0) {
        state.currentIndex = 0;
      }
      setupPagination();
      state.currentPage -= 1;
    }
  }

  const hasNextElement = computed(() => {
    if(state.currentIndex + state.rowsPerPage >= state.clients.length) {
      return false;
    }
    return true;
  });

  const hasPreviousElement = computed(() => {
    if(state.currentIndex === 0) {
      return false;
    }
    return true;
  });


  const openModal = async(id) => {
    if(id) {
      state.isEditMode = true;
      state.clientId = id;

      try {
        const response = await axios.get(`${api}/${id}`)
        state.form = response.data;
      } catch (error) {
        console.error("Error fetching client ", error);
      }

    }
    state.isModalVisible = true;
  }

  const setupPagination = () => {
    if(!state.clients) return;
    state.clientRows = state.clients.slice(state.currentIndex, state.currentIndex + state.rowsPerPage); 
  }

  const updateClient = async() => {
    const updatedClient = {
      ...client
    }

    try {
      await axios.put(`http://localhost:4090/clients/${client.id}`, updatedClient);
      client = {};
    } catch (error) {
      console.error("Error updating client ", error);
    }
  }

  const viewClient = (id) => {
    router.push(`/clients/${id}`);
  }

  onMounted(async() => {
    await fetchClients();
  })
</script>

<template>
  <div class="bg-blue-50 client">
    <div class="container">
      <div class="client__button flex justify-end">
        <button class="client__open-btn bg-emerald-500 px-2 py-1 mb-5 rounded-sm text-white" @click="openModal(null)">
          <i class="pi pi-plus"></i>
          Add Client</button>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md mx-auto my-auto table container">
        <table class="m-auto">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Company</th>
              <th scope="col">Subscription Cost</th>
              <th scope="col">Age</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(client, index) in state.clientRows" :key="index">
              <td>{{ client.name }}</td>
              <td>{{ client.company }}</td>
              <td>{{ client.subscriptionCost +" "+ client.currency }}</td>
              <td>{{ client.age }}</td>
              <td>
                <button class="table__button table__button-view bg-blue-500 text-white" @click="viewClient(client.id)">
                  <i class="pi pi-eye"></i>
                  View</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="table__pagination">
          <button class="table__pagination__button text-xl" @click="goToPreviousPage">
            <i :class="['pi pi-chevron-left ', hasPreviousElement ? 'text-blue-600' : 'text-gray-500']"></i>
          </button>
          <button class="table__pagination__button pb-1 ">{{ state.currentPage }}</button>
          <button :class="['table__pagination__button text-xl ', hasNextElement ? 'disabled' : ''  ]" @click="goToNextPage">
            <i :class="['pi pi-chevron-right ', hasNextElement ? 'text-blue-600' : 'text-gray-500']"></i>
          </button>
        </div>
      </div>
    </div>

    <Modals 
      :show="state.isModalVisible"
      :isEdit="false"
      :clientData="state.form"
      @close="closeModal"
      @submit="fetchClients"
    />

  </div>
</template>

<style>


</style>
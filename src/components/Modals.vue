<script setup>
  import { api } from '../router';
  import axios from 'axios';
  import { codes } from 'currency-codes';
  import { reactive, ref } from 'vue';
  import router from '@/router';
  import { useToast } from 'vue-toastification';

  const currencyCodes = ref(codes());
  const emit = defineEmits(['submit', 'close']);
  const toast = useToast();
  const props = defineProps({
    clientData: Object,
    isEdit: Boolean,
    show: Boolean    
  });

  const state = reactive({
    form: {}
  })

  const closeModal = () => {
    emit('close');
  };
  
  const handleSubmit = async () => {
    if(props.isEdit) {
      const updatedClient = {
        ...props.clientData
      }

      try {
        await axios.put(`${api}/${props.clientData.id}`, updatedClient);
        emit('submit');
        toast.success("Client updated successfully.")
      } catch (error) {
        console.error("Error updating client ", error);
        toast.error("Client was not updated.")
      }
    } else {

      const formattedDate = new Date().toISOString().split('.')[0];
      const timezoneOffset = "-09:00"
      const newClient = {
        ...props.clientData, 
        registered: `${formattedDate} ${timezoneOffset}`
      }
      try {
        const response = await axios.post('http://localhost:4090/clients', newClient)
        router.push(`/clients/${response.data.id}`)
        toast.success("Client added successfully.")
      } catch (error) {
        console.error('Error fetching job ', error);
        toast.error("Client was not added.")
      }
    }
  
    emit('close');
  };

  

  if(props.show && props.isEdit) {
    state.form = props.clientData
  }
  
</script>


<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center">
    <div class="fixed inset-0 bg-black opacity-50" @click="closeModal"></div>
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md z-10">
      
      <div class="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ props.isEdit ? 'Update Client' : 'Add Client'}}</h3>
        <button @click="closeModal" class="text-gray-600 hover:text-gray-900">
          &times;
        </button>
        </div>

        <div class="px-4 py-3">
          <form>
          <div class="form__field">
            <label for="name" class="form__label">Name</label>
            <input type="text" id="name" class="form__input" v-model="props.clientData.name">
          </div>

          <div class="form__field">
            <label for="age" class="form__label">Age</label>
            <input type="number" id="age" class="form__input" v-model="props.clientData.age">
          </div>

          <div class="form__field">
            <label for="gender" class="form__label">Gender</label>
            <select name="gender" id="gender" class="form__input" v-model="props.clientData.gender">
              <option value="null" selected="selected" disabled>Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>

          <div class="form__field">
            <label for="company" class="form__label">Company</label>
            <input type="text" id="company" class="form__input" v-model="props.clientData.company">
          </div>

          <div class="form__field">
            <label for="picture" class="form__label">Picture</label>
            <input type="" id="picture" class="form__input" v-model="props.clientData.picture">
          </div>

          <div class="form__field">
            <label for="subscriptionCost" class="form__label">Subscription Cost</label>
            <input type="number" id="subscriptionCost" class="form__input" v-model="props.clientData.subscriptionCost">
          </div>

          <div class="form__field">
            <label for="currency" class="form__label">Currency</label>
            <select name="currency" id="currency" class="form__input" v-model="props.clientData.currency">
              <option value="null" selected="selected" disabled>Select</option>
              <option v-for="(code, index) in currencyCodes" :key="index" :value="code">{{ code }}</option>
            </select>
          </div>
        </form>
      </div>

      <div class="px-4 py-2 border-t border-gray-200 text-right">

        <button class="form__button bg-blue-500" @click="handleSubmit"> {{ props.isEdit ? 'Update Client' : 'Add Client' }}</button>
      </div>
    </div>
  </div>


</template>


<style>

</style>
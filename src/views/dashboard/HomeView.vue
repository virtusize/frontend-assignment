<template>
  <div class="card-container">
    <Card title="Clients">
      <div class="card-content">
        <div class="clients-count">
          <PhLightUsersThree class="card-icon" style="color: black" />
          {{ clients.length }}
        </div>
        <div class="card-info">Active clients this month</div>
        <div class="card-extra">Up 10% from last month</div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/cards/BaseCard.vue'
import { PhLightUsersThree } from '@kalimahapps/vue-icons'
import { onMounted } from 'vue'
import { getClients, type GetClientsResponse } from '@/services/clients/getClients'

const clients = ref<GetClientsResponse[]>([])

onMounted(async () => {
  const [clientList, error] = await getClients()
  if (error || !clientList) {
    clients.value = []
  } else {
    clients.value = clientList
  }
})
</script>

<style scoped>
.card-container {
  display: flex;
  gap: 16px;
}
.card-icon {
  font-size: 2rem;
  color: #4f8cff;
}
.card-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.clients-count {
  font-size: 2rem;
  font-weight: bold;
}
.card-info {
  color: #666;
  margin-top: 4px;
}
.card-extra {
  color: #27ae60;
  font-size: 0.9rem;
  margin-top: 2px;
}
</style>

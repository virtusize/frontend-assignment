<template>
  <div class="add-button-container">
    <Button type="primary" @click="router.push('/clients/add')">
      <UserAddOutlined />
      Add
    </Button>
  </div>
  <Table
    :columns="columns"
    :data-source="dataSource"
    rowKey="key"
    :pagination="{ pageSize: 10 }"
    :scroll="{ y: 'calc(100vh - 200px)' }"
    :loading="isLoading"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { Table, Button, Modal } from 'ant-design-vue'
import { EyeOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons-vue'
import { getClients } from '@/services/clients/getClients'

const router = useRouter()

const dataSource = ref<ClientTableRow[]>([])
const isLoading = ref(false)

const columns = ref([
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
  },
  {
    title: 'Subscription Cost',
    dataIndex: 'subscriptionCostAndCurrency',
    key: 'subscriptionCostAndCurrency',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right' as const,
    width: 120,
    customRender: ({ record }: { record: ClientTableRow }) =>
      h('div', { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' } }, [
        h(
          Button,
          {
            type: 'link',
            size: 'small',
            onClick: () => router.push(`/clients/${record.id}/edit`),
          },
          {
            icon: () => h(EyeOutlined),
            default: () => 'View',
          },
        ),
        h(
          Button,
          {
            type: 'link',
            size: 'small',
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: 'Are you sure you want to delete this client?',
                content: 'This action cannot be undone.',
                okText: 'Yes',
                cancelText: 'No',
                onOk: async () => {
                  const { deleteClient } = await import('@/services/clients/deleteClient')
                  try {
                    await deleteClient(String(record.id))
                    Modal.success({
                      title: 'Client deleted',
                      content: 'The client has been successfully deleted.',
                    })

                    dataSource.value = dataSource.value.filter((item) => item.id !== record.id)
                  } catch {
                    Modal.error({
                      title: 'Failed to delete client',
                      content: 'An error occurred while deleting the client. Please try again.',
                    })
                  }
                },
              })
            },
          },
          {
            icon: () => h(DeleteOutlined),
            default: () => 'Delete',
          },
        ),
      ]),
  },
])

interface ClientTableRow {
  key: string | number
  id: string | number
  name: string
  company: string
  subscriptionCostAndCurrency: string
  age: number
}

onMounted(async () => {
  isLoading.value = true
  const [clients, error] = await getClients()
  if (error) {
    dataSource.value = []
    isLoading.value = false
    return
  }
  if (Array.isArray(clients)) {
    dataSource.value = clients.map((client, index) => ({
      key: index,
      id: client.id,
      name: client.name,
      company: client.company,
      subscriptionCostAndCurrency: `${client.subscriptionCost} ${client.currency}`,
      age: Number(client.age),
    }))
  } else {
    dataSource.value = []
  }
  isLoading.value = false
})
</script>

<style scoped>
.add-button-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 16px;
  gap: 8px;
}
</style>

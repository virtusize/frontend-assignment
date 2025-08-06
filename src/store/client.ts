import { defineStore, storeToRefs } from 'pinia'
import { usePaginationStore } from '@/store/pagination'
import { computed, ref } from 'vue'
import { useFetch, watchOnce } from '@vueuse/core'
import { deleteAndShift } from '@/composables/objectUtils'

export const useClientStore = defineStore('client', () => {
  const paginationStore = usePaginationStore()
  const { getCurrentPage, getPaginatedApiUrl, getCurrentPageSize } = storeToRefs(paginationStore)

  const clients = ref<Record<number, Client[]>>({})
  const totalClients = ref<number>(getCurrentPage.value)
  const fetching = ref<boolean>(false)

  const isFetching = computed(() => fetching.value)

  const getClientsByCurrentPage = computed((): Client[] =>
    clients.value[getCurrentPage.value] ?? [],
  )
  const getClientsLength = computed(() => totalClients.value)
  const getAllClients = computed((): Client[] => Object.values(clients.value).flat())

  const fetchClientById = (id: string) => getAllClients.value.find(client => client.id === id)
  const fetchClientsByPage = (page = 1) => {
    if (clients.value[page]?.length === getCurrentPageSize.value) return // cache hit

    const apiUrl = getPaginatedApiUrl.value

    fetching.value = true
    const { data, onFetchResponse } = useFetch(apiUrl).get().json<Client[]>()
    onFetchResponse((response) => {
      fetching.value = false
      totalClients.value = Number(response.headers.get('X-Total-Count'))

      const totalPages = Math.ceil(totalClients.value / getCurrentPageSize.value)
      for (let p = 1; p <= totalPages; p++) {
        // Assign an empty array to each page number (key) if it does not exist.
        clients.value[p] = clients.value[p] || []
      }
    })

    watchOnce(data, (payload) => {
      if (payload) {
        clients.value[page] = payload
      }
    })
  }

  function addClients(payload: Client[]) {
    const existingIds = new Set(getAllClients.value.map(client => client.id))
    const pages = Object.keys(clients.value).map(Number).sort((a, b) => a - b)
    const lastPage = pages[pages.length - 1]

    for (const client of payload) {
      if (!existingIds.has(client.id)) {
        existingIds.add(client.id)

        // Eagerly check if the last page is not yet full, else create a new page to append the new client
        if (getClientsLength.value % getCurrentPageSize.value !== 0) {
          clients.value[lastPage].push(client)
        }
        else {
          clients.value[lastPage + 1] = [client]
        }

        totalClients.value = totalClients.value + 1
      }
    }
  }

  function updateClientById(payload: Client) {
    for (const [key, value] of Object.entries(clients.value)) {
      const index = value.findIndex(client => client.id === payload.id)
      if (index === -1) continue

      const record = clients.value[Number(key)][index]
      Object.assign(record, payload)
    }
  }

  function deleteClientById(id: string) {
    for (const [key, value] of Object.entries(clients.value)) {
      const index = value.findIndex(client => client.id === id)
      if (index === -1) continue

      deleteAndShift(clients.value, Number(key), index)
      totalClients.value = totalClients.value - 1
    }

    if (getClientsByCurrentPage.value.length === 0) {
      if (getCurrentPage.value > 1)
        paginationStore.previous()
      else
        paginationStore.next()
    }
    else if (getClientsByCurrentPage.value.length !== getCurrentPageSize.value) {
      fetchClientsByPage(getCurrentPage.value)
    }
  }

  return { isFetching, getClientsByCurrentPage, getAllClients, getClientsLength, fetchClientById, fetchClientsByPage, addClients, updateClientById, deleteClientById }
})

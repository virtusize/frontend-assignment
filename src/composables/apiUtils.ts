import type { ClientSchema } from '@/components/ClientModal.vue'
import { useFetch } from '@vueuse/core'
import { useClientStore } from '@/store/client'
import { toIsoWithOffset } from '@/composables/timeUtils'
import type { ConfirmationSchema } from '@/components/ConfirmationModal.vue'

interface HandleResponse<T> {
  fetch: Awaited<ReturnType<typeof useFetch<T>>>
  onSuccess?: (response: T) => void
  onError?: () => void
}

function handleResponse(
  type: 'create' | 'update' | 'delete',
  props: HandleResponse<Client>,
) {
  const { fetch, onSuccess, onError } = props
  const { data, error } = fetch

  const toast = useToast()
  const errorDescription = {
    create: `Failed to create client information.`,
    update: `Failed to update client information.`,
    delete: `Failed to delete client information.`,
  }
  const successDescription = {
    create: `Client information has been created.`,
    update: `Client information has been updated.`,
    delete: `Client information has been deleted.`,
  }

  if (error.value) {
    onError?.()
    toast.add({ title: 'Error!', description: errorDescription[type], color: 'error' })
  }
  else if (data.value) {
    onSuccess?.(data.value)
    toast.add({ title: 'Success!', description: successDescription[type], color: 'success' })
  }

  return fetch
}

export function useApiUrl() {
  return new URL(`${import.meta.env.VITE_JSON_SERVER_ORIGIN}:${import.meta.env.VITE_JSON_SERVER_PORT}${import.meta.env.VITE_JSON_SERVER_ENDPOINT}`)
}

export async function updateClient({ subscriptionCost, ...payload }: ClientSchema) {
  const apiUrl = useApiUrl().toString() + `/${payload.id}`
  const clientStore = useClientStore()

  const body = { ...payload, subscriptionCost: subscriptionCost.toFixed(2) }
  const fetch = await useFetch<Client>(apiUrl).patch(body).json<Client>()

  return handleResponse('update', {
    fetch,
    onSuccess(response) {
      clientStore.updateClientById(response)
    },
  })
}

export async function createClient({ id, ...payload }: ClientSchema) {
  const apiUrl = useApiUrl().toString()
  const clientStore = useClientStore()

  const body = { ...payload, registered: toIsoWithOffset() }
  const fetch = await useFetch<Client>(apiUrl).post(body).json<Client>()

  return handleResponse('create', {
    fetch,
    onSuccess(response) {
      clientStore.addClients([response])
    },
  })
}

export async function deleteClient(payload: ConfirmationSchema) {
  const apiUrl = useApiUrl().toString() + `/${payload.id}`
  const clientStore = useClientStore()

  const fetch = await useFetch<Client>(apiUrl).delete().json<Client>()

  return handleResponse('delete', {
    fetch,
    onSuccess() {
      clientStore.deleteClientById(payload.id)
    },
  })
}

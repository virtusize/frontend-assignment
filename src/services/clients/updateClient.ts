import axios from 'axios'

export interface UpdateClientRequest {
  id: string
  gender?: string
  name?: string
  company?: string
  age?: number
  picture?: string
  registered?: string
  currency?: string
  subscriptionCost?: string
}

export interface UpdateClientResponse {
  success: boolean
  message?: string
}

export async function updateClient(
  id: string,
  data: Partial<UpdateClientRequest>,
): Promise<[UpdateClientResponse | null, Error | null]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL
    const response = await axios.put<UpdateClientResponse>(`${apiUrl}/clients/${id}`, data)
    return [response.data, null]
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return [null, new Error(error.message)]
    }
    return [null, error instanceof Error ? error : new Error('Unknown error')]
  }
}

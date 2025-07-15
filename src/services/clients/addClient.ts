import axios from 'axios'

export interface AddClientRequest {
  gender?: string
  name?: string
  company?: string
  age?: number
  picture?: string
  registered?: string
  currency?: string
  subscriptionCost?: string
}

export interface AddClientResponse {
  success: boolean
  message?: string
  id?: string
}

export async function addClient(
  data: AddClientRequest,
): Promise<[AddClientResponse | null, Error | null]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL
    const response = await axios.post<AddClientResponse>(`${apiUrl}/clients`, data)
    return [response.data, null]
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return [null, new Error(error.message)]
    }
    return [null, error instanceof Error ? error : new Error('Unknown error')]
  }
}

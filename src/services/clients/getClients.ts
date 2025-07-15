import axios from 'axios'

export interface GetClientsResponse {
  id: string
  gender: string
  name: string
  company: string
  age: number
  picture: string
  registered: string
  currency: string
  subscriptionCost: string
}

export async function getClients(): Promise<[GetClientsResponse[] | null, Error | null]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL
    const response = await axios.get<GetClientsResponse[]>(`${apiUrl}/clients`)

    const clients = response.data

    return [clients, null]
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return [null, new Error(error.message)]
    }
    return [null, error instanceof Error ? error : new Error('Unknown error')]
  }
}

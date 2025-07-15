import axios from 'axios'

export interface GetClientResponse {
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

export async function getClient(id: string): Promise<[GetClientResponse | null, Error | null]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL
    const response = await axios.get<GetClientResponse[]>(`${apiUrl}/clients?id=${id}`)

    const client = response.data[0]

    return [client, null]
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return [null, new Error(error.message)]
    }
    return [null, error instanceof Error ? error : new Error('Unknown error')]
  }
}

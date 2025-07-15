import axios from 'axios'

export interface DeleteClientResponse {
  success: boolean
  message?: string
  id?: string
}

export async function deleteClient(
  clientId: string,
): Promise<[DeleteClientResponse | null, Error | null]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL
    const response = await axios.delete<DeleteClientResponse>(`${apiUrl}/clients/${clientId}`)
    return [response.data, null]
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return [null, new Error(error.message)]
    }
    return [null, error instanceof Error ? error : new Error('Unknown error')]
  }
}

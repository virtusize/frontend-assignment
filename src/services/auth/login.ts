import axios from 'axios'

export interface LoginResponse {
  id: string
  email: string
  password: string
  token: string
  created_at: string
  updated_at: string
}

export async function login(
  email: string,
  password: string,
): Promise<[LoginResponse | null, Error | null]> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL
    const response = await axios.get<LoginResponse[]>(`${apiUrl}/users`, {
      params: { email, password },
    })

    const user = response.data[0]
    if (!user) {
      return [null, new Error('Invalid credentials')]
    }
    return [
      {
        ...user,
      },
      null,
    ]
  } catch (error: unknown) {
    return [null, error as Error]
  }
}

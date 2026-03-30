import { api } from '@shared/api/client'

export type LoginDto = {
  username: string
  password: string
}

export const authApi = {
  login: async ({ username, password }: LoginDto) => {
    const res = await api.post('/auth/login', {
      username,
      password,
      expiresInMins: 60,
    })

    return res.data as {
      accessToken: string
      refreshToken: string
    }
  },
}

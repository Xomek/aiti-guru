import { useEffect, useState } from 'react'

import axios from 'axios'

import { api } from '@shared/api/client'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

const readTokens = () => {
  const localAccess = localStorage.getItem(ACCESS_TOKEN_KEY)
  const sessionAccess = sessionStorage.getItem(ACCESS_TOKEN_KEY)

  const localRefresh = localStorage.getItem(REFRESH_TOKEN_KEY)
  const sessionRefresh = sessionStorage.getItem(REFRESH_TOKEN_KEY)

  return {
    accessToken: localAccess ?? sessionAccess,
    refreshToken: localRefresh ?? sessionRefresh,
  }
}

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => readTokens().accessToken,
  )
  const [isAuth, setIsAuth] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const clearAuth = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
    setAccessToken(null)
    setIsAuth(false)
  }

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ACCESS_TOKEN_KEY || e.key === REFRESH_TOKEN_KEY) {
        const { accessToken: nextToken } = readTokens()
        setAccessToken(nextToken)
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    let cancelled = false

    const verify = async () => {
      if (!accessToken) {
        setIsAuth(false)
        setIsReady(true)
        return
      }

      try {
        await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        if (cancelled) return
        setIsAuth(true)
        setIsReady(true)
      } catch (e) {
        if (cancelled) return

        if (axios.isAxiosError(e)) {
          const status = e.response?.status
          if (status === 401 || status === 403) {
            clearAuth()
            setIsReady(true)
            return
          }
        }

        // Любая другая ошибка проверки - считаем, что токен невалидный.
        clearAuth()
        setIsReady(true)
      }
    }

    void verify()

    return () => {
      cancelled = true
    }
  }, [accessToken])

  return { isAuth, accessToken, isReady, clearAuth }
}

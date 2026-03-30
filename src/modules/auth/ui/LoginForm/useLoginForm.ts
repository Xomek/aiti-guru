import { useState } from 'react'

import axios from 'axios'

import { authApi } from '../../api'
import { loginSchema } from './loginSchema'

type FieldErrors = {
  username?: string
  password?: string
}

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

const storeTokens = (params: {
  accessToken: string
  refreshToken: string
  remember: boolean
}) => {
  const { accessToken, refreshToken, remember } = params
  const storage = remember ? localStorage : sessionStorage
  const other = remember ? sessionStorage : localStorage

  storage.setItem(ACCESS_TOKEN_KEY, accessToken)
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken)

  other.removeItem(ACCESS_TOKEN_KEY)
  other.removeItem(REFRESH_TOKEN_KEY)
}

export const useLoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [errors, setErrors] = useState<FieldErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const result = loginSchema.safeParse({ username, password })
    if (result.success) return { ok: true as const }

    const next: FieldErrors = {}
    for (const issue of result.error.issues) {
      const pathKey = issue.path[0]
      if (pathKey === 'username' || pathKey === 'password') {
        next[pathKey] = issue.message
      }
    }
    setErrors(next)
    setApiError(null)
    return { ok: false as const }
  }

  const onSubmit = async () => {
    if (isLoading) return false

    setErrors({})
    setApiError(null)

    const valid = validate()
    if (!valid.ok) return false

    setIsLoading(true)
    try {
      const tokens = await authApi.login({ username, password })
      storeTokens({ ...tokens, remember })
      return true
    } catch (e) {
      const axiosErr = axios.isAxiosError(e) ? e : null
      const respData = axiosErr?.response?.data
      const maybeMessage =
        respData && typeof respData === 'object' && 'message' in respData
          ? (respData as Record<string, unknown>).message
          : undefined
      const message =
        typeof maybeMessage === 'string'
          ? maybeMessage
          : axiosErr?.message
            ? String(axiosErr.message)
            : 'Ошибка входа'

      setErrors((prev) => ({
        ...prev,
        password: message,
      }))
      setApiError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    remember,
    setRemember,
    showPassword,
    setShowPassword,
    errors,
    apiError,
    isLoading,
    onSubmit,
  }
}

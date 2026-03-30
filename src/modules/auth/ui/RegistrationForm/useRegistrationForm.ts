import { useState } from 'react'

import axios from 'axios'

import { authApi } from '../../api'
import { registrationSchema } from './registrationSchema'

type FieldErrors = {
  username?: string
  password?: string
}

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

const storeTokensToSession = (params: {
  accessToken: string
  refreshToken: string
}) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, params.accessToken)
  sessionStorage.setItem(REFRESH_TOKEN_KEY, params.refreshToken)
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const useRegistrationForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [errors, setErrors] = useState<FieldErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const result = registrationSchema.safeParse({ username, password })
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
      storeTokensToSession(tokens)
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
            : 'Ошибка регистрации'

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
    showPassword,
    setShowPassword,
    errors,
    apiError,
    isLoading,
    onSubmit,
  }
}

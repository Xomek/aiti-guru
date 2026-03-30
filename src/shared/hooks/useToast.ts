import { useState } from 'react'

interface Toast {
  id: number
  message: string
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (message: string) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return {
    toasts,
    pushToast,
  }
}

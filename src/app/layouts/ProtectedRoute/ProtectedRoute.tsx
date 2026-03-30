import { Navigate, Outlet } from 'react-router'

import { useAuth } from '@shared/hooks/useAuth'
import { ROUTES } from '@shared/routing'

export const ProtectedRoute = () => {
  const { isAuth, isReady } = useAuth()

  if (!isReady) return null

  if (!isAuth) return <Navigate to={ROUTES.LOGIN} />

  return <Outlet />
}

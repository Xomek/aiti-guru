import { createBrowserRouter } from 'react-router'

import { LoginPage } from '@pages/LoginPage'
import { NotFoundPage } from '@pages/NotFoundPage'
import { ProductsPage } from '@pages/ProductsPage'
import { RegistrationPage } from '@pages/RegistrationPage'

import { ROUTES } from '@shared/routing'

import { AuthLayout } from './layouts/AuthLayout'
import { ProtectedRoute } from './layouts/ProtectedRoute'

export const router = createBrowserRouter([
  {
    Component: AuthLayout,
    children: [
      { path: ROUTES.LOGIN, Component: LoginPage },
      { path: ROUTES.REGISTER, Component: RegistrationPage },
    ],
  },

  {
    path: ROUTES.PRODUCTS,
    Component: ProtectedRoute,
    children: [{ index: true, Component: ProductsPage }],
  },

  {
    path: '*',
    Component: NotFoundPage,
  },
])

import { createBrowserRouter } from 'react-router'

import { LoginPage } from '@pages/LoginPage'
import { NotFoundPage } from '@pages/NotFoundPage'
import { ProductsPage } from '@pages/ProductsPage'
import { RegistrationPage } from '@pages/RegistrationPage'

import { ROUTES } from '@shared/routing'

export const router = createBrowserRouter([
  {
    path: ROUTES.PRODUCTS,
    Component: ProductsPage,
  },

  { path: ROUTES.LOGIN, Component: LoginPage },
  { path: ROUTES.REGISTER, Component: RegistrationPage },

  {
    path: '*',
    Component: NotFoundPage,
  },
])

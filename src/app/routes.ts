import { createBrowserRouter } from 'react-router'

import { MainPage } from '@pages/MainPage'

import { ROUTES } from '@shared/routing'

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    Component: MainPage,
  },
])

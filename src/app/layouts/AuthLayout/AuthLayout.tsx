import { Outlet } from 'react-router'

import styles from './AuthLayout.module.css'

export const AuthLayout = () => {
  return (
    <div className={styles.page}>
      <Outlet />
    </div>
  )
}

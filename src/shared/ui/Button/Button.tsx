import clsx from 'clsx'

import styles from './Button.module.css'

export const Button = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={clsx(styles.button, className)} {...props}>
      {children}
    </button>
  )
}

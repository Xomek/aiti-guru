import clsx from 'clsx'

import style from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = ({ className, error, ...props }: InputProps) => {
  return (
    <input
      className={clsx(style.input, className, { [style.error]: error })}
      {...props}
    />
  )
}

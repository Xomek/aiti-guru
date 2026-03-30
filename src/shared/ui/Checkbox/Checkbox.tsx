import clsx from 'clsx'

import styles from './Checkbox.module.css'

interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
}

export const Checkbox = ({
  checked = false,
  onChange,
  className,
}: CheckboxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked)
  }

  return (
    <label className={clsx(styles.checkbox, className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={styles.input}
      />
      <span className={styles.customCheckbox} />
    </label>
  )
}

import styles from './Checkbox.module.css'

interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export const Checkbox = ({ checked = false, onChange }: CheckboxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked)
  }

  return (
    <div className={styles.checkbox}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={styles.input}
      />
      <span className={styles.customCheckbox} />
    </div>
  )
}

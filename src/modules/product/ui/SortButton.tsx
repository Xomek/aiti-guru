import clsx from 'clsx'

import styles from './SortButton.module.css'

type SortOrder = 'asc' | 'desc'

interface SortButtonProps {
  label: string
  active: boolean
  order: SortOrder
  onClick: () => void
}

export const SortButton = ({
  label,
  active,
  order,
  onClick,
}: SortButtonProps) => {
  const sortArrow = order === 'asc' ? styles.sortArrowAsc : styles.sortArrowDesc

  return (
    <button
      type="button"
      className={clsx(styles.sortButton, active && styles.sortActive)}
      onClick={onClick}
    >
      {label}
      {active && <span className={clsx(styles.sortArrow, sortArrow)} />}
    </button>
  )
}

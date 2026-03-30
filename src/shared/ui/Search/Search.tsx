import SearchIcon from '@shared/assets/icons/search.svg?react'

import styles from './Search.module.css'

interface SearchProps {
  value?: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

export const Search = ({
  value,
  onChange,
  placeholder = 'Поиск',
}: SearchProps) => {
  return (
    <div className={styles.search}>
      <SearchIcon />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

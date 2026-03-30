import { useMemo } from 'react'

import clsx from 'clsx'

import styles from './Pagination.module.css'

interface PaginationProps {
  page: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

export const Pagination = ({
  page,
  total,
  pageSize,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const shownFrom = total === 0 ? 0 : page * pageSize + 1
  const shownTo = total === 0 ? 0 : Math.min((page + 1) * pageSize, total)

  const visiblePageNumbers = useMemo(() => {
    const maxButtons = 5
    const half = Math.floor(maxButtons / 2)
    let start = Math.max(0, page - half)
    const end = Math.min(totalPages - 1, start + maxButtons - 1)
    start = Math.max(0, end - maxButtons + 1)

    const nums: number[] = []
    for (let i = start; i <= end; i++) nums.push(i)
    return nums
  }, [page, totalPages])

  return (
    <div className={styles.pagination}>
      <div className={styles.paginationInfo}>
        Показано {shownFrom}-{shownTo} из {total}
      </div>

      <div className={styles.paginationControls}>
        <button
          type="button"
          className={clsx(styles.pageBtn, page === 0 && styles.pageBtnDisabled)}
          onClick={() => page > 0 && onPageChange(page - 1)}
          disabled={page === 0}
        >
          {'<'}
        </button>

        {visiblePageNumbers.map((n) => (
          <button
            key={n}
            type="button"
            className={clsx(styles.pageBtn, n === page && styles.pageBtnActive)}
            onClick={() => onPageChange(n)}
          >
            {n + 1}
          </button>
        ))}

        <button
          type="button"
          className={clsx(
            styles.pageBtn,
            page >= totalPages - 1 && styles.pageBtnDisabled,
          )}
          onClick={() => page < totalPages - 1 && onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
        >
          {'>'}
        </button>
      </div>
    </div>
  )
}

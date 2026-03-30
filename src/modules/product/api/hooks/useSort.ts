import { useEffect } from 'react'

import { useProductStore } from '@modules/product/store/productStore'

import { SortKey, SortOrder } from './useProducts'

const SORT_STORAGE_KEY = 'products_sort'

export const useSort = () => {
  const { sortKey, sortOrder, setSortKey, setSortOrder } = useProductStore()

  const setSortAndPersist = (nextKey: SortKey, nextOrder?: SortOrder) => {
    const finalOrder = nextOrder ?? sortOrder
    setSortKey(nextKey)
    setSortOrder(finalOrder)
    localStorage.setItem(
      SORT_STORAGE_KEY,
      JSON.stringify({ sortKey: nextKey, sortOrder: finalOrder }),
    )
  }

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      const nextOrder: SortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
      setSortAndPersist(key, nextOrder)
    } else {
      setSortAndPersist(key, 'asc')
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SORT_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as {
          sortKey: SortKey
          sortOrder: SortOrder
        }
        setSortKey(parsed.sortKey)
        setSortOrder(parsed.sortOrder)
      }
    } catch {
      console.log('Ошибка сортировки')
    }
  }, [setSortKey, setSortOrder])

  return {
    sortKey,
    sortOrder,
    toggleSort,
  }
}

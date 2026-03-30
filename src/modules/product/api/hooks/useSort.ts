import { useMemo, useState } from 'react'

type SortKey = 'title' | 'brand' | 'sku' | 'rating' | 'price'
type SortOrder = 'asc' | 'desc'
type ProductsSortState = { sortKey: SortKey; sortOrder: SortOrder }

const SORT_STORAGE_KEY = 'products_sort'

export const useSort = () => {
  const initialSort = useMemo(() => {
    try {
      const raw = localStorage.getItem(SORT_STORAGE_KEY)
      if (!raw) return { sortKey: 'price' as const, sortOrder: 'asc' as const }
      const parsed = JSON.parse(raw) as Partial<ProductsSortState>
      return {
        sortKey: (parsed.sortKey as SortKey) ?? 'price',
        sortOrder: (parsed.sortOrder as SortOrder) ?? 'asc',
      }
    } catch {
      return { sortKey: 'price' as const, sortOrder: 'asc' as const }
    }
  }, [])

  const [sortKey, setSortKey] = useState<SortKey>(initialSort.sortKey)
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSort.sortOrder)

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

  return {
    sortKey,
    sortOrder,
    toggleSort,
  }
}

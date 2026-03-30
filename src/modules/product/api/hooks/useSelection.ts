import { useMemo, useState } from 'react'

import { type DummyProduct } from '@shared/api/products'

export const useSelection = (products: DummyProduct[]) => {
  const [selected, setSelected] = useState<Set<number>>(() => new Set())

  const allSelectedOnPage = useMemo(() => {
    if (products.length === 0) return false
    return products.every((p) => selected.has(p.id))
  }, [products, selected])

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allSelectedOnPage) {
        products.forEach((p) => next.delete(p.id))
      } else {
        products.forEach((p) => next.add(p.id))
      }
      return next
    })
  }

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearSelection = () => setSelected(new Set())

  return {
    selected,
    allSelectedOnPage,
    toggleSelectAll,
    toggleSelect,
    clearSelection,
  }
}

import { useMemo } from 'react'

import { useProductStore } from '@modules/product/store/productStore'

import { type DummyProduct } from '@shared/api/products'

export const useSelection = (products: DummyProduct[]) => {
  const { selected, toggleSelect, toggleSelectAll, clearSelection } =
    useProductStore()

  const allSelectedOnPage = useMemo(() => {
    if (products.length === 0) return false
    return products.every((product) => selected.has(product.id))
  }, [products, selected])

  const handleToggleSelectAll = () => {
    const productIds = products.map((p) => p.id)
    toggleSelectAll(productIds)
  }

  return {
    selected,
    allSelectedOnPage,
    toggleSelectAll: handleToggleSelectAll,
    toggleSelect,
    clearSelection,
  }
}

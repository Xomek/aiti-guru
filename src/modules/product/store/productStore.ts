import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { type DummyProduct } from '@shared/api/products'

export type SortKey = 'title' | 'brand' | 'sku' | 'rating' | 'price'
export type SortOrder = 'asc' | 'desc'

interface ProductState {
  products: DummyProduct[]
  total: number
  isLoading: boolean
  fetchError: string | null
  page: number
  searchValue: string
  sortKey: SortKey
  sortOrder: SortOrder
  selected: Set<number>

  setProducts: (
    products: DummyProduct[] | ((prev: DummyProduct[]) => DummyProduct[]),
  ) => void
  setTotal: (total: number | ((prev: number) => number)) => void
  setIsLoading: (isLoading: boolean) => void
  setFetchError: (error: string | null) => void
  setPage: (page: number) => void
  setSearchValue: (searchValue: string) => void
  setSortKey: (sortKey: SortKey) => void
  setSortOrder: (sortOrder: SortOrder) => void

  toggleSelect: (id: number) => void
  toggleSelectAll: (productIds: number[]) => void
  clearSelection: () => void

  resetFilters: () => void
}

const initialState = {
  products: [],
  total: 0,
  isLoading: false,
  fetchError: null,
  page: 0,
  searchValue: '',
  sortKey: 'price' as SortKey,
  sortOrder: 'asc' as SortOrder,
  selected: new Set<number>(),
}

export const useProductStore = create<ProductState>()(
  devtools(
    (set) => ({
      ...initialState,

      setProducts: (products) =>
        set((state) => ({
          products:
            typeof products === 'function'
              ? products(state.products)
              : products,
        })),

      setTotal: (total) =>
        set((state) => ({
          total: typeof total === 'function' ? total(state.total) : total,
        })),

      setIsLoading: (isLoading) => set({ isLoading }),

      setFetchError: (fetchError) => set({ fetchError }),

      setPage: (page) => set({ page }),

      setSearchValue: (searchValue) => set({ searchValue, page: 0 }),

      setSortKey: (sortKey) => set({ sortKey }),

      setSortOrder: (sortOrder) => set({ sortOrder }),

      toggleSelect: (id) =>
        set((state) => {
          const newSelected = new Set(state.selected)
          if (newSelected.has(id)) {
            newSelected.delete(id)
          } else {
            newSelected.add(id)
          }
          return { selected: newSelected }
        }),

      toggleSelectAll: (productIds) =>
        set((state) => {
          const allSelected = productIds.every((id) => state.selected.has(id))
          if (allSelected) {
            const newSelected = new Set(state.selected)
            productIds.forEach((id) => newSelected.delete(id))
            return { selected: newSelected }
          } else {
            const newSelected = new Set(state.selected)
            productIds.forEach((id) => newSelected.add(id))
            return { selected: newSelected }
          }
        }),

      clearSelection: () => set({ selected: new Set() }),

      resetFilters: () =>
        set({
          page: 0,
          searchValue: '',
          sortKey: 'price',
          sortOrder: 'asc',
          selected: new Set(),
        }),
    }),
    { name: 'product-store' },
  ),
)

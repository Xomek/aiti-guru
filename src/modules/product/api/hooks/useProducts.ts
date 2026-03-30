import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'

import { useProductStore } from '@modules/product/store/productStore'

import { productsApi } from '@shared/api/products'
import { useAuth } from '@shared/hooks/useAuth'
import { useDebounce } from '@shared/hooks/useDebounce'
import { ROUTES } from '@shared/routing'

export type SortKey = 'title' | 'brand' | 'sku' | 'rating' | 'price'
export type SortOrder = 'asc' | 'desc'

const PAGE_SIZE = 10

export const useProducts = () => {
  const navigate = useNavigate()
  const { clearAuth } = useAuth()

  const {
    page,
    sortKey,
    sortOrder,
    searchValue,
    setProducts,
    setTotal,
    setIsLoading,
    setFetchError,
  } = useProductStore()

  const debouncedSearch = useDebounce(searchValue, 400)

  const sortKeyToApi = {
    title: 'title',
    brand: 'brand',
    sku: 'sku',
    rating: 'rating',
    price: 'price',
  } satisfies Record<SortKey, string>

  const load = async () => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const limit = PAGE_SIZE
      const skip = page * PAGE_SIZE
      const sortBy = sortKeyToApi[sortKey]

      const res = debouncedSearch.trim()
        ? await productsApi.searchProducts({
            q: debouncedSearch.trim(),
            limit,
            skip,
            sortBy,
            order: sortOrder,
          })
        : await productsApi.getProducts({
            limit,
            skip,
            sortBy,
            order: sortOrder,
          })

      setProducts(res.products)
      setTotal(res.total)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 401 || status === 403) {
          clearAuth()
          navigate(ROUTES.LOGIN)
          return
        }
      }
      setFetchError('Ошибка загрузки товаров')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [page, sortKey, sortOrder, debouncedSearch])

  return {
    load,
  }
}

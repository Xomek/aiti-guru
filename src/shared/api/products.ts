import { api } from './client'

export type DummyProduct = {
  id: number
  title: string
  category?: string
  brand: string
  sku: string
  rating: number
  price: number
}

export type ProductsResponse = {
  products: DummyProduct[]
  total: number
  skip: number
  limit: number
}

export const productsApi = {
  getProducts: async (params: {
    limit: number
    skip: number
    sortBy?: string
    order?: 'asc' | 'desc'
  }) => {
    const res = await api.get<ProductsResponse>('/products', { params })
    return res.data
  },

  searchProducts: async (params: {
    q: string
    limit: number
    skip: number
    sortBy?: string
    order?: 'asc' | 'desc'
  }) => {
    const res = await api.get<ProductsResponse>('/products/search', { params })
    return res.data
  },
}

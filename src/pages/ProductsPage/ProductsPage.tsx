import { useState } from 'react'

import {
  type SortKey,
  useProducts,
} from '@modules/product/api/hooks/useProducts'
import { useSelection } from '@modules/product/api/hooks/useSelection'
import { useSort } from '@modules/product/api/hooks/useSort'
import {
  type AddProductData,
  AddProductModal,
} from '@modules/product/ui/AddProductModal/AddProductModal'
import { ProductsTable } from '@modules/product/ui/ProductsTable/ProductsTable'

import plusIcon from '@shared/assets/icons/plus.svg'
import refetchIcon from '@shared/assets/icons/refetch.svg'
import { useToast } from '@shared/hooks/useToast'
import { Button } from '@shared/ui/Button'
import { Loader } from '@shared/ui/Loader/Loader'
import { Pagination } from '@shared/ui/Pagination'
import { Search } from '@shared/ui/Search'
import { Toast } from '@shared/ui/Toast'

import styles from './ProductsPage.module.css'

const PAGE_SIZE = 10

export const ProductsPage = () => {
  const [page, setPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const { sortKey, sortOrder, toggleSort } = useSort()
  const {
    products,
    total,
    isLoading,
    fetchError,
    load,
    setProducts,
    setTotal,
  } = useProducts({
    page,
    sortKey,
    sortOrder,
    searchValue,
  })

  const {
    selected,
    allSelectedOnPage,
    toggleSelectAll,
    toggleSelect,
    clearSelection,
  } = useSelection(products)

  const { toasts, pushToast } = useToast()

  const refresh = () => {
    load()
    clearSelection()
    pushToast('Таблица обновлена')
  }

  const handleAddProduct = (product: AddProductData) => {
    const newProduct = {
      id: Date.now(),
      title: product.name,
      brand: product.brand,
      sku: product.sku,
      rating: 0,
      price: product.price,
      category: 'Товар',
    }

    setProducts((prev) => [newProduct, ...prev])
    setTotal((prev) => prev + 1)
    pushToast('Товар добавлен')
  }

  const handleAddAction = () => {
    pushToast('Добавлено (заглушка)')
  }

  const handleMenuAction = () => {
    pushToast('Меню (заглушка)')
  }

  const handleSort = (key: SortKey) => {
    toggleSort(key)
    setPage(0)
    clearSelection()
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.title}>Товары</div>

        <div className={styles.searchWrap}>
          <Search
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchValue(e.target.value)
            }
            placeholder="Найти"
          />
        </div>

        <div className={styles.actionsRight}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={refresh}
            aria-label="Рефреш"
          >
            <img src={refetchIcon} alt="" />
          </button>

          <Button
            className={styles.addButton}
            type="button"
            onClick={() => setIsAddOpen(true)}
          >
            <img src={plusIcon} alt="" width={24} height={24} />
            <span>Добавить</span>
          </Button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {isLoading && <Loader />}

        <ProductsTable
          products={products}
          selected={selected}
          onToggleSelect={toggleSelect}
          onSelectAll={toggleSelectAll}
          allSelected={allSelectedOnPage}
          onAddAction={handleAddAction}
          onMenuAction={handleMenuAction}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        {fetchError && (
          <div style={{ padding: 16, color: '#ff5a5a' }}>{fetchError}</div>
        )}
      </div>

      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <AddProductModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddProduct}
        isLoading={isLoading}
      />

      <Toast messages={toasts} />
    </div>
  )
}

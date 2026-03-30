import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import clsx from 'clsx'

import { type DummyProduct, productsApi } from '@shared/api/products'
import plusIcon from '@shared/assets/icons/plus.svg'
import refetchIcon from '@shared/assets/icons/refetch.svg'
import { useAuth } from '@shared/hooks/useAuth'
import { useDebounce } from '@shared/hooks/useDebounce'
import { ROUTES } from '@shared/routing'
import { Button } from '@shared/ui/Button'
import { Search } from '@shared/ui/Search'

import styles from './ProductsPage.module.css'

type SortKey = 'title' | 'brand' | 'sku' | 'rating' | 'price'
type SortOrder = 'asc' | 'desc'

const PAGE_SIZE = 10
const SORT_STORAGE_KEY = 'products_sort'
type ProductsSortState = { sortKey: SortKey; sortOrder: SortOrder }

const formatPrice = (price: number) =>
  `${price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`

export const ProductsPage = () => {
  const navigate = useNavigate()
  const { clearAuth } = useAuth()

  const [products, setProducts] = useState<DummyProduct[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)

  const [searchValue, setSearchValue] = useState('')
  const debouncedSearch = useDebounce(searchValue, 400)

  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

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

  const [selected, setSelected] = useState<Set<number>>(() => new Set())

  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>(
    [],
  )
  const pushToast = (message: string) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addName, setAddName] = useState('')
  const [addPrice, setAddPrice] = useState('')
  const [addBrand, setAddBrand] = useState('')
  const [addSku, setAddSku] = useState('')
  const [addErrors, setAddErrors] = useState<{ [k: string]: string }>({})

  const sortArrow =
    sortOrder === 'asc' ? styles.sortArrowAsc : styles.sortArrowDesc

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const shownFrom = total === 0 ? 0 : page * PAGE_SIZE + 1
  const shownTo = total === 0 ? 0 : Math.min((page + 1) * PAGE_SIZE, total)

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
    setPage(0)
    setSelected(new Set())
  }

  const sortKeyToApi = useMemo(() => {
    return {
      title: 'title',
      brand: 'brand',
      sku: 'sku',
      rating: 'rating',
      price: 'price',
    } satisfies Record<SortKey, string>
  }, [])

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
      pushToast('Ошибка загрузки товаров')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setPage(0)
    setSelected(new Set())
  }, [debouncedSearch])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortKey, sortOrder, debouncedSearch])

  const refresh = () => {
    void load()
    setSelected(new Set())
    pushToast('Таблица обновлена')
  }

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

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: { [k: string]: string } = {}

    if (!addName.trim()) nextErrors.name = 'Укажите наименование'
    const priceNum = Number(addPrice)
    if (!addPrice.trim() || Number.isNaN(priceNum) || priceNum <= 0)
      nextErrors.price = 'Укажите цену'
    if (!addBrand.trim()) nextErrors.brand = 'Укажите вендор'
    if (!addSku.trim()) nextErrors.sku = 'Укажите артикул'

    setAddErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const created: DummyProduct = {
      id: Date.now(),
      title: addName.trim(),
      brand: addBrand.trim(),
      sku: addSku.trim(),
      rating: 0,
      price: priceNum,
    }

    setProducts((prev) => [created, ...prev])
    setTotal((prev) => prev + 1)
    setIsAddOpen(false)
    setAddErrors({})
    setAddName('')
    setAddPrice('')
    setAddBrand('')
    setAddSku('')
    pushToast('Товар добавлен')
  }

  const renderSortButton = (key: SortKey, label: string) => {
    const active = key === sortKey
    return (
      <button
        type="button"
        className={clsx(styles.sortButton, active && styles.sortActive)}
        onClick={() => toggleSort(key)}
      >
        {label}
        {active && <span className={clsx(styles.sortArrow, sortArrow)} />}
      </button>
    )
  }

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
    <div className={styles.page}>
      {isLoading && (
        <div className={styles.progressWrap} aria-label="Загрузка">
          <div className={styles.progressBar} />
        </div>
      )}

      <div className={styles.topBar}>
        <div className={styles.title}>Товары</div>

        <div className={styles.searchWrap}>
          <Search
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
            <span className={styles.addButton}>
              <img src={plusIcon} alt="" width={24} height={24} />
              <span>Добавить</span>
            </span>
          </Button>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHead}>
          <input
            type="checkbox"
            checked={allSelectedOnPage}
            onChange={toggleSelectAll}
          />
          <div>{renderSortButton('title', 'Наименование')}</div>
          <div>{renderSortButton('brand', 'Вендор')}</div>
          <div>{renderSortButton('sku', 'Артикул')}</div>
          <div>{renderSortButton('rating', 'Оценка')}</div>
          <div>{renderSortButton('price', 'Цена, ₽')}</div>
          <div></div>
        </div>

        <div className={styles.tableBody}>
          {products.map((p) => {
            const isLow = p.rating < 3.5
            return (
              <div key={p.id} className={styles.row}>
                <div>
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => {
                      setSelected((prev) => {
                        const next = new Set(prev)
                        if (next.has(p.id)) next.delete(p.id)
                        else next.add(p.id)
                        return next
                      })
                    }}
                  />
                </div>

                <div className={styles.nameCell}>
                  <div className={styles.imagePlaceholder} />
                  <div className={styles.nameText}>
                    <div className={styles.nameTitle}>{p.title}</div>
                    <div className={styles.nameSubtitle}>
                      {p.category ?? 'Товар'}
                    </div>
                  </div>
                </div>
                <div className={styles.cell}>{p.brand}</div>
                <div className={styles.cell}>{p.sku}</div>
                <div className={clsx(styles.cell, isLow && styles.ratingLow)}>
                  {p.rating.toFixed(1)}
                </div>
                <div className={styles.cell}>{formatPrice(p.price)}</div>
                <div className={styles.rowActions}>
                  <button
                    type="button"
                    className={styles.plusBtn}
                    aria-label="Добавить (заглушка)"
                    onClick={() => pushToast('Добавлено (заглушка)')}
                  >
                    <img src={plusIcon} alt="" width={16} height={16} />
                  </button>

                  <button
                    type="button"
                    className={styles.dotsBtn}
                    aria-label="Действия (заглушка)"
                    onClick={() => pushToast('Меню (заглушка)')}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="7" cy="3" r="1.4" fill="#7D7F89" />
                      <circle cx="7" cy="7" r="1.4" fill="#7D7F89" />
                      <circle cx="7" cy="11" r="1.4" fill="#7D7F89" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
          {fetchError && (
            <div style={{ padding: 16, color: '#ff5a5a' }}>{fetchError}</div>
          )}
        </div>
      </div>

      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Показано {shownFrom}-{shownTo} из {total}
        </div>

        <div className={styles.paginationControls}>
          <button
            type="button"
            className={clsx(
              styles.pageBtn,
              page === 0 && styles.pageBtnDisabled,
            )}
            onClick={() => page > 0 && setPage(page - 1)}
            disabled={page === 0}
          >
            {'<'}
          </button>

          {visiblePageNumbers.map((n) => (
            <button
              key={n}
              type="button"
              className={clsx(
                styles.pageBtn,
                n === page && styles.pageBtnActive,
              )}
              onClick={() => setPage(n)}
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
            onClick={() => page < totalPages - 1 && setPage(page + 1)}
            disabled={page >= totalPages - 1}
          >
            {'>'}
          </button>
        </div>
      </div>

      {isAddOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) setIsAddOpen(false)
          }}
        >
          <form className={styles.modal} onSubmit={addProduct}>
            <div className={styles.modalTitle}>Добавить товар</div>

            <div className={styles.modalGrid}>
              <div className={styles.modalField}>
                <div className={styles.modalLabel}>Наименование</div>
                <input
                  className={styles.modalInput}
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                />
                {addErrors.name && (
                  <div className={styles.modalError}>{addErrors.name}</div>
                )}
              </div>

              <div className={styles.modalField}>
                <div className={styles.modalLabel}>Цена</div>
                <input
                  className={styles.modalInput}
                  value={addPrice}
                  onChange={(e) => setAddPrice(e.target.value)}
                  inputMode="decimal"
                />
                {addErrors.price && (
                  <div className={styles.modalError}>{addErrors.price}</div>
                )}
              </div>

              <div className={styles.modalField}>
                <div className={styles.modalLabel}>Вендор</div>
                <input
                  className={styles.modalInput}
                  value={addBrand}
                  onChange={(e) => setAddBrand(e.target.value)}
                />
                {addErrors.brand && (
                  <div className={styles.modalError}>{addErrors.brand}</div>
                )}
              </div>

              <div className={styles.modalField}>
                <div className={styles.modalLabel}>Артикул</div>
                <input
                  className={styles.modalInput}
                  value={addSku}
                  onChange={(e) => setAddSku(e.target.value)}
                />
                {addErrors.sku && (
                  <div className={styles.modalError}>{addErrors.sku}</div>
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setIsAddOpen(false)}
                disabled={isLoading}
              >
                Отмена
              </button>
              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={isLoading}
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      )}

      {toasts.length > 0 && (
        <div className={styles.toastWrap}>
          {toasts.map((t) => (
            <div key={t.id} className={styles.toast}>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

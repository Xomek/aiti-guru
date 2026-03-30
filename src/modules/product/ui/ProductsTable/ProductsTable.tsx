import clsx from 'clsx'

import { type DummyProduct } from '@shared/api/products'
import plusIcon from '@shared/assets/icons/plus.svg'
import { Checkbox } from '@shared/ui'

import { formatPrice } from '../../utils/formatPrice'
import { SortButton } from '../SortButton/SortButton'
import styles from './ProdcutsTable.module.css'

export type SortKey = 'title' | 'brand' | 'sku' | 'rating' | 'price'

interface ProductsTableProps {
  products: DummyProduct[]
  selected: Set<number>
  onToggleSelect: (id: number) => void
  onSelectAll: () => void
  allSelected: boolean
  onAddAction: (id: number) => void
  onMenuAction: (id: number) => void
  sortKey: SortKey
  sortOrder: 'asc' | 'desc'
  onSort: (key: SortKey) => void
}

export const ProductsTable = ({
  products,
  selected,
  onToggleSelect,
  onSelectAll,
  allSelected,
  onAddAction,
  onMenuAction,
  sortKey,
  sortOrder,
  onSort,
}: ProductsTableProps) => {
  return (
    <div className={styles.tableCard}>
      <h4 className={styles.title}>Все позиции</h4>

      <div className={styles.tableHead}>
        <Checkbox checked={allSelected} onChange={onSelectAll} />

        <div>
          <SortButton
            label="Наименование"
            active={sortKey === 'title'}
            order={sortOrder}
            onClick={() => onSort('title')}
          />
        </div>

        <div>
          <SortButton
            label="Вендор"
            active={sortKey === 'brand'}
            order={sortOrder}
            onClick={() => onSort('brand')}
          />
        </div>

        <div>
          <SortButton
            label="Артикул"
            active={sortKey === 'sku'}
            order={sortOrder}
            onClick={() => onSort('sku')}
          />
        </div>

        <div>
          <SortButton
            label="Оценка"
            active={sortKey === 'rating'}
            order={sortOrder}
            onClick={() => onSort('rating')}
          />
        </div>

        <div>
          <SortButton
            label="Цена, ₽"
            active={sortKey === 'price'}
            order={sortOrder}
            onClick={() => onSort('price')}
          />
        </div>
      </div>

      <div className={styles.tableBody}>
        {products.map((p) => {
          const isLow = p.rating < 3.5
          const isSelected = selected.has(p.id)

          return (
            <div
              key={p.id}
              className={clsx(styles.row, isSelected && styles.rowSelected)}
            >
              <div>
                <Checkbox
                  checked={isSelected}
                  onChange={() => onToggleSelect(p.id)}
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
                  onClick={() => onAddAction(p.id)}
                >
                  <img src={plusIcon} alt="" width={16} height={16} />
                </button>

                <button
                  type="button"
                  className={styles.dotsBtn}
                  onClick={() => onMenuAction(p.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <circle cx="7" cy="3" r="1.4" fill="#7D7F89" />
                    <circle cx="7" cy="7" r="1.4" fill="#7D7F89" />
                    <circle cx="7" cy="11" r="1.4" fill="#7D7F89" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

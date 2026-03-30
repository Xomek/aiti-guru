import { useState } from 'react'

import styles from './AddProductModal.module.css'

export interface AddProductData {
  name: string
  price: number
  brand: string
  sku: string
}

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (product: AddProductData) => void
  isLoading?: boolean
}

export const AddProductModal = ({
  isOpen,
  onClose,
  onAdd,
  isLoading,
}: AddProductModalProps) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [brand, setBrand] = useState('')
  const [sku, setSku] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}

    if (!name.trim()) nextErrors.name = 'Укажите наименование'
    const priceNum = Number(price)
    if (!price.trim() || Number.isNaN(priceNum) || priceNum <= 0)
      nextErrors.price = 'Укажите цену'
    if (!brand.trim()) nextErrors.brand = 'Укажите вендор'
    if (!sku.trim()) nextErrors.sku = 'Укажите артикул'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onAdd({
      name: name.trim(),
      price: priceNum,
      brand: brand.trim(),
      sku: sku.trim(),
    })
    setName('')
    setPrice('')
    setBrand('')
    setSku('')
    setErrors({})
  }

  if (!isOpen) return null

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onClose()
      }}
    >
      <form className={styles.modal} onSubmit={handleSubmit}>
        <div className={styles.modalTitle}>Добавить товар</div>

        <div className={styles.modalGrid}>
          <div className={styles.modalField}>
            <div className={styles.modalLabel}>Наименование</div>
            <input
              className={styles.modalInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <div className={styles.modalError}>{errors.name}</div>
            )}
          </div>

          <div className={styles.modalField}>
            <div className={styles.modalLabel}>Цена</div>
            <input
              className={styles.modalInput}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              inputMode="decimal"
            />
            {errors.price && (
              <div className={styles.modalError}>{errors.price}</div>
            )}
          </div>

          <div className={styles.modalField}>
            <div className={styles.modalLabel}>Вендор</div>
            <input
              className={styles.modalInput}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            {errors.brand && (
              <div className={styles.modalError}>{errors.brand}</div>
            )}
          </div>

          <div className={styles.modalField}>
            <div className={styles.modalLabel}>Артикул</div>
            <input
              className={styles.modalInput}
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            {errors.sku && (
              <div className={styles.modalError}>{errors.sku}</div>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={onClose}
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
  )
}

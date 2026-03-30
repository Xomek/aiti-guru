import styles from './Toast.module.css'

interface ToastProps {
  messages: Array<{ id: number; message: string }>
}

export const Toast = ({ messages }: ToastProps) => {
  if (messages.length === 0) return null

  return (
    <div className={styles.toastWrap}>
      {messages.map((t) => (
        <div key={t.id} className={styles.toast}>
          {t.message}
        </div>
      ))}
    </div>
  )
}

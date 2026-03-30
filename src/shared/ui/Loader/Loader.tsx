import styles from './Loader.module.css'

export const Loader = () => {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.circularProgress}>
        <div className={styles.circularProgressInner} />
      </div>
    </div>
  )
}

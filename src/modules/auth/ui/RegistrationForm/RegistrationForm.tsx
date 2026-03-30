import { Link, useNavigate } from 'react-router-dom'

import EyeOffIcon from '@shared/assets/icons/eye-off.svg?react'
import LockIcon from '@shared/assets/icons/lock.svg?react'
import UserIcon from '@shared/assets/icons/user.svg?react'
import Logo from '@shared/assets/images/logo.png'
import { ROUTES } from '@shared/routing'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'

import styles from '../Auth.module.css'
import { useRegistrationForm } from './useRegistrationForm'

export const RegistrationForm = () => {
  const navigate = useNavigate()

  const {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    errors,
    apiError,
    isLoading,
    onSubmit,
  } = useRegistrationForm()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await onSubmit()
    if (ok) navigate(ROUTES.PRODUCTS)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <div className={styles.iconCircle}>
          <img src={Logo} alt="logo" />
        </div>
        <h1 className={styles.title}>Добро пожаловать!</h1>
        <div className={styles.subtitle}>Пожалуйста, зарегистрируйтесь</div>
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <div className={styles.labelWrapper}>
            <div className={styles.label}>Логин</div>
            {errors.username && (
              <div className={styles.errorText}>{errors.username}</div>
            )}
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.leftIcon}>
              <UserIcon />
            </div>
            <Input
              className={styles.input}
              error={Boolean(errors.username)}
              type="text"
              placeholder="Введите логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.labelWrapper}>
            <div className={styles.label}>Пароль</div>
            {errors.password && (
              <div className={styles.errorText}>{errors.password}</div>
            )}
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.leftIcon}>
              <LockIcon />
            </div>
            <Input
              className={styles.input}
              error={Boolean(errors.password)}
              placeholder="Введите пароль"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className={styles.rightIconBtn}
              type="button"
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              onClick={() => setShowPassword((v) => !v)}
            >
              <EyeOffIcon />
            </button>
          </div>
        </div>
      </div>

      {apiError && <div className={styles.apiError}>{apiError}</div>}

      <Button
        className={styles.submitButton}
        type="submit"
        disabled={isLoading}
      >
        Создать
      </Button>

      <div className={styles.orRow}>
        <div className={styles.orLine} />
        <div className={styles.orText}>или</div>
        <div className={styles.orLine} />
      </div>

      <div className={styles.bottomText}>
        Уже есть аккаунт?
        <Link className={styles.bottomLink} to={ROUTES.LOGIN}>
          Войти
        </Link>
      </div>
    </form>
  )
}

import { Link, useNavigate } from 'react-router-dom'

import AcrossIcon from '@shared/assets/icons/across.svg?react'
import EyeOffIcon from '@shared/assets/icons/eye-off.svg?react'
import LockIcon from '@shared/assets/icons/lock.svg?react'
import UserIcon from '@shared/assets/icons/user.svg?react'
import Logo from '@shared/assets/images/logo.png'
import { ROUTES } from '@shared/routing'
import { Button } from '@shared/ui/Button'
import { Checkbox } from '@shared/ui/Checkbox'
import { Input } from '@shared/ui/Input'

import styles from '../Auth.module.css'
import { useLoginForm } from './useLoginForm'

export const LoginForm = () => {
  const navigate = useNavigate()

  const {
    username,
    setUsername,
    password,
    setPassword,
    remember,
    setRemember,
    showPassword,
    setShowPassword,
    errors,
    apiError,
    isLoading,
    onSubmit,
  } = useLoginForm()

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
        <div className={styles.subtitle}>Пожалуйста, авторизируйтесь</div>
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
            {username.length > 0 && (
              <button
                className={styles.rightIconBtn}
                type="button"
                aria-label="Очистить логин"
                onClick={() => setUsername('')}
              >
                <AcrossIcon />
              </button>
            )}
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

        <label className={styles.checkboxRow}>
          <Checkbox checked={remember} onChange={setRemember} />
          <span className={styles.checkboxText}>Запомнить данные</span>
        </label>
      </div>

      {apiError && <div className={styles.apiError}>{apiError}</div>}

      <Button
        className={styles.submitButton}
        type="submit"
        disabled={isLoading}
      >
        Войти
      </Button>

      <div className={styles.orRow}>
        <div className={styles.orLine} />
        <div className={styles.orText}>или</div>
        <div className={styles.orLine} />
      </div>

      <div className={styles.bottomText}>
        Нет аккаунта?
        <Link className={styles.createText} to={ROUTES.REGISTER}>
          Создать
        </Link>
      </div>
    </form>
  )
}

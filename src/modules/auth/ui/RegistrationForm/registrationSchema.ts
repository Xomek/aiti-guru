import { z } from 'zod'

export const registrationSchema = z.object({
  username: z.string().min(1, 'Логин обязателен'),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
})

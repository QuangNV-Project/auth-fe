import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .max(50, { message: 'Username must be less than 50 characters' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(100, { message: 'Password must be less than 100 characters' })
    .nonempty({ message: 'Password is required' }),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must be between 3 and 20 characters' })
    .nonempty({ message: 'Username is required' }),
  email: z
    .string()
    .email({ message: 'Email should be valid' })
    .nonempty({ message: 'Email is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .nonempty({ message: 'Password is required' }),
  firstName: z
    .string()
    .nonempty({ message: 'First name is required' }),
  lastName: z
    .string()
    .nonempty({ message: 'Last name is required' }),
})

export type RegisterFormData = z.infer<typeof registerSchema>

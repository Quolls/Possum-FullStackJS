import * as z from 'zod'

export const SignupValidation = z.object({
  name: z.string().min(2, { message: 'Please enter longer name' }),
  username: z.string().min(2, { message: 'Please enter longer username' }),
  email: z
    .string()
    .min(2, { message: 'Please enter a complete email address' }),
  password: z.string().min(2, { message: 'Please enter a longer password' })
})

import { z } from "zod"

export const loginSchema = z.object({
	email: z.string().email("Введите корректный email"),
	password: z.string().min(1, "Введите пароль")
})

export type LoginSchema = z.infer<typeof loginSchema>

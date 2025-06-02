import { z } from "zod"

export const registerSchema = z
	.object({
		name: z.string().min(3, "Введите имя"),
		email: z.string().email("Введите корректный email адрес"),
		password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
		passwordRepeat: z
			.string()
			.min(8, "Пароль должен содержать минимум 8 символов")
	})
	.refine((data) => data.password === data.passwordRepeat, {
		message: "Пароли не совпадают",
		path: ["passwordRepeat"]
	})

export type RegisterSchema = z.infer<typeof registerSchema>

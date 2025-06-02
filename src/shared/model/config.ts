import { z } from "zod"

const configSchema = z.object({
	API_BASE_URL: z.string().url("API_BASE_URL должен быть валидным URL"),
	GOOGLE_RECAPTCHA_SITE_KEY: z
		.string()
		.min(1, "GOOGLE_RECAPTCHA_SITE_KEY обязателен")
})

const rawConfig = {
	API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
	GOOGLE_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY
}

export const CONFIG = configSchema.parse(rawConfig)

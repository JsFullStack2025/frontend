import { z } from "zod"

export const containerPropsSchema = z.object({
	direction: z.enum(["row", "col"], {
		message: "Неверно задан тип для direction"
	}),
	padding: z.string({
		message: "padding должен быть числом"
	}),
	gap: z.string({
		message: "gap должен быть числом"
	})
})

export type ContainerPropsSchema = z.infer<typeof containerPropsSchema>

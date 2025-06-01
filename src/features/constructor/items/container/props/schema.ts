import { z } from "zod"

export const containerPropsSchema = z.object({
	direction: z.enum(["row", "col"], {
		message: "Неверно задан тип для direction"
	})
})

export type ContainerPropsSchema = z.infer<typeof containerPropsSchema>

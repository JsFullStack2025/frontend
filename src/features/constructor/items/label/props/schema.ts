import { z } from "zod"

export const labelPropsSchema = z.object({
	text: z.string({
		message: "text должен быть строкой"
	}),
	bold: z.boolean({
		message: "bold должен быть true/false"
	}),
	italic: z.boolean({
		message: "italic должен быть true/false"
	}),
	underline: z.boolean({
		message: "underline должен быть true/false"
	}),
	fontSize: z.string({
		message: "fontSize должен быть числом"
	})
})

export type LabelPropsSchema = z.infer<typeof labelPropsSchema>

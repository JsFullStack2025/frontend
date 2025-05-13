export const ROUTES = {
	HOME: "/",
	EXAMPLE_ROUTE: "/example/:user/:id"
} as const

export type PathParams = {
	[ROUTES.EXAMPLE_ROUTE]: {
		user: string
		id: string
	}
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { type PathParams, ROUTES } from "../model/routes"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function href<T extends (typeof ROUTES)[keyof typeof ROUTES]>(
	route: T,
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	params?: PathParams[T]
) {
	return route.replace(/:(\w+)/g, (_, key) =>
		String(params?.[key as keyof NonNullable<typeof params>] ?? "")
	)
}

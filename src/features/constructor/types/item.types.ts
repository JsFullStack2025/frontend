import { ReactNode } from "react"

export type ConstructorItem<T = any> = {
	id: string
	type: string
	parent: string | null
	data: T
}

export type RegisteredItemType<T = any> = {
	id: string
	renderer: (item: ConstructorItem<T>, devMode?: boolean) => ReactNode
	defaultData: T
}

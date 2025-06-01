import { ReactNode } from "react"

export type ConstructorItem<T = any> = {
	id: string
	type: string
	parent: string | null
	data: T
}

export type RegisteredItemType<T = any> = {
	id: string
	icon?: any
	renderer: (item: ConstructorItem<T>, devMode?: boolean) => ReactNode
	propertiesForm: (item: ConstructorItem<T>) => ReactNode
	defaultData: T
}

export type ConstructorItem<T = any> = {
	id: string
	type: string
	parent: string | null
	data: T
}

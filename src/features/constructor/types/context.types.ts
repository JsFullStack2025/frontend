import { ConstructorItem } from "./item.types"

export type ConstructorContextType = {
	items: ConstructorItem[]
	selectedItem: string | null
	addItem: (item: ConstructorItem) => void
	removeItem: (id: string) => void
	selectItem: (id: string | null) => void
}

import { ConstructorItem } from "./item.types"

export type ConstructorContextType = {
	items: ConstructorItem[]
	selectedItem: string | null
	selectedType: string | null
	parent: string | null
	setParent: (id: string | null) => void
	addItem: (item: ConstructorItem) => void
	removeItem: (id: string) => void
	editItem: (id: string, data: any) => void
	selectItem: (id: string | null) => void
	selectType: (type: string | null) => void
}

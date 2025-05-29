import { createContext, useContext, useState } from "react"

import { ConstructorContextType } from "../types/context.types"
import { ConstructorItem } from "../types/item.types"

const ConstructorContext = createContext<ConstructorContextType>({
	items: [],
	selectedItem: null,
	addItem: () => {},
	removeItem: () => {},
	selectItem: () => {},
	editItem: () => {},
	selectedType: null,
	selectType: () => {},
	parent: null,
	setParent: () => {}
})

export const useConstructor = () => {
	const context = useContext(ConstructorContext)
	if (!context) {
		throw new Error("useConstructor must be used within a ConstructorProvider")
	}
	return context
}

export function ConstructorProvider({
	children
}: {
	children: React.ReactNode
}) {
	const [items, setItems] = useState<ConstructorItem[]>([])
	const [selected, setSelected] = useState<string | null>(null)
	const [parent, setParent] = useState<string | null>(null)
	const [selectedType, setSelectedType] = useState<string | null>(null)

	const addItem = (item: ConstructorItem) => {
		setItems((prev) => [...prev, item])
	}

	const removeItem = (id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id))
	}

	const selectItem = (id: string | null) => {
		setSelected(id)
	}

	const editItem = (id: string, data: any) => {
		setItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, data } : item))
		)
	}

	const selectType = (type: string | null) => {
		setSelectedType(type)
	}

	const selectParent = (id: string | null) => {
		setParent(id)
	}

	return (
		<ConstructorContext.Provider
			value={{
				items,
				selectedItem: selected,
				addItem,
				removeItem,
				selectItem,
				editItem,
				selectedType,
				selectType,
				parent,
				setParent: selectParent
			}}
		>
			{children}
		</ConstructorContext.Provider>
	)
}

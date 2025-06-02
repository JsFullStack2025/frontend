"use client"

import { itemManager } from "./config/item.config"
import { useConstructor } from "./context/constructor.context"

export function ItemProperties() {
	const { items, selectedItem } = useConstructor()
	const item = items.find((it) => it.id === selectedItem)

	if (!item) return "Элемент не выбран"

	const propsForm = itemManager.findTypeById(item.type)?.propertiesForm(item)

	if (!propsForm) return "У элемента нет параметров"

	return (
		<div
			key={item.id}
			className="w-64"
		>
			{propsForm}
		</div>
	)
}

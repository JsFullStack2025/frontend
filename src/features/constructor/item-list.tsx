"use client"

import { itemManager } from "./config/item.config"
import { useConstructor } from "./context/constructor.context"

export function ItemList() {
	const { selectedType, selectType } = useConstructor()

	const onDragStart = (
		event: React.DragEvent<HTMLDivElement>,
		itemType: string
	) => {
		selectType(itemType)
		event.dataTransfer.effectAllowed = "move"
	}

	return (
		<div className="flex flex-col gap-2 p-4">
			{itemManager.registeredItemTypes.map((item) => (
				<div
					key={item.id}
					className="flex size-16 items-center justify-center bg-gray-300 select-none"
					onDragStart={(event) => onDragStart(event, item.id)}
					draggable
				>
					{!!item.icon ? <item.icon className="size-4" /> : item.id}
				</div>
			))}
		</div>
	)
}

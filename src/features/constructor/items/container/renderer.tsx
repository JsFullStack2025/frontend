import cuid from "cuid"
import React, { useCallback } from "react"

import { cn } from "@/shared/lib/utils"

import { itemManager } from "../../config/item.config"
import { useConstructor } from "../../context/constructor.context"
import { ConstructorItem } from "../../types/item.types"

import { ContainerItemData } from "./types"

type Props = {
	item: ConstructorItem<ContainerItemData>
}

export function ContainerItemRenderer({ item }: Props) {
	const { items, addItem, selectedType, parent } = useConstructor()
	const [isDragging, setIsDragging] = React.useState(false)

	const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		event.stopPropagation()
		event.dataTransfer.dropEffect = "move"
		setIsDragging(true)
	}, [])

	const onDragLeave = useCallback(() => {
		setIsDragging(false)
	}, [])

	const onDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault()
			event.stopPropagation()

			setIsDragging(false)

			if (!selectedType) {
				return
			}

			const registeredType = itemManager.findTypeById(selectedType)

			if (!registeredType) {
				return
			}

			addItem({
				id: cuid(),
				parent: item.id,
				data: registeredType.defaultData,
				type: registeredType.id
			})
		},
		[selectedType]
	)

	return (
		<div
			className={cn("flex min-h-16 w-full gap-2 border-4 border-gray-300 p-1", {
				"border-blue-500": isDragging
			})}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
		>
			{items
				.filter((it) => it.parent === item.id)
				.map((item) => (
					<React.Fragment key={item.id}>
						{itemManager.findTypeById(item.type)?.renderer(item)}
					</React.Fragment>
				))}
		</div>
	)
}

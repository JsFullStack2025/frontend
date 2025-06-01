"use client"

import cuid from "cuid"
import React, { useCallback } from "react"

import { cn } from "@/shared/lib/utils"
import { PlusBlock } from "@/shared/ui/plus-block"

import { itemManager } from "./config/item.config"
import { useConstructor } from "./context/constructor.context"
import { ItemList } from "./item-list"

export function Canvas() {
	const [isDragging, setIsDragging] = React.useState(false)
	const { items, addItem, selectedType, selectItem, parent } = useConstructor()

	const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		if (event.isPropagationStopped()) return

		event.dataTransfer.dropEffect = "move"
		setIsDragging(true)
	}, [])

	const onDragLeave = useCallback(() => {
		setIsDragging(false)
	}, [])

	const onDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault()
			setIsDragging(false)

			if (!selectedType) {
				return
			}

			const registeredType = itemManager.findTypeById(selectedType)

			if (!registeredType) {
				return
			}

			const newId = cuid()

			addItem({
				id: newId,
				parent,
				data: registeredType.defaultData,
				type: registeredType.id
			})
			selectItem(newId)
		},
		[selectedType]
	)

	return (
		<div className="flex gap-2">
			<ItemList />
			<div
				className={cn(
					"flex min-h-128 w-128 flex-col gap-1 border bg-white p-1",
					{
						"p-4": isDragging
					}
				)}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
			>
				{items
					.filter((it) => it.parent === null)
					.map((item) => (
						<React.Fragment key={item.id}>
							{itemManager.findTypeById(item.type)?.renderer(item, true)}
						</React.Fragment>
					))}
				{isDragging && <PlusBlock />}
			</div>
		</div>
	)
}

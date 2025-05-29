"use client"

import cuid from "cuid"
import React, { useCallback } from "react"

import { itemManager } from "./config/item.config"
import { useConstructor } from "./context/constructor.context"
import { ItemList } from "./item-list"

export function Canvas() {
	const [isDragging, setIsDragging] = React.useState(false)
	const { items, addItem, selectedType, parent } = useConstructor()

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

			addItem({
				id: cuid(),
				parent,
				data: registeredType.defaultData,
				type: registeredType.id
			})
		},
		[selectedType]
	)

	return (
		<div className="flex gap-2">
			<ItemList />
			<div
				className="flex min-h-128 w-128 flex-col bg-gray-400"
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
			>
				{items
					.filter((it) => it.parent === null)
					.map((item) => (
						<React.Fragment key={item.id}>
							{itemManager.findTypeById(item.type)?.renderer(item)}
						</React.Fragment>
					))}
				{isDragging && (
					<div className="pointer-events-none h-8 w-full bg-blue-400" />
				)}
			</div>
		</div>
	)
}

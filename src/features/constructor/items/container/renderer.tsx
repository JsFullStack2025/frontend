"use client"

import cuid from "cuid"
import React, { useCallback } from "react"

import { cn } from "@/shared/lib/utils"
import { PlusBlock } from "@/shared/ui/plus-block"

import { itemManager } from "../../config/item.config"
import { useConstructor } from "../../context/constructor.context"
import { ConstructorItem } from "../../types/item.types"

import { ContainerItemData } from "./types"

type Props = {
	item: ConstructorItem<ContainerItemData>
	devMode?: boolean
}

export function ContainerItemRenderer({ item, devMode }: Props) {
	const { items, addItem, selectedType, selectItem } = useConstructor()
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

			const newId = cuid()

			addItem({
				id: newId,
				parent: item.id,
				data: registeredType.defaultData,
				type: registeredType.id
			})
			selectItem(newId)
		},
		[selectedType]
	)

	const select = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		if (devMode) selectItem(item.id)
	}

	return (
		<div
			className={cn(
				"flex min-h-16 w-full flex-1",
				`flex-${item.data.direction}`,
				{
					"gap-2 border-2 border-dashed border-gray-300 p-1": devMode,
					"p-4": isDragging
				}
			)}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
			onClick={select}
		>
			{items
				.filter((it) => it.parent === item.id)
				.map((item) => (
					<React.Fragment key={item.id}>
						{itemManager.findTypeById(item.type)?.renderer(item, devMode)}
					</React.Fragment>
				))}
			{isDragging && <PlusBlock />}
		</div>
	)
}

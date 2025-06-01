import { Image } from "lucide-react"

import { cn } from "@/shared/lib/utils"

import { useConstructor } from "../../context/constructor.context"
import { ConstructorItem } from "../../types/item.types"

import { PictureItemData } from "./types"

type Props = {
	item: ConstructorItem<PictureItemData>
	devMode?: boolean
}

export function PictureItemRenderer({ item, devMode }: Props) {
	const { selectItem, selectedItem } = useConstructor()
	const isSelect = selectedItem === item.id

	const select = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		if (devMode) selectItem(item.id)
	}

	return (
		<div
			onClick={select}
			className={cn("flex-1", {
				"flex items-center justify-center bg-gray-200": !item.data.src,
				"border-4 border-blue-300": isSelect && devMode
			})}
		>
			{!!item.data.src ? item.data.src : <Image className="size-8" />}
		</div>
	)
}

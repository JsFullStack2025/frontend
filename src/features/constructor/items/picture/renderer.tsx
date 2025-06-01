import { Image } from "lucide-react"

import { useConstructor } from "../../context/constructor.context"
import { ConstructorItem } from "../../types/item.types"

import { PictureItemData } from "./types"

type Props = {
	item: ConstructorItem<PictureItemData>
	devMode?: boolean
}

export function PictureItemRenderer({ item, devMode }: Props) {
	const { selectItem } = useConstructor()

	const select = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		if (devMode) selectItem(item.id)
	}

	return !!item.data.src ? (
		<div onClick={select} className="flex-1 bg-gray-200">
			{item.data.src}
		</div>
	) : (
		<div
			onClick={select}
			className="flex flex-1 items-center justify-center bg-gray-200"
		>
			<Image className="size-8" />
		</div>
	)
}

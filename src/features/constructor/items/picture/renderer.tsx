import { ConstructorItem } from "../../types/item.types"

import { PictureItemData } from "./types"
import { PictureBlank } from "./ui/picture-blank"

type Props = {
	item: ConstructorItem<PictureItemData>
	devMode?: boolean
}

export function PictureItemRenderer({ item }: Props) {
	return !!item.data.src ? (
		<div className="flex-1 bg-gray-200">{item.data.src}</div>
	) : (
		<PictureBlank />
	)
}

import { cn } from "@/shared/lib/utils"

import { useConstructor } from "../../context/constructor.context"
import { ConstructorItem } from "../../types/item.types"

import { LabelItemData } from "./types"

type Props = {
	item: ConstructorItem<LabelItemData>
	devMode?: boolean
}

export function LabelItemRenderer({ item, devMode }: Props) {
	const { selectItem, selectedItem } = useConstructor()
	const isSelect = selectedItem === item.id

	const select = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		if (devMode) selectItem(item.id)
	}

	const content = item.data.text
	return (
		<p
			onClick={select}
			style={{ fontSize: item.data.fontSize }}
			className={cn("h-fit min-w-8", {
				"bg-blue-300": isSelect && devMode,
				"font-bold": item.data.bold,
				italic: item.data.italic,
				underline: item.data.underline
			})}
		>
			{devMode && (!!content.length ? content : "Введите текст")}
			{!devMode && content}
		</p>
	)
}

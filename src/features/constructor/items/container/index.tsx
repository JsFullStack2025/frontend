import { Group } from "lucide-react"

import { ConstructorItem, RegisteredItemType } from "../../types/item.types"

import { ContainerItemPropsForm } from "./props/form"
import { ContainerItemRenderer } from "./renderer"
import { ContainerItemData } from "./types"

export const ContainerItem: RegisteredItemType<ContainerItemData> = {
	id: "container",
	icon: Group,
	renderer: (item: ConstructorItem, devMode?: boolean) => (
		<ContainerItemRenderer
			item={item}
			devMode={devMode}
		/>
	),
	propertiesForm: (item: ConstructorItem) => (
		<ContainerItemPropsForm item={item} />
	),
	defaultData: { direction: "row", padding: 0, margin: 0, gap: 0 }
}

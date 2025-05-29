import { ConstructorItem, RegisteredItemType } from "../../types/item.types"

import { ContainerItemRenderer } from "./renderer"
import { ContainerItemData } from "./types"

export const ContainerItem: RegisteredItemType<ContainerItemData> = {
	id: "container",
	renderer: (item: ConstructorItem) => <ContainerItemRenderer item={item} />,
	defaultData: { columns: 2 }
}

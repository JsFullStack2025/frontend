import { ConstructorItem, RegisteredItemType } from "../../types/item.types"

import { PictureItemRenderer } from "./renderer"
import { PictureItemData } from "./types"

export const PictureItem: RegisteredItemType<PictureItemData> = {
	id: "picture",
	renderer: (item: ConstructorItem, devMode?: boolean) => (
		<PictureItemRenderer item={item} devMode={devMode} />
	),
	propertiesForm: (item: ConstructorItem) => undefined,
	defaultData: { src: "" }
}

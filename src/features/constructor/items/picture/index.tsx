import { RegisteredItemType } from "../../types/item.types"
import { ConstructorItem } from "../../types/item.types"

import { PictureItemRenderer } from "./renderer"
import { PictureItemData } from "./types"

export const PictureItem: RegisteredItemType<PictureItemData> = {
	id: "picture",
	renderer: (item: ConstructorItem) => <PictureItemRenderer item={item} />,
	defaultData: { src: "" }
}

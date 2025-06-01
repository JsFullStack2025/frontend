import { ConstructorItem, RegisteredItemType } from "../../types/item.types"

import { LabelItemPropsForm } from "./props/form"
import { LabelItemRenderer } from "./renderer"
import { LabelItemData } from "./types"

export const LabelItem: RegisteredItemType<LabelItemData> = {
	id: "label",
	renderer: (item: ConstructorItem, devMode?: boolean) => (
		<LabelItemRenderer
			item={item}
			devMode={devMode}
		/>
	),
	propertiesForm: (item: ConstructorItem) => <LabelItemPropsForm item={item} />,
	defaultData: {
		text: "",
		bold: false,
		italic: false,
		underline: false,
		fontSize: 12
	}
}

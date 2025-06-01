import { ContainerItem } from "../items/container"
import { LabelItem } from "../items/label"
import { PictureItem } from "../items/picture"
import { RegisteredItemType } from "../types/item.types"

class ItemManager {
	registeredItemTypes: RegisteredItemType[] = [
		ContainerItem,
		PictureItem,
		LabelItem
	]

	findTypeById(id: string) {
		return this.registeredItemTypes.find((item) => item.id === id)
	}
}

export const itemManager = new ItemManager()

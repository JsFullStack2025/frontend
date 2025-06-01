import { ContainerItem } from "../items/container"
import { PictureItem } from "../items/picture"
import { RegisteredItemType } from "../types/item.types"

class ItemManager {
	registeredItemTypes: RegisteredItemType[] = [ContainerItem, PictureItem]

	findTypeById(id: string) {
		return this.registeredItemTypes.find((item) => item.id === id)
	}
}

export const itemManager = new ItemManager()

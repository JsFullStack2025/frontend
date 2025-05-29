import { ContainerItem } from "../items/container"
import { RegisteredItemType } from "../types/item.types"

class ItemManager {
	registeredItemTypes: RegisteredItemType[] = [ContainerItem]

	findTypeById(id: string) {
		return this.registeredItemTypes.find((item) => item.id === id)
	}
}

export const itemManager = new ItemManager()

import React from "react"

import { itemManager } from "./config/item.config"
import { useConstructor } from "./context/constructor.context"

export function CarView() {
	const { items } = useConstructor()
	return (
		<div className="flex min-h-128 w-128 flex-col border bg-white">
			{items
				.filter((it) => it.parent === null)
				.map((item) => (
					<React.Fragment key={item.id}>
						{itemManager.findTypeById(item.type)?.renderer(item, false)}
					</React.Fragment>
				))}
		</div>
	)
}

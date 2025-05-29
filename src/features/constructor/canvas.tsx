import { useConstructor } from "./context/constructor.context"

export function Canvas() {
	const { items, selectedItem, addItem, removeItem, selectItem } =
		useConstructor()

	return (
		<div>
			<div>
				{items.map((item) => (
					<div key={item.id}>{item.id}</div>
				))}
			</div>
		</div>
	)
}

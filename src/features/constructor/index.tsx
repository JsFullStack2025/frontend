"use client"

import { Canvas } from "./canvas"
import { ConstructorProvider } from "./context/constructor.context"
import { CarView } from "./view"

export const Constructor: React.FC = () => {
	return (
		<ConstructorProvider>
			<div className="flex gap-2">
				<Canvas />
				<CarView />
			</div>
		</ConstructorProvider>
	)
}

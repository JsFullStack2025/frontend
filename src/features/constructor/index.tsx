"use client"

import { Canvas } from "./canvas"
import { ConstructorProvider } from "./context/constructor.context"

export const Constructor: React.FC = () => {
	return (
		<ConstructorProvider>
			<Canvas />
		</ConstructorProvider>
	)
}

import { PlusIcon } from "lucide-react"

export function PlusBlock() {
	return (
		<div className="pointer-events-none flex w-full flex-1 items-center justify-center bg-gray-200">
			<PlusIcon className="h-5 w-5 text-gray-500" />
		</div>
	)
}

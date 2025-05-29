import { Metadata } from "next"

import { Constructor } from "@/features/constructor"

export const metadata: Metadata = {
	title: "Конструктор",
	description: "Конструктор"
}

export default function Page() {
	return <Constructor />
}

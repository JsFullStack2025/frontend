import { Metadata } from "next"

import { LoginPage } from "@/features/auth/login.page"

export const metadata: Metadata = {
	title: "Вход в систему",
	description: "Вход в систему"
}

export default function Page() {
	return <LoginPage />
}

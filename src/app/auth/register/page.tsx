import { Metadata } from "next"

import { RegisterPage } from "@/features/auth/register.page"

export const metadata: Metadata = {
	title: "Создание аккаунта",
	description: "Создание аккаунта"
}

export default function Page() {
	return <RegisterPage />
}

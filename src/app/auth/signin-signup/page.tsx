import { Metadata } from "next"

import { SignInSignUp } from "@/features/auth"

export const metadata: Metadata = {
	title: "Авторизация"
}

export default function Page() {
	return (
		<div className="flex w-full items-center justify-center">
			<SignInSignUp />
		</div>
	)
}

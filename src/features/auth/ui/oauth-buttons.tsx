import { FaGithub, FaYandex } from "react-icons/fa"

import { Button } from "@/shared/ui/button"

export function OAuthButtons() {
	return (
		<div className="grid grid-cols-2 gap-6">
			<Button variant="outline">
				<FaYandex className="mr-2 size-4" />
				Яндекс
			</Button>
			<Button variant="outline">
				<FaGithub className="mr-2 size-4" />
				GitHub
			</Button>
		</div>
	)
}

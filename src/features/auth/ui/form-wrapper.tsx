import Link from "next/link"
import { type PropsWithChildren } from "react"

import { Button } from "@/shared/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/shared/ui/card"
import { Separator } from "@/shared/ui/separator"

import { OAuthButtons } from "./oauth-buttons"

type Props = {
	heading: string
	description?: string
	backButtonLabel?: string
	backButtonHref?: string
	oauth?: boolean
}

export function FormWrapper({
	children,
	heading,
	description,
	backButtonLabel,
	backButtonHref,
	oauth = false
}: PropsWithChildren<Props>) {
	return (
		<Card className="w-[400px]">
			<CardHeader>
				<CardTitle className="text-center text-xl font-bold">
					{heading}
				</CardTitle>
				{description && (
					<CardDescription className="text-center">
						{description}
					</CardDescription>
				)}
			</CardHeader>
			<CardContent>
				{children}
				{oauth && (
					<>
						<Separator label="или" />
						<OAuthButtons />
					</>
				)}
			</CardContent>
			<CardFooter>
				{backButtonLabel && backButtonHref && (
					<Button
						asChild
						variant="link"
						className="w-full font-normal"
					>
						<Link href={backButtonHref}>{backButtonLabel}</Link>
					</Button>
				)}
			</CardFooter>
		</Card>
	)
}

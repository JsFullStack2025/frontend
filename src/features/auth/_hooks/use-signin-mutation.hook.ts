import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"

import { toastMessageHandler } from "@/shared/lib/toast-message-handler"

import { SignInSchema } from "../_schemas/signin.schema"
import { authService } from "../_services/auth.service"

export function useSignInMutation(
	//setIsShow2FA: Dispatch<SetStateAction<boolean>>
) {
	const router = useRouter()

	const { mutate: signIn, isPending } = useMutation({
		mutationKey: ["signin"],
		mutationFn: ({ data, captcha }: { data: SignInSchema; captcha: string }) =>
			authService.signIn(data, captcha),
		onSuccess(data: any) {
			//if (data.message) {
				//setIsShow2FA(true)
				//toastMessageHandler(data)
			//} else {
				//router.push("/dashboard/settings")
			//}
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { signIn, isPending }
}

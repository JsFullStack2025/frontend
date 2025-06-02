import { useRouter } from "next/navigation"

import { publicRqClient } from "@/shared/api/instance"
import { ApiSchemas } from "@/shared/api/schema"
import { useSession } from "@/shared/model/session"

export function useRegister() {
	const router = useRouter()
	const session = useSession()

	const mutation = publicRqClient.useMutation("post", "/auth/register", {
		onSuccess: (data) => {
			session.login(data.accessToken)
			router.push("/dashboard")
		}
	})

	const register = (data: ApiSchemas["RegisterRequest"]) => {
		mutation.mutate({ body: data })
	}

	const errorMessage = mutation.isError ? mutation.error.message : undefined

	return { register, isPending: mutation.isPending, errorMessage }
}

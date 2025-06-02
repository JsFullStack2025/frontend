import { useRouter } from "next/navigation"

import { publicRqClient } from "@/shared/api/instance"
import { ApiSchemas } from "@/shared/api/schema"
import { useSession } from "@/shared/model/session"

export function useLogin() {
	const router = useRouter()
	const session = useSession()

	const mutation = publicRqClient.useMutation("post", "/auth/login", {
		onSuccess: (data) => {
			session.login(data.accessToken)
			router.push("/dashboard")
		}
	})

	const login = (data: ApiSchemas["LoginRequest"]) => {
		mutation.mutate({ body: data })
	}

	const errorMessage = mutation.isError ? mutation.error.message : undefined

	return { login, isPending: mutation.isPending, errorMessage }
}

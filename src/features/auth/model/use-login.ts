import { useRouter } from "next/navigation"

import { rqClient } from "@/shared/api/instance"
import { ApiSchemas } from "@/shared/api/schema"

export function useLogin() {
	const router = useRouter()
	const mutation = rqClient.useMutation("post", "/auth/login", {
		onSuccess: () => {
			router.push("/dashboard")
		}
	})

	const login = (data: ApiSchemas["LoginRequest"]) => {
		mutation.mutate({ body: data })
	}

	const errorMessage = mutation.isError ? mutation.error.message : undefined

	return { login, isPending: mutation.isPending, errorMessage }
}

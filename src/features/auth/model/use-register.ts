import { useRouter } from "next/navigation"

import { rqClient } from "@/shared/api/instance"
import { ApiSchemas } from "@/shared/api/schema"

export function useRegister() {
	const router = useRouter()
	const mutation = rqClient.useMutation("post", "/auth/register", {
		onSuccess: () => {
			router.push("/dashboard")
		}
	})

	const register = (data: ApiSchemas["RegisterRequest"]) => {
		mutation.mutate({ body: data })
	}

	const errorMessage = mutation.isError ? mutation.error.message : undefined

	return { register, isPending: mutation.isPending, errorMessage }
}

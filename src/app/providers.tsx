"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { useEffect } from "react"

import { enableMocking } from "@/shared/api/mocks"
import { queryClient } from "@/shared/api/query-client"

function MockProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		enableMocking()
	}, [])

	return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<MockProvider>{children}</MockProvider>
		</QueryClientProvider>
	)
}

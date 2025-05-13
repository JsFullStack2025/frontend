export async function enableMocking() {
	if (process.env.NODE_ENV === "production") {
		return
	}

	if (typeof window === "undefined") {
		// Серверное окружение
		const { server } = await import("@/shared/api/mocks/server")
		return server.listen()
	} else {
		// Браузерное окружение
		const { worker } = await import("@/shared/api/mocks/browser")
		return worker.start()
	}
}

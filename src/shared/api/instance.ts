"use client"

import createFetchClient from "openapi-fetch"
import createClient from "openapi-react-query"

import { CONFIG } from "../model/config"
import { useSession } from "../model/session"

import { ApiPaths, ApiSchemas } from "./schema"

export const publicFetchClient = createFetchClient<ApiPaths>({
	baseUrl: CONFIG.API_BASE_URL
})

export const publicRqClient = createClient(publicFetchClient)

export const authorizedFetchClient = createFetchClient<ApiPaths>({
	baseUrl: CONFIG.API_BASE_URL
})

export const authorizedRqClient = createClient(authorizedFetchClient)

authorizedFetchClient.use({
	async onRequest({ request }) {
		const token = await useSession.getState().refreshToken()
		if (token) {
			request.headers.set("Authorization", `Bearer ${token}`)
		} else {
			throw new Response(
				JSON.stringify({
					code: "NOT_AUTHORIZED",
					message: "Вы не авторизованы для доступа к данному ресурсу"
				} as ApiSchemas["Error"]),
				{
					status: 401,
					headers: {
						"Content-Type": "application/json"
					}
				}
			)
		}
	}
})

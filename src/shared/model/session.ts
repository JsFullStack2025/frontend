"use client"

import { createGStore } from "create-gstore"
import { jwtDecode } from "jwt-decode"
import { useState } from "react"

import { publicFetchClient } from "../api/instance"

const TOKEN_KEY = "token"

let refreshTokenPromise: Promise<string | null> | null = null

type Session = {
	userId: string
	email: string
	exp: number
	iat: number
}

export const useSession = createGStore(() => {
	const [token, setToken] = useState(() =>
		typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)
	)

	const login = (token: string) => {
		localStorage.setItem(TOKEN_KEY, token)
		setToken(token)
	}

	const logout = () => {
		localStorage.removeItem(TOKEN_KEY)
		setToken(null)
	}

	const session = token ? jwtDecode<Session>(token) : null

	const refreshToken = async () => {
		if (!token) {
			return null
		}

		const session = jwtDecode<Session>(token)

		if (session.exp < Date.now() / 1000 + 1) {
			if (!refreshTokenPromise) {
				refreshTokenPromise = publicFetchClient
					.POST("/auth/refresh")
					.then((res) => res.data?.accessToken ?? null)
					.then((newToken) => {
						if (newToken) {
							login(newToken)
							return newToken
						} else {
							logout()
							return null
						}
					})
					.finally(() => {
						refreshTokenPromise = null
					})
			}

			const newToken = await refreshTokenPromise

			if (newToken) {
				return newToken
			} else {
				return null
			}
		}
	}

	return {
		refreshToken,
		session,
		login,
		logout
	}
})

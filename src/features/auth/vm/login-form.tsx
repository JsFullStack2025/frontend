"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { CONFIG } from "@/shared/model/config"
import { Button } from "@/shared/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/shared/ui/form"
import { Input } from "@/shared/ui/input"

import { useLogin } from "../hooks/use-login"
import { LoginSchema, loginSchema } from "../schemas/login.schema"

export function LoginForm() {
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
	const { login, isPending, errorMessage } = useLogin()

	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	})

	const onSubmit = (data: LoginSchema) => {
		if (recaptchaValue) {
			login({ ...data, captcha: recaptchaValue })
		}
	}

	useEffect(() => {
		if (errorMessage) {
			toast.error(errorMessage)
		}
	}, [errorMessage])

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="my-2 grid gap-4"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="email"
									autoComplete="email"
									autoCorrect="off"
									autoCapitalize="none"
									disabled={isPending}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center justify-between">
								<FormLabel>Пароль</FormLabel>
								<Link
									className="ml-auto inline-block text-sm underline"
									href="/auth/reset-password"
								>
									Забыли пароль?
								</Link>
							</div>

							<FormControl>
								<Input
									{...field}
									type="password"
									autoComplete="password"
									autoCorrect="off"
									autoCapitalize="none"
									disabled={isPending}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-center">
					<ReCAPTCHA
						sitekey={CONFIG.GOOGLE_RECAPTCHA_SITE_KEY}
						onChange={setRecaptchaValue}
					/>
				</div>
				<Button
					disabled={!recaptchaValue || isPending}
					type="submit"
				>
					{isPending ? "Вход в систему..." : "Авторизоваться"}
				</Button>
			</form>
		</Form>
	)
}

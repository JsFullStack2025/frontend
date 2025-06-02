import { FormWrapper } from "./ui/form-wrapper"
import { LoginForm } from "./vm/login-form"

export function LoginPage() {
	return (
		<main className="flex grow items-center justify-center">
			<FormWrapper
				heading="Вход в систему"
				description="Введите ваш email и пароль для авторизации"
				backButtonLabel="Еще нет аккаунта? Зарегистрируйтесь"
				backButtonHref="/auth/register"
				oauth
			>
				<LoginForm />
			</FormWrapper>
		</main>
	)
}

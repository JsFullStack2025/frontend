import { FormWrapper } from "./ui/form-wrapper"
import { RegisterForm } from "./vm/register-form"

export function RegisterPage() {
	return (
		<main className="flex grow items-center justify-center">
			<FormWrapper
				heading="Создание аккаунта"
				description="Введите ваше имя, email и пароль для создания аккаунта"
				backButtonLabel="Уже есть аккаунт? Войдите"
				backButtonHref="/auth/login"
				oauth
			>
				<RegisterForm />
			</FormWrapper>
		</main>
	)
}

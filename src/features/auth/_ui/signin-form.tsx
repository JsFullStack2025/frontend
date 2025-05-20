'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignInSchema, signinSchema } from "../_schemas/signin.schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { useState } from "react";
import { Input } from "@/shared/ui/input";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { useSignInMutation } from "../_hooks/use-signin-mutation.hook"
import ReCAPTCHA from "react-google-recaptcha"

//import { OAuthButtons } from "./oauth-buttons";

export function SignInForm() {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  //const [isShow2FA, setIsShow2FA] = useState(false)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signinSchema),
  });

  const { signIn, isPending } = useSignInMutation()

  const onSubmit = (data: SignInSchema) => {
    if (recaptchaValue) {
      signIn({ data, captcha: recaptchaValue })
    }
  }

  return (
    <Form {...form} >
      <div>
        <p className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">Вход в аккаунт</p>
        <p className="text-sm text-muted-foreground text-center">Введите данные для входа в свой аккаунт</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-muted-foreground">Электронная почта</FormLabel>
              <FormControl>
                <Input className="w-full" placeholder="example@mail.ru" {...field} />
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
              <FormLabel className="text-sm text-muted-foreground">Пароль</FormLabel>
              <FormControl>
                <Input className="w-full" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ReCAPTCHA className={`${recaptchaValue ? "hidden " : ""} `}
          sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
          onChange={setRecaptchaValue}
        />
        {/*error ? <div className='text-sm text-center flex flex-col text-red-500'>Неверная электронная почта или пароль</div> : ""*/}
        <div className="gap-2 flex flex-col">
          <Link href="/">
            <div className="text-right mb-1">
              <div className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 relative inline-block">
                Забыли пароль?
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-purple-500 to-blue-500"></div>
              </div>
            </div>
          </Link>
          <Button disabled={!recaptchaValue || isPending} type="submit" variant="customGradient" size="customLg">Войти</Button>
        </div>
      </form>
      
    </Form>
  )
}
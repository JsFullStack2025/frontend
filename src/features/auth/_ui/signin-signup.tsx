import { Card, CardContent, CardHeader } from "@/shared/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"


import { SignInForm } from "./signin-form"
import { SignUpForm } from "./signup-form"


export function SignInSignUp() {


  return (
    <div className="flex items-center justify-center ">
      <Card className="w-sm  ">
        <Tabs defaultValue="signin" className="w-full">
          <CardHeader>
            <TabsList className="w-full ">
              <TabsTrigger value="signin">Вход</TabsTrigger>
              <TabsTrigger value="signup">Регистрация</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="signin" className="space-y-4">
              <SignInForm />
            </TabsContent>
            <TabsContent value="signup" className="space-y-4">
              <SignUpForm />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card >
    </div>
  )
}
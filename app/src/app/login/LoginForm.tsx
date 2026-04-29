"use client"

import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import PlatformLogo from "@/components/PlatformLogo"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})
type Values = z.infer<typeof schema>

interface LoginFormProps {
  platformName: string
  isWhiteLabel: boolean
  hideRegister: boolean
  orgLogoUrl?: string | null
}

const LoginForm = ({
  platformName,
  isWhiteLabel,
  hideRegister,
  orgLogoUrl,
}: LoginFormProps) => {
  const router = useRouter()
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: Values) => {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })
    if (result?.error) {
      toast.error("Invalid email or password")
      return
    }
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4 font-[family-name:var(--font-inter)]">
      <div className="w-full max-w-md">
        <Link
          href={isWhiteLabel ? "/dashboard" : "/"}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <PlatformLogo platformName={platformName} orgLogoUrl={orgLogoUrl} />
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-center">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to manage your games
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@company.com"
                          {...field}
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full"
                >
                  {form.formState.isSubmitting ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        {!hideRegister && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Create one free
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}

export default LoginForm

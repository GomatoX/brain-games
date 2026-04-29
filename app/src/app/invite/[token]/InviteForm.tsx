"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import PlatformLogo from "@/components/PlatformLogo"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { UserPlus } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(8, "Min. 8 characters"),
    confirmPassword: z.string().min(8, "Min. 8 characters"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
type Values = z.infer<typeof schema>

interface InviteFormProps {
  token: string
  email: string
  firstName: string
  lastName: string
  orgName: string
  platformName: string
  orgLogoUrl?: string | null
}

const InviteForm = ({
  token,
  email,
  firstName: initialFirstName,
  lastName: initialLastName,
  orgName,
  platformName,
  orgLogoUrl,
}: InviteFormProps) => {
  const router = useRouter()
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: Values) => {
    try {
      const res = await fetch("/api/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      router.push("/dashboard")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to set up your account",
      )
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4 font-[family-name:var(--font-inter)]">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <PlatformLogo platformName={platformName} orgLogoUrl={orgLogoUrl} />
        </Link>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 bg-rust/10 rounded-xl mx-auto mb-2">
              <UserPlus className="text-rust size-6" />
            </div>
            <CardTitle className="text-2xl font-serif text-center">
              Join {orgName}
            </CardTitle>
            <CardDescription className="text-center">
              You&apos;ve been invited to join {orgName}. Set up your account to
              get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Min. 8 characters"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Re-enter your password"
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
                    {form.formState.isSubmitting
                      ? "Setting up account…"
                      : "Set Up Account"}
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default InviteForm

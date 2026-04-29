"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/ui/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { FileUpload } from "@/components/ui/FileUpload"
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
import { Lock } from "lucide-react"
import { toast } from "sonner"

const MAX_LOGO_SIZE_KB = 500
const MAX_LOGO_SIZE_BYTES = MAX_LOGO_SIZE_KB * 1024

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type PasswordValues = z.infer<typeof passwordSchema>

interface SettingsProps {
  isOwner: boolean
  initialSettings: {
    language: string
    default_branding: string
    org_name: string
    logo_url: string | null
    share_image_url: string
    share_title: string
    share_description: string
    use_platform_chrome: boolean
  }
  initialBrandingOptions: { id: string; name: string }[]
}

export default function SettingsContent({
  isOwner,
  initialSettings,
  initialBrandingOptions,
}: SettingsProps) {
  const [orgName, setOrgName] = useState(initialSettings.org_name)
  const [language, setLanguage] = useState(initialSettings.language)
  const [defaultBranding, setDefaultBranding] = useState(
    initialSettings.default_branding,
  )
  const [logoUrl, setLogoUrl] = useState<string | null>(
    initialSettings.logo_url,
  )
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialSettings.logo_url,
  )
  const brandingOptions = initialBrandingOptions
  const [saving, setSaving] = useState(false)
  const [shareImageUrl, setShareImageUrl] = useState(
    initialSettings.share_image_url,
  )
  const [shareTitle, setShareTitle] = useState(initialSettings.share_title)
  const [shareDescription, setShareDescription] = useState(
    initialSettings.share_description,
  )
  const [usePlatformChrome, setUsePlatformChrome] = useState(
    initialSettings.use_platform_chrome,
  )
  const [chromePending, setChromePending] = useState(false)
  const router = useRouter()

  const handleChromeToggle = async (next: boolean) => {
    const previous = usePlatformChrome
    setUsePlatformChrome(next)
    setChromePending(true)
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usePlatformChrome: next }),
      })
      if (!res.ok) {
        setUsePlatformChrome(previous)
        toast.error("Failed to update appearance preference. Please try again.")
        return
      }
      router.refresh()
    } catch {
      setUsePlatformChrome(previous)
      toast.error("Failed to update appearance preference. Please try again.")
    } finally {
      setChromePending(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_LOGO_SIZE_BYTES) {
      toast.error(`File too large. Maximum size is ${MAX_LOGO_SIZE_KB}KB.`)
      return
    }

    if (!file.type.match(/^image\/(png|jpeg|svg\+xml|webp)$/)) {
      toast.error("Only PNG, JPG, SVG, and WebP files are supported.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setLogoPreview(dataUrl)
      setLogoUrl(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoUrl(null)
    setLogoPreview(null)
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          default_branding: defaultBranding || null,
          org_name: orgName || null,
          logo_url: logoUrl,
          share_image_url: shareImageUrl || null,
          share_title: shareTitle || null,
          share_description: shareDescription || null,
        }),
      })

      if (res.ok) {
        toast.success("Settings saved")
      } else if (res.status === 403) {
        toast.error("Only the organization owner can change settings.")
      }
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your organization details and workspace preferences."
      />

      <div className="space-y-8">
        {/* Organization Settings Card */}
        <Card>
          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. My Company"
                disabled={!isOwner}
              />
            </div>

            {/* Workspace Logo */}
            {isOwner ? (
              <FileUpload
                label="Workspace Logo"
                onChange={handleLogoChange}
                preview={logoPreview}
                onRemove={handleRemoveLogo}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.04em]">
                  Workspace Logo
                </span>
                <div className="flex items-center gap-3">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Organization logo"
                      className="h-12 max-w-[120px] rounded-[4px] object-contain border border-[#e2e8f0] bg-[#f8fafc] p-1"
                    />
                  ) : (
                    <span className="text-sm text-[#94a3b8]">No logo set</span>
                  )}
                  <span className="text-xs text-[#94a3b8]">
                    Only the owner can change the logo
                  </span>
                </div>
              </div>
            )}

            {/* Language + Default Branding — Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={language}
                  onValueChange={setLanguage}
                  disabled={!isOwner}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lt">🇱🇹 Lithuanian</SelectItem>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="branding">Default Branding</Label>
                <Select
                  value={defaultBranding || "__none__"}
                  onValueChange={(v) =>
                    setDefaultBranding(v === "__none__" ? "" : v)
                  }
                  disabled={!isOwner}
                >
                  <SelectTrigger id="branding">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None (no default)</SelectItem>
                    {brandingOptions.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          {/* Save Footer */}
          {isOwner && (
            <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-[#f1f5f9] flex items-center justify-end gap-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}

          {!isOwner && (
            <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-[#f1f5f9]">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Lock className="size-4" />
                Settings can only be changed by the organization owner
              </p>
            </div>
          )}
        </Card>

        {/* Appearance (per-user) */}
        <Card>
          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="border-b border-[#f1f5f9] pb-4">
              <h2 className="text-lg font-semibold text-navy-900">Appearance</h2>
              <p className="text-sm text-[#94a3b8] mt-1">
                Controls how the dashboard chrome looks for you.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Switch
                id="use-platform-chrome"
                checked={usePlatformChrome}
                disabled={chromePending}
                onCheckedChange={(checked) => void handleChromeToggle(checked)}
                className="mt-0.5"
              />
              <Label
                htmlFor="use-platform-chrome"
                className="text-sm font-normal cursor-pointer"
              >
                Use the platform default appearance (don&apos;t apply my organization&apos;s brand to the dashboard).
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <PasswordSection />

        {/* Social Sharing */}
        <Card>
          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="border-b border-[#f1f5f9] pb-4">
              <h2 className="text-lg font-semibold text-navy-900">
                Social Sharing
              </h2>
              <p className="text-sm text-[#94a3b8] mt-1">
                Configure how shared game results appear on social media.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="share-image-url">Share Image URL</Label>
              <Input
                id="share-image-url"
                value={shareImageUrl}
                onChange={(e) => setShareImageUrl(e.target.value)}
                placeholder="https://example.com/share-image.jpg"
                disabled={!isOwner}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="share-title">Share Title</Label>
                <Input
                  id="share-title"
                  value={shareTitle}
                  onChange={(e) => setShareTitle(e.target.value)}
                  placeholder="e.g. Kryžiažodis — {{time}}"
                  disabled={!isOwner}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="share-description">Share Description</Label>
                <Input
                  id="share-description"
                  value={shareDescription}
                  onChange={(e) => setShareDescription(e.target.value)}
                  placeholder="e.g. Išspręsta per {{time}}!"
                  disabled={!isOwner}
                />
              </div>
            </div>
            <p className="text-xs text-[#94a3b8]">
              Available variables:{" "}
              <code className="bg-[#f1f5f9] px-1.5 py-0.5 rounded text-[#475569]">
                {"{{time}}"}
              </code>{" "}
              — solver&apos;s time (MM:SS),{" "}
              <code className="bg-[#f1f5f9] px-1.5 py-0.5 rounded text-[#475569]">
                {"{{title}}"}
              </code>{" "}
              — game title
            </p>
          </CardContent>

          {isOwner && (
            <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-[#f1f5f9] flex items-center justify-end gap-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function PasswordSection() {
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: PasswordValues) => {
    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Password changed!")
      form.reset()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change password",
      )
    }
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 lg:p-8 pt-6 space-y-6">
        <div className="border-b border-[#f1f5f9] pb-4">
          <h2 className="text-lg font-semibold text-navy-900">
            Security &amp; Access
          </h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="password-form"
            className="space-y-5 max-w-sm"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-[#f1f5f9] flex items-center justify-end gap-3">
        <Button
          variant="outline"
          form="password-form"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </Card>
  )
}

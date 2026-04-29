"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
import {
  UserPlus,
  UserMinus,
  RefreshCw,
  Mail,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"

interface Member {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  org_role: string
  invite_pending: boolean
  invite_expired: boolean
  created_at: string
}

interface TeamData {
  org: { id: string; name: string }
  members: Member[]
  currentUserId: string
  isOwner: boolean
}

const inviteSchema = z.object({
  email: z.string().email("Enter a valid email"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

type InviteValues = z.infer<typeof inviteSchema>

export default function TeamContent({
  initialData,
}: {
  initialData: TeamData
}) {
  const [data, setData] = useState<TeamData>(initialData)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/team")
      if (res.ok) {
        const d = await res.json()
        setData(d)
      }
    } catch {
      // ignore
    }
  }

  const handleInvite = async (values: {
    email: string
    firstName: string
    lastName: string
  }) => {
    setInviteLoading(true)

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const d = await res.json()
      if (!res.ok) throw new Error(d.error || "Failed to invite member")

      // Build the invite link
      const link = `${window.location.origin}/invite/${d.invite_token}`
      setInviteLink(link)
      await fetchTeam()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to invite member",
      )
    } finally {
      setInviteLoading(false)
    }
  }

  const handleResendInvite = async (memberId: string) => {
    const member = data?.members.find((m) => m.id === memberId)
    if (!member) return

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: member.email,
          firstName: member.first_name || "",
          lastName: member.last_name || "",
        }),
      })

      const d = await res.json()
      if (!res.ok) throw new Error(d.error)

      const link = `${window.location.origin}/invite/${d.invite_token}`
      setInviteLink(link)
      await fetchTeam()
    } catch {
      // ignore
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const closeInviteModal = () => {
    setInviteOpen(false)
    setInviteLink("")
  }

  const handleRemove = async (memberId: string) => {
    try {
      await fetch(`/api/team?id=${memberId}`, { method: "DELETE" })
      await fetchTeam()
    } catch {
      // ignore
    }
    setDeleteConfirm(null)
  }

  return (
    <div>
      <PageHeader
        title="Team"
        description={
          <>
            Manage members of{" "}
            <span className="font-medium text-[#0f172a]">{data.org.name}</span>.
            All members share the same games, branding, and API token.
          </>
        }
      />

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[15px]">Members</CardTitle>
          <Badge variant="secondary">{data.members.length}</Badge>
          {data.isOwner && (
            <CardAction>
              <Button size="sm" onClick={() => setInviteOpen(true)}>
                <UserPlus className="size-4" />
                Invite Member
              </Button>
            </CardAction>
          )}
        </CardHeader>

        <div className="divide-y divide-[#e2e8f0]">
          {data.members.map((member) => {
            const name =
              [member.first_name, member.last_name].filter(Boolean).join(" ") ||
              member.email
            const isCurrentUser = member.id === data.currentUserId

            return (
              <div
                key={member.id}
                className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      member.invite_pending
                        ? "bg-amber-50 text-amber-600"
                        : "bg-navy-900/10 text-navy-900"
                    }`}
                  >
                    {member.invite_pending ? (
                      <Mail className="size-4" />
                    ) : (
                      (
                        member.first_name?.[0] ||
                        member.email?.[0] ||
                        "U"
                      ).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0f172a] truncate">
                      {name}
                      {isCurrentUser && (
                        <span className="text-xs text-[#64748b] ml-1.5">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-[#64748b] truncate">
                      {member.email} ·{" "}
                      {member.invite_pending
                        ? "Invited"
                        : new Date(member.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
                  {/* Status badges */}
                  {member.invite_pending ? (
                    <Badge
                      variant={member.invite_expired ? "destructive" : "warning"}
                    >
                      <span className="size-1.5 rounded-full bg-current opacity-70" />
                      {member.invite_expired ? "Expired" : "Pending"}
                    </Badge>
                  ) : (
                    <Badge
                      variant={
                        member.org_role === "owner" ? "warning" : "secondary"
                      }
                    >
                      <span className="size-1.5 rounded-full bg-current opacity-70" />
                      {member.org_role}
                    </Badge>
                  )}

                  {/* Action buttons for owner */}
                  {data.isOwner && !isCurrentUser && (
                    <div className="flex items-center gap-1">
                      {member.invite_pending && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResendInvite(member.id)}
                          title="Regenerate invite link"
                        >
                          <RefreshCw className="size-4" />
                        </Button>
                      )}
                      {member.org_role !== "owner" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(member.id)}
                          title="Remove member"
                          className="hover:text-red-600"
                        >
                          <UserMinus className="size-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Invite Modal */}
      <Dialog
        open={inviteOpen}
        onOpenChange={(open) => {
          if (!open) closeInviteModal()
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="size-5" />
              {inviteLink ? "Invite Link Ready" : "Invite Member"}
            </DialogTitle>
          </DialogHeader>
          {inviteLink ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-[4px] mx-auto">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Share this link with the new member. They&apos;ll be able to set
                their own password and join your organization.
              </p>
              <div className="flex items-center gap-2 bg-slate-50 border rounded-md px-3 py-2.5">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="flex-1 bg-transparent text-sm outline-none truncate"
                />
                <Button size="sm" onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                This link expires in 7 days.
              </p>
              <Button
                variant="outline"
                onClick={closeInviteModal}
                className="w-full"
              >
                Done
              </Button>
            </div>
          ) : (
            <InviteMemberForm
              onSubmit={handleInvite}
              loading={inviteLoading}
              onCancel={closeInviteModal}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Invite link modal (from resend) */}
      <Dialog
        open={!!inviteLink && !inviteOpen}
        onOpenChange={(open) => {
          if (!open) setInviteLink("")
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="size-5" />
              New Invite Link
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Share this updated link with the member.
            </p>
            <div className="flex items-center gap-2 bg-slate-50 border rounded-md px-3 py-2.5">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="flex-1 bg-transparent text-sm outline-none truncate"
              />
              <Button size="sm" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              This link expires in 7 days.
            </p>
            <Button
              variant="outline"
              onClick={() => setInviteLink("")}
              className="w-full"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirm(null)
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove this member? They will lose access
            to all shared games and data.
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleRemove(deleteConfirm)}
            >
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const InviteMemberForm = ({
  onSubmit,
  loading,
  onCancel,
}: {
  onSubmit: (values: {
    email: string
    firstName: string
    lastName: string
  }) => Promise<void>
  loading: boolean
  onCancel: () => void
}) => {
  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", firstName: "", lastName: "" },
  })

  const handle = async (values: InviteValues) => {
    await onSubmit({
      email: values.email,
      firstName: values.firstName ?? "",
      lastName: values.lastName ?? "",
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handle)}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
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
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="member@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send Invite"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

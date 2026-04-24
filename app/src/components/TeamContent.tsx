"use client";

import { useState } from "react";
import {
  Panel,
  PanelHeader,
  Badge,
  Button,
  Modal,
  PageHeader,
} from "@/components/ui";

interface Member {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  org_role: string;
  invite_pending: boolean;
  invite_expired: boolean;
  created_at: string;
}

interface TeamData {
  org: { id: string; name: string };
  members: Member[];
  currentUserId: string;
  isOwner: boolean;
}

export default function TeamContent({
  initialData,
}: {
  initialData: TeamData;
}) {
  const [data, setData] = useState<TeamData>(initialData);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [inviteError, setInviteError] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function fetchTeam() {
    try {
      const res = await fetch("/api/team");
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch {
      // ignore
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError("");

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to invite member");

      // Build the invite link
      const link = `${window.location.origin}/invite/${d.invite_token}`;
      setInviteLink(link);
      await fetchTeam();
    } catch (err) {
      setInviteError(
        err instanceof Error ? err.message : "Failed to invite member",
      );
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleResendInvite(memberId: string) {
    const member = data?.members.find((m) => m.id === memberId);
    if (!member) return;

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: member.email,
          firstName: member.first_name || "",
          lastName: member.last_name || "",
        }),
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d.error);

      const link = `${window.location.origin}/invite/${d.invite_token}`;
      setInviteLink(link);
      setInviteForm({ email: "", firstName: "", lastName: "" });
      await fetchTeam();
    } catch {
      // ignore
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function closeInviteModal() {
    setInviteOpen(false);
    setInviteError("");
    setInviteLink("");
    setInviteForm({ email: "", firstName: "", lastName: "" });
  }

  async function handleRemove(memberId: string) {
    try {
      await fetch(`/api/team?id=${memberId}`, { method: "DELETE" });
      await fetchTeam();
    } catch {
      // ignore
    }
    setDeleteConfirm(null);
  }

  const currentUser = data.members.find((m) => m.id === data.currentUserId);

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
      <Panel>
        <PanelHeader
          title="Members"
          count={data.members.length}
          action={
            data.isOwner ? (
              <Button
                size="sm"
                icon="person_add"
                onClick={() => setInviteOpen(true)}
              >
                Invite Member
              </Button>
            ) : undefined
          }
        />

        <div className="divide-y divide-[#e2e8f0]">
          {data.members.map((member) => {
            const name =
              [member.first_name, member.last_name].filter(Boolean).join(" ") ||
              member.email;
            const isCurrentUser = member.id === data.currentUserId;

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
                      <span className="material-symbols-outlined text-lg">
                        mail
                      </span>
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
                    <Badge variant={member.invite_expired ? "error" : "warning"}>
                      {member.invite_expired ? "Expired" : "Pending"}
                    </Badge>
                  ) : (
                    <Badge
                      variant={
                        member.org_role === "owner" ? "warning" : "neutral"
                      }
                    >
                      {member.org_role}
                    </Badge>
                  )}

                  {/* Action buttons for owner */}
                  {data.isOwner && !isCurrentUser && (
                    <div className="flex items-center gap-1">
                      {member.invite_pending && (
                        <button
                          onClick={() => handleResendInvite(member.id)}
                          className="p-1.5 text-[#64748b] hover:text-navy-900 transition-colors rounded-[4px] hover:bg-slate-100"
                          title="Regenerate invite link"
                        >
                          <span className="material-symbols-outlined text-lg">
                            refresh
                          </span>
                        </button>
                      )}
                      {member.org_role !== "owner" && (
                        <button
                          onClick={() => setDeleteConfirm(member.id)}
                          className="p-1.5 text-[#64748b] hover:text-red-600 transition-colors rounded-lg hover:bg-slate-100"
                          title="Remove member"
                        >
                          <span className="material-symbols-outlined text-lg">
                            person_remove
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Invite Modal */}
      <Modal
        open={inviteOpen}
        onClose={closeInviteModal}
        title={inviteLink ? "Invite Link Ready" : "Invite Member"}
        icon="person_add"
      >
        {inviteLink ? (
          /* Success: show invite link */
          <div className="p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-[4px] mx-auto">
              <span className="material-symbols-outlined text-green-600 text-2xl">
                check_circle
              </span>
            </div>
            <p className="text-sm text-[#64748b] text-center">
              Share this link with the new member. They&apos;ll be able to set
              their own password and join your organization.
            </p>
            <div className="flex items-center gap-2 bg-slate-50 border border-[#e2e8f0] rounded-lg px-3 py-2.5">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="flex-1 bg-transparent text-sm text-[#0f172a] outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 px-3 py-1 text-xs font-medium bg-navy-900 text-white rounded-[4px] hover:bg-navy-800 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-[#94a3b8] text-center">
              This link expires in 7 days.
            </p>
            <button
              onClick={closeInviteModal}
              className="w-full px-4 py-2 text-sm font-medium border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* Form: collect email + name */
          <form onSubmit={handleInvite} className="p-4 sm:p-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#64748b] mb-1 block">
                  First Name
                </label>
                <input
                  type="text"
                  value={inviteForm.firstName}
                  onChange={(e) =>
                    setInviteForm({
                      ...inviteForm,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust/30 focus:border-rust"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#64748b] mb-1 block">
                  Last Name
                </label>
                <input
                  type="text"
                  value={inviteForm.lastName}
                  onChange={(e) =>
                    setInviteForm({
                      ...inviteForm,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust/30 focus:border-rust"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#64748b] mb-1 block">
                Email *
              </label>
              <input
                type="email"
                required
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, email: e.target.value })
                }
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust/30 focus:border-rust"
                placeholder="member@example.com"
              />
            </div>

            {inviteError && (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {inviteError}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
              <button
                type="button"
                onClick={closeInviteModal}
                className="px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={inviteLoading}
                className="px-4 py-2 text-sm bg-navy-900 text-white rounded-[4px] hover:bg-navy-800 disabled:opacity-50 transition-colors"
              >
                {inviteLoading ? "Sending…" : "Send Invite"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Invite link modal (from resend) */}
      <Modal
        open={!!inviteLink && !inviteOpen}
        onClose={() => setInviteLink("")}
      >
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-[4px] mx-auto">
            <span className="material-symbols-outlined text-green-600 text-2xl">
              check_circle
            </span>
          </div>
          <h3 className="text-lg font-semibold text-[#0f172a] text-center">
            New Invite Link
          </h3>
          <p className="text-sm text-[#64748b] text-center">
            Share this updated link with the member.
          </p>
          <div className="flex items-center gap-2 bg-slate-50 border border-[#e2e8f0] rounded-[4px] px-3 py-2.5">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 bg-transparent text-sm text-[#0f172a] outline-none truncate"
            />
            <Button size="sm" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="text-xs text-[#94a3b8] text-center">
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
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        size="sm"
      >
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-[#0f172a] mb-2">
            Remove Member
          </h3>
          <p className="text-sm text-[#64748b] mb-6">
            Are you sure you want to remove this member? They will lose access
            to all shared games and data.
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteConfirm && handleRemove(deleteConfirm)}
            >
              Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

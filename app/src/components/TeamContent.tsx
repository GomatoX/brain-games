"use client";

import { useState, useEffect } from "react";

interface Member {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  org_role: string;
  created_at: string;
}

interface TeamData {
  org: { id: string; name: string };
  members: Member[];
  currentUserId: string;
  isOwner: boolean;
}

export default function TeamContent() {
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [inviteError, setInviteError] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
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
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeam();
  }, []);

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

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to invite member");
      }

      setInviteForm({ email: "", firstName: "", lastName: "", password: "" });
      setInviteOpen(false);
      await fetchTeam();
    } catch (err) {
      setInviteError(
        err instanceof Error ? err.message : "Failed to invite member",
      );
    } finally {
      setInviteLoading(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-rust border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-[#64748b]">
        Failed to load team data.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-medium text-[#0f172a] mb-1">
          Team
        </h1>
        <p className="text-[#64748b] text-sm">
          Manage members of{" "}
          <span className="font-medium text-[#0f172a]">{data.org.name}</span>.
          All members share the same games, branding, and API token.
        </p>
      </div>

      {/* Members List */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-600 text-lg">
              group
            </span>
          </div>
          <h2 className="font-semibold text-[#0f172a]">Members</h2>
          <span className="text-xs text-[#64748b] bg-slate-100 px-2 py-0.5 rounded-full">
            {data.members.length}
          </span>
          {data.isOwner && (
            <button
              onClick={() => setInviteOpen(true)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rust text-white rounded-lg hover:bg-rust-dark transition-colors"
            >
              <span className="material-symbols-outlined text-sm">
                person_add
              </span>
              Invite Member
            </button>
          )}
        </div>

        <div className="divide-y divide-[#e2e8f0]">
          {data.members.map((member) => {
            const name =
              [member.first_name, member.last_name].filter(Boolean).join(" ") ||
              member.email;
            const isCurrentUser = member.id === data.currentUserId;

            return (
              <div
                key={member.id}
                className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="w-9 h-9 bg-rust/10 rounded-full flex items-center justify-center text-rust font-bold text-sm shrink-0">
                  {(
                    member.first_name?.[0] ||
                    member.email?.[0] ||
                    "U"
                  ).toUpperCase()}
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
                    {new Date(member.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    member.org_role === "owner"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-slate-100 text-[#64748b]"
                  }`}
                >
                  {member.org_role}
                </span>
                {data.isOwner &&
                  !isCurrentUser &&
                  member.org_role !== "owner" && (
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
            );
          })}
        </div>
      </div>

      {/* Invite Modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rust">
                  person_add
                </span>
                <h2 className="text-lg font-semibold text-[#0f172a]">
                  Invite Member
                </h2>
              </div>
              <button
                onClick={() => {
                  setInviteOpen(false);
                  setInviteError("");
                }}
                className="p-1 text-[#64748b] hover:text-[#0f172a] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleInvite} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
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
                      setInviteForm({ ...inviteForm, lastName: e.target.value })
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
              <div>
                <label className="text-xs font-medium text-[#64748b] mb-1 block">
                  Temporary Password *
                </label>
                <input
                  type="text"
                  required
                  value={inviteForm.password}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, password: e.target.value })
                  }
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rust/30 focus:border-rust"
                  placeholder="Set a temporary password"
                />
                <p className="text-xs text-[#94a3b8] mt-1">
                  Share this password with the member so they can log in.
                </p>
              </div>

              {inviteError && (
                <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {inviteError}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setInviteOpen(false);
                    setInviteError("");
                  }}
                  className="px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="px-4 py-2 text-sm bg-rust text-white rounded-lg hover:bg-rust-dark disabled:opacity-50 transition-colors"
                >
                  {inviteLoading ? "Creating…" : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-[#0f172a] mb-2">
              Remove Member
            </h3>
            <p className="text-sm text-[#64748b] mb-6">
              Are you sure you want to remove this member? They will lose access
              to all shared games and data.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemove(deleteConfirm)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

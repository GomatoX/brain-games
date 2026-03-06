"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PlatformLogo from "@/components/PlatformLogo";

interface InviteFormProps {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  orgName: string;
  platformName: string;
  orgLogoUrl?: string | null;
}

export default function InviteForm({
  token,
  email,
  firstName: initialFirstName,
  lastName: initialLastName,
  orgName,
  platformName,
  orgLogoUrl,
}: InviteFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, firstName, lastName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to set up your account",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4 font-[family-name:var(--font-inter)]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <PlatformLogo platformName={platformName} orgLogoUrl={orgLogoUrl} />
        </Link>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg border border-[#e2e8f0] p-8">
          <div className="flex items-center justify-center w-12 h-12 bg-rust/10 rounded-xl mx-auto mb-4">
            <span className="material-symbols-outlined text-rust text-2xl">
              person_add
            </span>
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#0f172a] text-center mb-2">
            Join {orgName}
          </h1>
          <p className="text-[#64748b] text-sm text-center mb-8">
            You&apos;ve been invited to join {orgName}. Set up your account to
            get started.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email (read-only) */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#0f172a] mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                readOnly
                className="w-full bg-slate-50 border border-[#e2e8f0] text-[#64748b] text-sm rounded-lg px-4 py-2.5 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-[#0f172a] mb-1.5"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white border border-[#e2e8f0] text-[#0f172a] text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust placeholder-slate-400"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-[#0f172a] mb-1.5"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white border border-[#e2e8f0] text-[#0f172a] text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust placeholder-slate-400"
                  placeholder="Smith"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#0f172a] mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#e2e8f0] text-[#0f172a] text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust placeholder-slate-400"
                placeholder="Min. 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#0f172a] mb-1.5"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-[#e2e8f0] text-[#0f172a] text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust placeholder-slate-400"
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rust hover:bg-rust-dark disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
            >
              {loading ? "Setting up account…" : "Set Up Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#64748b] mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-rust hover:text-rust-dark font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

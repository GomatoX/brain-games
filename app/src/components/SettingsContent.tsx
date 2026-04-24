"use client";

import { useState, useRef } from "react";
import {
  PageHeader,
  Panel,
  Input,
  Select,
  FileUpload,
  Button,
} from "@/components/ui";

interface BrandingOption {
  id: string;
  name: string;
}

const MAX_LOGO_SIZE_KB = 500;
const MAX_LOGO_SIZE_BYTES = MAX_LOGO_SIZE_KB * 1024;

interface SettingsProps {
  isOwner: boolean;
  initialSettings: {
    language: string;
    default_branding: string;
    org_name: string;
    logo_url: string | null
    share_image_url: string
    share_title: string
    share_description: string
  }
  initialBrandingOptions: { id: string; name: string }[];
}

export default function SettingsContent({
  isOwner,
  initialSettings,
  initialBrandingOptions,
}: SettingsProps) {
  const [orgName, setOrgName] = useState(initialSettings.org_name);
  const [language, setLanguage] = useState(initialSettings.language);
  const [defaultBranding, setDefaultBranding] = useState(
    initialSettings.default_branding,
  );
  const [logoUrl, setLogoUrl] = useState<string | null>(
    initialSettings.logo_url,
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialSettings.logo_url,
  );
  const [brandingOptions, setBrandingOptions] = useState(
    initialBrandingOptions,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoError, setLogoError] = useState("")
  const [shareImageUrl, setShareImageUrl] = useState(
    initialSettings.share_image_url,
  )
  const [shareTitle, setShareTitle] = useState(initialSettings.share_title)
  const [shareDescription, setShareDescription] = useState(
    initialSettings.share_description,
  )

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoError("");

    if (file.size > MAX_LOGO_SIZE_BYTES) {
      setLogoError(`File too large. Maximum size is ${MAX_LOGO_SIZE_KB}KB.`);
      return;
    }

    if (!file.type.match(/^image\/(png|jpeg|svg\+xml|webp)$/)) {
      setLogoError("Only PNG, JPG, SVG, and WebP files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setLogoPreview(dataUrl);
      setLogoUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
    setLogoPreview(null);
  };

  async function handleSave() {
    setSaving(true);
    setSaved(false);

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
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else if (res.status === 403) {
        setLogoError("Only the organization owner can change settings.");
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  const brandingSelectOptions = [
    { value: "", label: "None (no default)" },
    ...brandingOptions.map((b) => ({ value: b.id, label: b.name })),
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your organization details and workspace preferences."
      />

      <div className="space-y-8">
        {/* Organization Settings Card */}
        <Panel>
          <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <Input
              label="Organization Name"
              id="org-name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. My Company"
              disabled={!isOwner}
            />

            {/* Workspace Logo */}
            {isOwner ? (
              <div className="flex flex-col gap-2">
                <FileUpload
                  label="Workspace Logo"
                  onChange={handleLogoChange}
                  preview={logoPreview}
                  onRemove={handleRemoveLogo}
                />
                {logoError && (
                  <p className="text-xs text-red-600">{logoError}</p>
                )}
              </div>
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
              <Select
                label="Language"
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={!isOwner}
                options={[
                  { value: "lt", label: "🇱🇹 Lithuanian" },
                  { value: "en", label: "🇬🇧 English" },
                ]}
              />
              <Select
                label="Default Branding"
                id="branding"
                value={defaultBranding}
                onChange={(e) => setDefaultBranding(e.target.value)}
                disabled={!isOwner}
                options={brandingSelectOptions}
              />
            </div>
          </div>

          {/* Save Footer */}
          {isOwner && (
            <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-[#f1f5f9] flex items-center justify-end gap-3">
              {saved && (
                <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <span className="material-symbols-outlined text-base">
                    check_circle
                  </span>
                  Saved!
                </span>
              )}
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}

          {!isOwner && (
            <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-[#f1f5f9]">
              <p className="text-sm text-[#94a3b8] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  lock
                </span>
                Settings can only be changed by the organization owner
              </p>
            </div>
          )}
        </Panel>

        {/* Security & Access */}
        <PasswordSection />

        {/* Social Sharing */}
        <Panel>
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="border-b border-[#f1f5f9] pb-4">
              <h2 className="text-lg font-semibold text-navy-900">
                Social Sharing
              </h2>
              <p className="text-sm text-[#94a3b8] mt-1">
                Configure how shared game results appear on social media.
              </p>
            </div>

            <Input
              label="Share Image URL"
              id="share-image-url"
              value={shareImageUrl}
              onChange={(e) => setShareImageUrl(e.target.value)}
              placeholder="https://example.com/share-image.jpg"
              disabled={!isOwner}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Share Title"
                id="share-title"
                value={shareTitle}
                onChange={(e) => setShareTitle(e.target.value)}
                placeholder="e.g. Kryžiažodis — {{time}}"
                disabled={!isOwner}
              />
              <Input
                label="Share Description"
                id="share-description"
                value={shareDescription}
                onChange={(e) => setShareDescription(e.target.value)}
                placeholder="e.g. Išspręsta per {{time}}!"
                disabled={!isOwner}
              />
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
          </div>

          {isOwner && (
            <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-[#f1f5f9] flex items-center justify-end gap-3">
              {saved && (
                <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <span className="material-symbols-outlined text-base">
                    check_circle
                  </span>
                  Saved!
                </span>
              )}
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel>
      <div className="p-4 sm:p-6 lg:p-8 pt-6 space-y-6">
        <div className="border-b border-[#f1f5f9] pb-4">
          <h2 className="text-lg font-semibold text-navy-900">
            Security & Access
          </h2>
        </div>

        <form
          ref={formRef}
          onSubmit={handleChangePassword}
          className="space-y-5 max-w-sm"
        >
          <Input
            label="Current Password"
            id="current-password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Input
            label="New Password"
            id="new-password"
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Input
            label="Confirm Password"
            id="confirm-password"
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-[4px] px-3 py-2">
              {error}
            </div>
          )}
        </form>
      </div>

      <div className="px-8 py-4 border-t border-[#f1f5f9] flex items-center justify-end gap-3">
        {success && (
          <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
            <span className="material-symbols-outlined text-base">
              check_circle
            </span>
            Password changed!
          </span>
        )}
        <Button
          variant="outline"
          onClick={() => formRef.current?.requestSubmit()}
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </Panel>
  );
}

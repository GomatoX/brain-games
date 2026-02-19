"use client";

import { useState, useEffect } from "react";

interface BrandingOption {
  id: string;
  name: string;
}

export default function SettingsContent() {
  const [language, setLanguage] = useState("lt");
  const [defaultBranding, setDefaultBranding] = useState("");
  const [brandingOptions, setBrandingOptions] = useState<BrandingOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    fetchBrandingPresets();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setLanguage(data.language || "lt");
        setDefaultBranding(data.default_branding || "");
      }
    } catch {
      // Defaults are fine
    } finally {
      setLoading(false);
    }
  }

  async function fetchBrandingPresets() {
    try {
      const res = await fetch("/api/branding");
      if (res.ok) {
        const data = await res.json();
        const presets = Array.isArray(data) ? data : [];
        setBrandingOptions(
          presets.map((b: { id: string; name: string }) => ({
            id: b.id,
            name: b.name || `Preset ${b.id}`,
          })),
        );
      }
    } catch {
      // ignore
    }
  }

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
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#e2e8f0] border-t-rust rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-serif text-[#0f172a]">
          Settings
        </h1>
        <p className="text-[#64748b] mt-1 text-sm">
          Configure your account preferences
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        {/* Language */}
        <div className="p-6 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg text-blue-600">
                language
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0f172a]">Language</h2>
              <p className="text-xs text-[#94a3b8]">
                Default language for the game engine
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage("lt")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                language === "lt"
                  ? "border-rust bg-rust/5 text-rust"
                  : "border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]"
              }`}
            >
              🇱🇹 Lietuvių
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                language === "en"
                  ? "border-rust bg-rust/5 text-rust"
                  : "border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]"
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Default Branding */}
        <div className="p-6 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg text-purple-600">
                palette
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0f172a]">
                Default Branding
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Pre-select branding preset for new games
              </p>
            </div>
          </div>
          <select
            value={defaultBranding}
            onChange={(e) => setDefaultBranding(e.target.value)}
            className="w-full max-w-xs px-3 py-2.5 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] bg-white focus:outline-none focus:border-rust focus:ring-1 focus:ring-rust/20 transition-all"
          >
            <option value="">None (no default)</option>
            {brandingOptions.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Save */}
        <div className="p-6 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rust hover:bg-rust-dark text-white text-sm font-semibold transition-all disabled:opacity-50 shadow-sm"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">
                  progress_activity
                </span>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">
                  save
                </span>
                Save Settings
              </>
            )}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
              <span className="material-symbols-outlined text-base">
                check_circle
              </span>
              Saved!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";
const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:5173";

export default function KeysContent({
  initialToken,
}: {
  initialToken: string | null;
}) {
  const [token, setToken] = useState<string | null>(initialToken);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate-token" }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
      }
    } catch {
      // ignore
    } finally {
      setGenerating(false);
    }
  }

  async function handleRevoke() {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke-token" }),
      });
      setToken(null);
    } catch {
      // ignore
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  const crosswordEmbed = `<!-- Load the game engine -->
<script src="${FRONTEND_URL}/dist/crossword-engine.iife.js"><\/script>

<!-- Drop in the Web Component -->
<crossword-game
  puzzle-id="latest"
  api-url="${API_URL}"
  ${token ? `token="${token}"` : 'token="YOUR_API_TOKEN"'}
  theme="light"></crossword-game>`;

  const wordGameEmbed = `<!-- Load the game engine -->
<script src="${FRONTEND_URL}/dist/word-game.iife.js"><\/script>

<!-- Drop in the Web Component -->
<word-game
  puzzle-id="latest"
  api-url="${API_URL}"
  ${token ? `token="${token}"` : 'token="YOUR_API_TOKEN"'}
  theme="light"></word-game>`;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-medium text-[#0f172a] mb-1">
          API Keys & Embed Codes
        </h1>
        <p className="text-[#64748b] text-sm">
          Manage your API access and get embed snippets for your site.
        </p>
      </div>

      {/* API Token */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-600 text-lg">
              key
            </span>
          </div>
          <h2 className="font-semibold text-[#0f172a]">API Token</h2>
        </div>
        <div className="p-5">
          {token ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <code className="flex-1 bg-slate-50 border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-sm text-[#0f172a] font-mono truncate">
                  {token}
                </code>
                <button
                  onClick={() => copyToClipboard(token, "token")}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-[#0f172a] transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">
                    {copied === "token" ? "check" : "content_copy"}
                  </span>
                  {copied === "token" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-[#64748b] flex-1">
                  Use this token to authenticate API requests. Keep it secret.
                </p>
                <button
                  onClick={handleRevoke}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Revoke Token
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#64748b]">
                No API token generated yet.
              </p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-4 py-2 bg-[#c25e40] hover:bg-[#a0492d] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {generating ? "Generating…" : "Generate Token"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Embed Codes */}
      <div className="flex flex-col gap-6">
        <EmbedCard
          title="Crossword"
          icon="grid_on"
          iconColor="bg-blue-50 text-blue-600"
          code={crosswordEmbed}
          copied={copied}
          onCopy={copyToClipboard}
        />
        <EmbedCard
          title="Word Game"
          icon="spellcheck"
          iconColor="bg-green-50 text-green-600"
          code={wordGameEmbed}
          copied={copied}
          onCopy={copyToClipboard}
        />
      </div>
    </div>
  );
}

function EmbedCard({
  title,
  icon,
  iconColor,
  code,
  copied,
  onCopy,
}: {
  title: string;
  icon: string;
  iconColor: string;
  code: string;
  copied: string | null;
  onCopy: (text: string, label: string) => void;
}) {
  const label = `embed-${title.toLowerCase().replace(/\s/g, "-")}`;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}
        >
          <span className="material-symbols-outlined text-lg">{icon}</span>
        </div>
        <h2 className="font-semibold text-[#0f172a]">{title} Embed Code</h2>
        <button
          onClick={() => onCopy(code, label)}
          className="ml-auto px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-[#0f172a] transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">
            {copied === label ? "check" : "content_copy"}
          </span>
          {copied === label ? "Copied!" : "Copy Snippet"}
        </button>
      </div>
      <div className="p-5">
        <pre className="bg-[#1e293b] text-slate-300 rounded-lg p-4 text-sm overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

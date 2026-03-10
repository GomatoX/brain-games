"use client";

import { useState } from "react";
import {
  Panel,
  PanelHeader,
  Button,
  PageHeader,
  CodeBlock,
} from "@/components/ui";

const API_URL = typeof window !== "undefined" ? window.location.origin : "";
const PLAY_BASE =
  typeof window !== "undefined" ? `${window.location.origin}/play` : "/play";

export default function KeysContent({
  initialToken,
  orgId,
  initialLang,
}: {
  initialToken: string | null;
  orgId: string;
  initialLang: string;
}) {
  const [token, setToken] = useState<string | null>(initialToken);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [lang] = useState(initialLang);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/auth-actions", {
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
      await fetch("/api/auth-actions", {
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

  const crosswordEmbed = `<script src="${PLAY_BASE}/dist/crossword-engine.iife.js"><\/script>

<crossword-game
  puzzle-id="latest"
  api-url="${API_URL}"
  userid="${orgId}"
  lang="${lang}"
  theme="light"></crossword-game>`;

  const wordGameEmbed = `<script src="${PLAY_BASE}/dist/word-game.iife.js"><\/script>

<word-game
  puzzle-id="latest"
  api-url="${API_URL}"
  userid="${orgId}"
  lang="${lang}"
  theme="light"></word-game>`;

  return (
    <div>
      <PageHeader
        title="Embed Codes"
        description="Copy and paste these snippets into your website to embed games."
      />

      {/* API Token */}
      <Panel className="mb-8">
        <PanelHeader title="API Token" />
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
                  Shared across your organization. Use this token to
                  authenticate API requests.
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
                className="px-4 py-2 bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white text-sm font-medium rounded-[4px] transition-colors"
              >
                {generating ? "Generating…" : "Generate Token"}
              </button>
            </div>
          )}
        </div>
      </Panel>

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
    <Panel>
      <PanelHeader
        title={`${title} Embed Code`}
        action={
          <Button
            size="sm"
            variant="secondary"
            icon={copied === label ? "check" : "content_copy"}
            onClick={() => onCopy(code, label)}
          >
            {copied === label ? "Copied!" : "Copy Snippet"}
          </Button>
        }
      />
      <div className="p-5">
        <CodeBlock code={code} />
      </div>
    </Panel>
  );
}

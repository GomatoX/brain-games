"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/PageHeader"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/ui/CodeBlock"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"

const API_URL = typeof window !== "undefined" ? window.location.origin : ""
const PLAY_BASE =
  typeof window !== "undefined" ? `${window.location.origin}/play` : "/play"

const KeysContent = ({
  initialToken,
  orgId,
  initialLang,
}: {
  initialToken: string | null
  orgId: string
  initialLang: string
}) => {
  const [token, setToken] = useState<string | null>(initialToken)
  const [generating, setGenerating] = useState(false)
  const [revoking, setRevoking] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const lang = initialLang

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch("/api/auth-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate-token" }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setToken(data.token)
        toast.success("API token generated")
      } else {
        toast.error(data.error || "Failed to generate token")
      }
    } catch {
      toast.error("Failed to generate token")
    } finally {
      setGenerating(false)
    }
  }

  const handleRevoke = async () => {
    setRevoking(true)
    try {
      const res = await fetch("/api/auth-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke-token" }),
      })
      if (res.ok) {
        setToken(null)
        toast.success("API token revoked")
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || "Failed to revoke token")
      }
    } catch {
      toast.error("Failed to revoke token")
    } finally {
      setRevoking(false)
    }
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const crosswordEmbed = `<script src="${PLAY_BASE}/dist/crossword-engine.iife.js"><\/script>

<crossword-game
  puzzle-id="latest"
  api-url="${API_URL}"
  userid="${orgId}"
  lang="${lang}"
  theme="light"></crossword-game>`

  const wordGameEmbed = `<script src="${PLAY_BASE}/dist/word-game-engine.iife.js"><\/script>

<word-game
  puzzle-id="latest"
  api-url="${API_URL}"
  userid="${orgId}"
  lang="${lang}"
  theme="light"></word-game>`

  const wordSearchEmbed = `<link rel="stylesheet" href="${PLAY_BASE}/dist/word-search-engine.css" />
<script src="${PLAY_BASE}/dist/word-search-engine.iife.js"><\/script>

<word-search-game
  puzzle-id="latest"
  api-url="${API_URL}"
  user-id="${orgId}"
  lang="${lang}"
  theme="light"></word-search-game>`

  return (
    <div>
      <PageHeader
        title="Embed Codes"
        description="Copy and paste these snippets into your website to embed games."
      />

      {/* API Token */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-[15px]">API Token</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          {token ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <code className="flex-1 bg-slate-50 border border-[#e2e8f0] rounded-lg px-3 sm:px-4 py-2.5 text-sm text-[#0f172a] font-mono break-all">
                  {token}
                </code>
                <Button
                  variant="secondary"
                  onClick={() => handleCopy(token, "token")}
                >
                  {copied === "token" ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  {copied === "token" ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <p className="text-xs text-[#64748b] flex-1">
                  Shared across your organization. Use this token to
                  authenticate API requests.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRevoke}
                  disabled={revoking}
                  className="text-red-600 hover:text-red-700 self-start sm:self-auto"
                >
                  {revoking ? "Revoking..." : "Revoke Token"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-[#64748b]">
                No API token generated yet.
              </p>
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="self-start sm:self-auto"
              >
                {generating ? "Generating…" : "Generate Token"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Embed Codes */}
      <div className="flex flex-col gap-6">
        <EmbedCard
          title="Crossword"
          code={crosswordEmbed}
          copied={copied}
          onCopy={handleCopy}
        />
        <EmbedCard
          title="Word Game"
          code={wordGameEmbed}
          copied={copied}
          onCopy={handleCopy}
        />
        <EmbedCard
          title="Word Search"
          code={wordSearchEmbed}
          copied={copied}
          onCopy={handleCopy}
        />
      </div>
    </div>
  )
}

const EmbedCard = ({
  title,
  code,
  copied,
  onCopy,
}: {
  title: string
  code: string
  copied: string | null
  onCopy: (text: string, label: string) => void
}) => {
  const label = `embed-${title.toLowerCase().replace(/\s/g, "-")}`
  const isCopied = copied === label

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[15px]">{title} Embed Code</CardTitle>
        <CardAction>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onCopy(code, label)}
          >
            {isCopied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            {isCopied ? "Copied!" : "Copy Snippet"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <CodeBlock code={code} />
      </CardContent>
    </Card>
  )
}

export default KeysContent

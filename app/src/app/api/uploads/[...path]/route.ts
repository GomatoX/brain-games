import { NextRequest, NextResponse } from "next/server"
import path from "node:path"
import { getStorage } from "@/lib/storage"

export async function GET(_req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params
  const filePath = parts.join("/")
  if (filePath.includes("..") || path.isAbsolute(filePath)) {
    return new NextResponse("Bad request", { status: 400 })
  }
  const storage = getStorage()
  const result = await storage.get(filePath)
  if (!result) return new NextResponse("Not found", { status: 404 })
  const blob = new Blob([new Uint8Array(result.data)], { type: result.mime })
  return new NextResponse(blob, {
    status: 200,
    headers: {
      "Content-Type": result.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}

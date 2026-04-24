import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { uploadedFiles } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { requireAuth } from "@/lib/api-auth"
import { getStorage } from "@/lib/storage"
import { sanitizeSvg } from "@/lib/branding/sanitize-svg"
import { createHash } from "node:crypto"

const MAX_BYTES = 2 * 1024 * 1024
const MAX_DIM = 2048

const ALLOWED_KINDS = ["logo", "logo-dark", "favicon", "background", "og-image"] as const
type Kind = (typeof ALLOWED_KINDS)[number]

const sniffMime = (buf: Buffer): string | null => {
  if (buf.length < 12) return null
  const head = buf.subarray(0, 12)
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) return "image/png"
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return "image/jpeg"
  if (head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46 && head[8] === 0x57) return "image/webp"
  // SVG: starts with "<?xml" or "<svg" possibly after BOM/whitespace
  const text = buf.subarray(0, 256).toString("utf8").trimStart()
  if (text.startsWith("<?xml") || text.startsWith("<svg")) return "image/svg+xml"
  return null
}

const decodeDimensions = (mime: string, buf: Buffer): { w: number; h: number } | null => {
  if (mime === "image/png") {
    if (buf.length < 24) return null
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
  }
  if (mime === "image/jpeg") {
    let i = 2
    while (i < buf.length) {
      if (buf[i] !== 0xff) return null
      const marker = buf[i + 1]
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8) {
        return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) }
      }
      const segLen = buf.readUInt16BE(i + 2)
      i += 2 + segLen
    }
    return null
  }
  if (mime === "image/webp") {
    if (buf.length < 30) return null
    return { w: 1 + (buf.readUInt16LE(26) & 0x3fff), h: 1 + (buf.readUInt16LE(28) & 0x3fff) }
  }
  // SVG: skip dimension check
  return { w: 0, h: 0 }
}

export async function POST(request: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const { orgId, userId } = result as { orgId: string; userId: string }

  const form = await request.formData()
  const file = form.get("file")
  const kind = form.get("kind")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 })
  }
  if (typeof kind !== "string" || !ALLOWED_KINDS.includes(kind as Kind)) {
    return NextResponse.json({ error: "invalid kind" }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "file too large (>2 MB)" }, { status: 400 })
  }

  let buf = Buffer.from(await file.arrayBuffer())
  const mime = sniffMime(buf)
  if (!mime) {
    return NextResponse.json({ error: "unsupported file type" }, { status: 400 })
  }

  if (mime === "image/svg+xml") {
    buf = Buffer.from(sanitizeSvg(buf.toString("utf8")), "utf8")
  } else {
    const dims = decodeDimensions(mime, buf)
    if (!dims) {
      return NextResponse.json({ error: "could not decode image dimensions" }, { status: 400 })
    }
    if (dims.w > MAX_DIM || dims.h > MAX_DIM) {
      return NextResponse.json({ error: `image too large (max ${MAX_DIM}px)` }, { status: 400 })
    }
  }

  const sha256 = createHash("sha256").update(buf).digest("hex")
  const existing = await db
    .select()
    .from(uploadedFiles)
    .where(and(eq(uploadedFiles.orgId, orgId), eq(uploadedFiles.sha256, sha256)))
    .limit(1)
  if (existing[0]) {
    return NextResponse.json({
      path: existing[0].path,
      sha256,
      size: existing[0].size,
      mime: existing[0].mime,
    })
  }

  const ext =
    mime === "image/png" ? ".png" :
    mime === "image/jpeg" ? ".jpg" :
    mime === "image/webp" ? ".webp" :
    mime === "image/svg+xml" ? ".svg" : ""

  const storage = getStorage()
  const put = await storage.put(`branding/${orgId}/${sha256}${ext}`, buf, mime)

  await db.insert(uploadedFiles).values({
    orgId,
    path: put.path,
    mime,
    size: buf.length,
    sha256,
    createdBy: userId,
  })

  return NextResponse.json({ path: put.path, sha256, size: buf.length, mime })
}

import { createHash } from "node:crypto"
import { promises as fs } from "node:fs"
import path from "node:path"
import type { StorageBackend, StorageGetResult, StoragePutResult } from "./types"

const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
}

export class LocalFsBackend implements StorageBackend {
  constructor(private rootDir: string) {}

  async put(key: string, data: Buffer, _mime: string): Promise<StoragePutResult> {
    const sha256 = createHash("sha256").update(data).digest("hex")
    const ext = path.extname(key) || ""
    const finalKey = key.includes(sha256) ? key : `${key.replace(ext, "")}-${sha256}${ext}`
    const abs = path.join(this.rootDir, finalKey)
    await fs.mkdir(path.dirname(abs), { recursive: true })
    await fs.writeFile(abs, data)
    return { path: finalKey, sha256 }
  }

  async get(filePath: string): Promise<StorageGetResult | null> {
    const abs = path.join(this.rootDir, filePath)
    try {
      const data = await fs.readFile(abs)
      const mime = MIME_BY_EXT[path.extname(filePath).toLowerCase()] || "application/octet-stream"
      return { data, mime }
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return null
      throw err
    }
  }

  async delete(filePath: string): Promise<void> {
    const abs = path.join(this.rootDir, filePath)
    await fs.rm(abs, { force: true })
  }
}

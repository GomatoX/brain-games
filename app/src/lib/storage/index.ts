import path from "node:path"
import { LocalFsBackend } from "./local-fs"
import type { StorageBackend } from "./types"

let _backend: StorageBackend | null = null

export function getStorage(): StorageBackend {
  if (_backend) return _backend
  const root =
    process.env.BRANDING_UPLOAD_ROOT ||
    path.join(process.cwd(), "data", "uploads")
  _backend = new LocalFsBackend(root)
  return _backend
}

export type { StorageBackend } from "./types"

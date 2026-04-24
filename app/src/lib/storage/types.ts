export interface StoragePutResult {
  path: string
  sha256: string
}

export interface StorageGetResult {
  data: Buffer
  mime: string
}

export interface StorageBackend {
  put(key: string, data: Buffer, mime: string): Promise<StoragePutResult>
  get(path: string): Promise<StorageGetResult | null>
  delete(path: string): Promise<void>
}

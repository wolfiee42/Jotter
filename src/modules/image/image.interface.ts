import { ObjectId } from 'mongoose'

export type TImage = {
  name: string
  _id?: ObjectId
  user: ObjectId
  folderId?: ObjectId
  properties: TImageProperties
}

export type UploadImageBody = {
  name: string
  folderId?: string | null
}

export type TImageProperties = {
  asset_id: string
  public_id: string
  version: number
  version_id: string
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: string[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  asset_folder: string
  display_name: string
  original_filename: string
  api_key: string
}

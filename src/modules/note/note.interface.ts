import { ObjectId } from 'mongoose'

export type TNote = {
    name: string
    _id?: ObjectId
    user: ObjectId
    folderId?: ObjectId
    properties: TNoteProperties
}

export type UploadNoteBody = {
    name: string
    folderId?: string | null
}

export type TNoteProperties = {
    asset_id: string
    public_id: string
    version: number
    version_id: string
    signature: string
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

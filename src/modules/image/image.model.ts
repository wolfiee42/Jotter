import { model, Schema } from 'mongoose'
import { TImage, TImageProperties } from './image.interface'

const imagePropertySchema = new Schema<TImageProperties>({
  asset_id: { type: String, required: true },
  public_id: { type: String, required: true },
  version: { type: Number, required: true },
  version_id: { type: String, required: true },
  signature: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  format: { type: String, required: true },
  resource_type: { type: String, required: true },
  created_at: { type: String, required: true },
  tags: { type: [String], default: [] },
  bytes: { type: Number, required: true },
  type: { type: String, required: true },
  etag: { type: String, required: true },
  placeholder: { type: Boolean, default: false },
  url: { type: String, required: true },
  secure_url: { type: String, required: true },
  asset_folder: { type: String, default: '' },
  display_name: { type: String, default: '' },
  original_filename: { type: String, default: '' },
  api_key: { type: String, default: '' },
})

const imageSchema = new Schema<TImage>(
  {
    name: {
      type: String,
      required: true,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    properties: {
      type: imagePropertySchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const ImageModel = model<TImage>('Image', imageSchema)

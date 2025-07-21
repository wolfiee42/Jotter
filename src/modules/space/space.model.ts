import { model, Schema } from 'mongoose'
import { TSpace } from './space.interface'

const spaceSchema = new Schema<TSpace>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    folderList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Folder',
        default: [],
      },
    ],
    imageList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Image',
        default: [],
      },
    ],
    noteList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Note',
        default: [],
      },
    ],
    pdfList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PDF',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
)

export const SpaceModel = model<TSpace>('Space', spaceSchema)

import { model, Schema } from 'mongoose'
import { TFolder } from './folder.interface'

const FolderSchema = new Schema<TFolder>(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    imageList: { type: [Schema.Types.ObjectId], ref: 'Image', default: [], required: true },
    pdfList: { type: [Schema.Types.ObjectId], ref: 'PDF', default: [], required: true },
    noteList: { type: [Schema.Types.ObjectId], ref: 'Note', default: [], required: true },
  }
  ,
  {
    timestamps: true
  }
)

export const FolderModel = model<TFolder>('Folder', FolderSchema)

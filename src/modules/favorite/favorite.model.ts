import { model, Schema } from 'mongoose'
import { TFavorite } from './favorite.interface'

const FavoriteSchema = new Schema<TFavorite>({
  user: { type: Schema.Types.ObjectId, required: true },
  folderList: [
    { type: Schema.Types.ObjectId, ref: 'Folder', default: [], required: true },
  ],
  noteList: [
    { type: Schema.Types.ObjectId, ref: 'Note', default: [], required: true },
  ],
  imageList: [
    { type: Schema.Types.ObjectId, ref: 'Image', default: [], required: true },
  ],
  pdfList: [
    { type: Schema.Types.ObjectId, ref: 'PDF', default: [], required: true },
  ],
})

export const FavoriteModel = model<TFavorite>('Favorite', FavoriteSchema)

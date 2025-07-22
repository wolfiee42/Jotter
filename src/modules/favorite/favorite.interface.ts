import { ObjectId } from 'mongoose'

export type TFavorite = {
  _id?: ObjectId
  user: ObjectId
  folderList: ObjectId[]
  noteList: ObjectId[]
  imageList: ObjectId[]
  pdfList: ObjectId[]
}

import { ObjectId } from 'mongoose'

export type TSpace = {
  _id?: ObjectId
  user: ObjectId
  folderList: ObjectId[]
  imageList: ObjectId[]
  noteList: ObjectId[]
  pdfList: ObjectId[]
  createdAt?: Date
  updatedAt?: Date
}

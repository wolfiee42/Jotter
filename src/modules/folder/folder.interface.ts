import { ObjectId } from 'mongoose'

export type TFolder = {
  _id?: ObjectId
  name: string
  user: ObjectId
  imageList: ObjectId[]
  pdfList: ObjectId[]
  noteList: ObjectId[]
}

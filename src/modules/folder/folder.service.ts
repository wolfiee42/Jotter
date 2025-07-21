import { ObjectId } from 'mongoose'
import { FolderModel } from './folder.model'
import { SpaceModel } from '../space/space.model'
import { TFolder } from './folder.interface'

const createFolder = async (
  name: string,
  userId: ObjectId,
): Promise<TFolder> => {
  const createFolder = await FolderModel.create({ name, user: userId })

  const space = await SpaceModel.findOne({ user: userId })
  if (!space) {
    throw new Error('Space not found')
  }

  space.folderList.push(createFolder._id)
  await space.save()

  return createFolder
}

export const FolderService = { createFolder }

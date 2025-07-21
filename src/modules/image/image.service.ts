import { UploadApiResponse } from 'cloudinary'
import cloudinary from '../../config/cloudinary'
import { TImage, UploadImageBody } from './image.interface'
import { ImageModel } from './image.model'
import { SpaceModel } from '../space/space.model'
import { ObjectId } from 'mongoose'
import { FolderModel } from '../folder/folder.model'

const uploadToCloudinary = async (
  fileBuffer: ArrayBufferLike,
): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: 'auto', folder: 'images' },
        (err: Error | undefined, result: UploadApiResponse | undefined) => {
          if (err) return reject(err)
          resolve(result)
        },
      )
      .end(fileBuffer as Buffer)
  })
}

const uploadFileService = async (
  file: { buffer: ArrayBufferLike },
  body: UploadImageBody,
  userId: ObjectId,
): Promise<TImage> => {
  const fileUrl: UploadApiResponse | undefined = await uploadToCloudinary(
    file.buffer,
  )

  const savedFile = await ImageModel.create({
    name: body.name,
    user: userId,
    folderId: body.folderId ? body.folderId : null,
    properties: fileUrl,
  })

  return savedFile
}

const updateSpaceWithImage = async (
  imageId: ObjectId,
  userId: ObjectId,
): Promise<void> => {
  const space = await SpaceModel.findOne({ user: userId })
  if (!space) {
    throw new Error('Space not found')
  }

  space.imageList.push(imageId)
  await space.save()
}
const updateFolderWithImage = async (
  imageId: ObjectId,
  folderId: ObjectId,
): Promise<void> => {
  const folder = await FolderModel.findById(folderId)
  if (!folder) {
    throw new Error('Folder not found')
  }
  folder?.imageList.push(imageId)
  await folder.save()
}

export const imageService = {
  uploadFileService,
  updateSpaceWithImage,
  updateFolderWithImage,
}

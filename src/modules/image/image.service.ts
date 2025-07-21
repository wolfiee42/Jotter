import { UploadApiResponse } from 'cloudinary'
import cloudinary from '../../config/cloudinary'
import { TImage, UploadImageBody } from './image.interface'
import { ImageModel } from './image.model'

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
): Promise<TImage> => {
  const fileUrl: UploadApiResponse | undefined = await uploadToCloudinary(
    file.buffer,
  )
  const savedFile = await ImageModel.create({
    name: body.name,
    folderId: body.folderId ? body.folderId : null,
    properties: fileUrl,
  })

  return savedFile
}

export const imageService = {
  uploadFileService,
}

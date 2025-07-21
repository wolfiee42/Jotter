import cloudinary from '../../config/cloudinary'

export async function handleImageUpload(filePath: string): Promise<any> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'images',
  })
  return result
}

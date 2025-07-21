import { z } from 'zod'

const imageUploadValidation = z.object({
  name: z.string().min(1, 'Image name is required'),
  folderId: z.string().min(1, 'Folder ID is required').optional(),
})

export const ImageValidation = {
  imageUploadValidation,
}

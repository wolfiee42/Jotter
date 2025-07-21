import { z } from 'zod'

const createFolderValidation = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Folder name is required'),
    })
    .strict(),
})

export const FolderValidation = {
  createFolderValidation,
}

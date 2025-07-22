import { z } from 'zod'

const updateImageValidation = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Image name is required'),
    })
    .strict(),
})

export const imageValidation = { updateImageValidation }

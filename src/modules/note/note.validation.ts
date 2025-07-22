import { z } from 'zod'

const updateNoteValidation = z.object({
  body: z
    .object({
      name: z.string().min(1, 'Note Title is required'),
    })
    .strict(),
})

export const noteValidation = { updateNoteValidation }

import { Router } from 'express'
import upload from '../../middleware/multer'
import Authentication from '../../middleware/authentication'
import { Authorize } from '../../middleware/authorize'
import { NoteController } from './note.controller'
import validateRequest from '../../middleware/validateRequest'
import { noteValidation } from './note.validation'

const router = Router()

router.post(
  '/upload',
  upload.single('note'),
  Authentication,
  Authorize({ role: 'user' }),
  NoteController.uploadNoteController,
)

router.get(
  '/all',
  Authentication,
  Authorize({ role: 'user' }),
  NoteController.getAllNote,
)

router.get(
  '/:id',
  Authentication,
  Authorize({ role: 'user' }),
  NoteController.getSingleNotes,
)

router.patch(
  '/update/:id',
  Authentication,
  Authorize({ role: 'user' }),
  validateRequest(noteValidation.updateNoteValidation),
  NoteController.updateNoteController,
)

router.delete(
  '/:id/delete',
  Authentication,
  Authorize({ role: 'user' }),
  NoteController.deleteNoteController,
)

router.post(
  '/:id/duplicate',
  Authentication,
  Authorize({ role: 'user' }),
  NoteController.duplicateNoteController,
)

router.patch(
  '/:id/connect-folder',
  Authentication,
  Authorize({ role: 'user' }),
  NoteController.connectNoteToFolderController,
)

router.patch(
  '/:id/favorite',
  Authentication,
  Authorize({ role: 'user' }),
  NoteController.makeNoteFavorite,
)

router.patch(
  '/:id/unfavorite',
  Authentication,
  Authorize({ role: 'user' }),
  NoteController.unfavoriteNote,
)

export const NoteRouter = router

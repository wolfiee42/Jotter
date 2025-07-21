import { Router } from 'express'
import upload from '../../middleware/multer'
import Authentication from '../../middleware/authentication'
import { Authorize } from '../../middleware/authorize'
import { NoteController } from './note.controller'

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
    NoteController.getAllNote
)

router.get('/:id',
    Authentication,
    Authorize({ role: 'user' }),
    NoteController.getSingleNotes
)

export const NoteRouter = router

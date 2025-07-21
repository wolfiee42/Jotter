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

export const NoteRouter = router

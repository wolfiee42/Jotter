import { Router } from 'express'
import { imageController } from './image.controller'
import upload from '../../middleware/multer'
import Authentication from '../../middleware/authentication'
import { Authorize } from '../../middleware/authorize'

const router = Router()

router.post(
  '/upload',
  upload.single('image'),
  Authentication,
  Authorize({ role: 'user' }),
  imageController.uploadImageController,
)

export const ImageRouter = router

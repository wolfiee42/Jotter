import { Router } from 'express'
import { imageController } from './image.controller'
import upload from '../../middleware/multer'
import Authentication from '../../middleware/authentication'

const router = Router()

router.post(
  '/upload',
  upload.single('image'),
  Authentication,
  imageController.uploadImageController,
)

export const ImageRouter = router

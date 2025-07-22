import { Router } from 'express'
import { imageController } from './image.controller'
import upload from '../../middleware/multer'
import Authentication from '../../middleware/authentication'
import { Authorize } from '../../middleware/authorize'
import validateRequest from '../../middleware/validateRequest'
import { imageValidation } from './image.validation'

const router = Router()

router.post(
  '/upload',
  upload.single('image'),
  Authentication,
  Authorize({ role: 'user' }),
  imageController.uploadImageController,
)

router.get(
  '/all',
  Authentication,
  Authorize({ role: 'user' }),
  imageController.getAllImages,
)

router.get(
  '/:id',
  Authentication,
  Authorize({ role: 'user' }),
  imageController.getSingleImage,
)

router.patch(
  '/update/:id',
  Authentication,
  Authorize({ role: 'user' }),
  validateRequest(imageValidation.updateImageValidation),
  imageController.updateImageController,
)

export const ImageRouter = router

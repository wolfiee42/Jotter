import { Router } from 'express'
import validateRequest from '../../middleware/validateRequest'
import { FolderValidation } from './folder.validation'
import { FolderController } from './folder.controller'
import Authentication from '../../middleware/authentication'
import { Authorize } from '../../middleware/authorize'

const router = Router()

router.post(
  '/create',
  Authentication,
  Authorize({ role: 'user' }),
  validateRequest(FolderValidation.createFolderValidation),
  FolderController.createFolderController,
)

export const folderRoute = router

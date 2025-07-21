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

router.get(
  '/all',
  Authentication,
  Authorize({ role: 'user' }),
  FolderController.getAllFolders
)

router.get('/:id', Authentication, Authorize({ role: 'user' }), FolderController.getSingleFolder)

export const folderRoute = router

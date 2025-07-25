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
  FolderController.getAllFolders,
)

router.get(
  '/:id',
  Authentication,
  Authorize({ role: 'user' }),
  FolderController.getSingleFolder,
)

router.patch(
  '/update/:id',
  Authentication,
  Authorize({ role: 'user' }),
  validateRequest(FolderValidation.updateFolderValidation),
  FolderController.updateFolderController,
)

router.delete(
  '/:id/delete',
  Authentication,
  Authorize({ role: 'user' }),
  FolderController.deleteFolderController,
)

router.patch(
  '/:id/favorite',
  Authentication,
  Authorize({ role: 'user' }),
  FolderController.makeFolderFavorite,
)

router.patch(
  '/:id/unfavorite',
  Authentication,
  Authorize({ role: 'user' }),
  FolderController.unfavoriteFolder,
)

export const folderRoute = router

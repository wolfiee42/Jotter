import { Router } from 'express'
import upload from '../../middleware/multer'
import Authentication from '../../middleware/authentication'
import { Authorize } from '../../middleware/authorize'
import { PDFController } from './pdf.controller'

const router = Router()

router.post(
  '/upload',
  upload.single('pdf'),
  Authentication,
  Authorize({ role: 'user' }),
  PDFController.uploadPDFController,
)

router.get(
  '/all',
  Authentication,
  Authorize({ role: 'user' }),
  PDFController.getAllPDF,
)

router.get(
  '/:id',
  Authentication,
  Authorize({ role: 'user' }),
  PDFController.getSinglePDF,
)

router.patch(
  '/update/:id',
  Authentication,
  Authorize({ role: 'user' }),
  PDFController.updatePDFController,
)

router.delete(
  '/:id/delete',
  Authentication,
  Authorize({ role: 'user' }),
  PDFController.deletePDFController,
)

router.post(
  '/:id/duplicate',
  Authentication,
  Authorize({ role: 'user' }),
  PDFController.duplicatePDFController,
)

router.patch(
  '/:id/connect-folder',
  Authentication,
  Authorize({ role: 'user' }),
  PDFController.connectPDFToFolderController,
)

router.patch(
  '/:id/favorite',
  Authentication,
  Authorize({ role: 'user' }),
  PDFController.makePDFFavorite,
)

router.patch(
  '/:id/unfavorite',
  Authentication,
  Authorize({ role: 'user' }),
  PDFController.unfavoritePDF,
)

export const PDFRouter = router

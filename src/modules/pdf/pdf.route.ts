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
    PDFController.getAllPDF
)

export const PDFRouter = router

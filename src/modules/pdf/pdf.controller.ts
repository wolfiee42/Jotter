import { Request, Response } from 'express'
import mongoose from 'mongoose'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { ObjectId } from 'mongoose'
import { PDFService } from './pdf.service'
import { PDFModel } from './pdf.model'
import { FolderModel } from '../folder/folder.model'
import { FavoriteModel } from '../favorite/favorite.model'

const uploadPDFController = catchAsync(async (req: Request, res: Response) => {
  const body = JSON.parse(req.body.data || '{}')
  const id = req.user?.id
  const file = req.file
  if (!file) {
    throw new Error('No file uploaded')
  }

  // Use a session for transactional consistency
  const session = await mongoose.startSession()
  let savedFile
  try {
    await session.withTransaction(async () => {
      savedFile = await PDFService.uploadFileService(file, body, id)
      await PDFService.updateSpaceWithPDF(
        savedFile._id as ObjectId,
        id as ObjectId,
        session,
      )
      if (body.folderId) {
        await PDFService.updateFolderWithPDF(
          savedFile._id as ObjectId,
          body.folderId as ObjectId,
          session,
        )
      }
    })
    sendResponse(res, {
      success: true,
      message: 'PDF uploaded successfully',
      statusCode: 201,
      data: savedFile,
    })
  } finally {
    await session.endSession()
  }
})

const getAllPDF = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id
  const allPDFs = await PDFModel.find({ user: id }).select('name updatedAt ')
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'All Pdfs Retrived successfully.',
    data: allPDFs,
  })
})

const getSinglePDF = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id

  const PDF = await PDFModel.findOne({ user: userId, _id: id }).select(
    'name createdAt properties.secure_url properties.bytes',
  )
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'PDF Retrived Successfully.',
    data: PDF,
  })
})

const updatePDFController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id
  const body = req.body

  const updatedPDF = await PDFModel.findOneAndUpdate(
    { user: userId, _id: id },
    { name: body.name },
    { new: true },
  ).select('name updatedAt properties.secure_url properties.bytes')

  if (!updatedPDF) {
    throw new Error('PDF not found')
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'PDF updated successfully',
    data: updatedPDF,
  })
})

const deletePDFController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id

  const pdf = await PDFModel.findOne({ user: userId, _id: id })

  if (!pdf) {
    throw new Error('PDF not found')
  }

  if (pdf.folderId) {
    await FolderModel.updateOne(
      { _id: pdf.folderId },
      { $pull: { pdfList: pdf._id } },
    )
  }

  await PDFModel.deleteOne({ _id: id })

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'PDF deleted successfully',
  })
})

const duplicatePDFController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id
    const id = req.params.id
    const { name } = req.body

    const pdf = await PDFModel.findOne({ user: userId, _id: id })
    if (!pdf) {
      throw new Error(
        'PDF not found or you do not have permission to duplicate it',
      )
    }

    const duplicatedPDF = await PDFModel.create({
      user: pdf.user,
      name: name || pdf.name + ' (Copy)',
      properties: pdf.properties,
      folderId: pdf.folderId || null,
    })

    if (duplicatedPDF.folderId) {
      await FolderModel.updateOne(
        { _id: duplicatedPDF.folderId },
        { $push: { pdfList: duplicatedPDF._id } },
      )
    }

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: 'PDF duplicated successfully.',
      data: duplicatedPDF,
    })
  },
)

const connectPDFToFolderController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id
    const pdfId = req.params.id
    const { folderId } = req.body

    if (!folderId) {
      throw new Error('No folderId provided')
    }

    const pdf = await PDFModel.findOne({ user: userId, _id: pdfId })
    if (!pdf) {
      throw new Error(
        'PDF not found or you do not have permission to connect it',
      )
    }

    if (pdf.folderId) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: 'PDF is already linked to a folder.',
      })
    }

    pdf.folderId = folderId
    await pdf.save()

    await FolderModel.updateOne(
      { _id: folderId },
      { $addToSet: { pdfList: pdf._id } },
    )

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'PDF connected to folder successfully.',
      data: pdf,
    })
  },
)
const makePDFFavorite = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id

  const pdf = await PDFModel.findOne({ _id: id, user: userId })
  if (!pdf) {
    throw new Error('PDF not found')
  }

  const favourite = await FavoriteModel.findOne({ user: userId })
  if (!favourite) {
    throw new Error('Favorite not found')
  }

  if (favourite.pdfList.includes(pdf._id)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'PDF is already favorited',
    })
  }

  favourite.pdfList.push(pdf._id)
  await favourite.save()

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'PDF favorite status updated successfully',
    data: pdf,
  })
})

const unfavoritePDF = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id

  const pdf = await PDFModel.findOne({ _id: id, user: userId })
  if (!pdf) {
    throw new Error('PDF not found')
  }

  const favourite = await FavoriteModel.findOne({ user: userId })
  if (!favourite) {
    throw new Error('Favorite not found')
  }

  if (!favourite.pdfList.includes(pdf._id)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'PDF is not favorited',
    })
  }

  favourite.pdfList = favourite.pdfList.filter(
    pdfId => pdfId.toString() !== pdf._id.toString(),
  )
  await favourite.save()

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'PDF unfavorited successfully',
    data: pdf,
  })
})

export const PDFController = {
  uploadPDFController,
  getAllPDF,
  getSinglePDF,
  updatePDFController,
  deletePDFController,
  duplicatePDFController,
  connectPDFToFolderController,
  makePDFFavorite,
  unfavoritePDF,
}

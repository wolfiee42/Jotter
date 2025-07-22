import { Request, Response } from 'express'
import AppError from '../../errors/appError'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { FolderModel } from '../folder/folder.model'
import { NoteModel } from '../note/note.model'
import { ImageModel } from '../image/image.model'
import { PDFModel } from '../pdf/pdf.model'

const getAllDocByDate = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const { date } = req.query
  const start = new Date(date as string)
  const end = new Date(start)
  end.setDate(start.getDate() + 1)

  if (!date) {
    throw new AppError(400, 'Date is required')
  }

  const folders = await FolderModel.find({
    user: userId,
    createdAt: { $gte: start, $lt: end },
  }).select('name createdAt')

  const notes = await NoteModel.find({
    user: userId,
    createdAt: { $gte: start, $lt: end },
  }).select('name createdAt properties.secure_url properties.bytes')

  const images = await ImageModel.find({
    user: userId,
    createdAt: { $gte: start, $lt: end },
  }).select(
    'name createdAt properties.secure_url properties.bytes properties.width properties.height properties.format',
  )

  const pdfs = await PDFModel.find({
    user: userId,
    createdAt: { $gte: start, $lt: end },
  }).select('name createdAt properties.secure_url properties.bytes')

  if (
    folders.length === 0 &&
    notes.length === 0 &&
    images.length === 0 &&
    pdfs.length === 0
  ) {
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'No documents found for the specified date',
    })
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Documents retrieved successfully',
    data: { folders, notes, pdfs, images },
  })
})

export const calenderController = {
  getAllDocByDate,
}

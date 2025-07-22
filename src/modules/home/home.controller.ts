import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { SpaceModel } from '../space/space.model'
import { ImageModel } from '../image/image.model'
import { NoteModel } from '../note/note.model'
import { PDFModel } from '../pdf/pdf.model'

import {
  formatBytes,
  getFolderListAndTotalSize,
  getImageListAndTotalSize,
  getNoteListAndTotalSize,
  getPDFListAndTotalSize,
} from './home.util'

const getData = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id
  const space = await SpaceModel.findOne({ user: id })
  if (!space) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Space not found',
    })
  }

  // Calculate imageList and total size
  const {
    totalSize: imageTotalSize,
    unit: imageUnit,
    totalCount: imageTotalCount,
  } = await getImageListAndTotalSize(space.imageList)

  const {
    totalSize: noteTotalSize,
    unit: noteUnit,
    totalCount: noteTotalCount,
  } = await getNoteListAndTotalSize(space.noteList)

  const {
    totalSize: pdfTotalSize,
    unit: pdfUnit,
    totalCount: pdfTotalCount,
  } = await getPDFListAndTotalSize(space.pdfList)

  const { totalSize, unit, totalCount } = await getFolderListAndTotalSize(
    space.folderList,
  )

  const totalUsedSpace =
    (imageTotalSize as number) + noteTotalSize + pdfTotalSize + totalSize

  const totalAvailableSpaceBytes = 15 * 1000 * 1000 * 1000 - totalUsedSpace

  const totalAvailableSpace = formatBytes(totalAvailableSpaceBytes)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Space found',
    data: {
      totalAvailableSpace,
      folder: { totalSize, unit, totalCount },
      image: {
        totalSize: imageTotalSize,
        unit: imageUnit,
        totalCount: imageTotalCount,
      },
      note: {
        totalSize: noteTotalSize,
        unit: noteUnit,
        totalCount: noteTotalCount,
      },
      pdf: {
        totalSize: pdfTotalSize,
        unit: pdfUnit,
        totalCount: pdfTotalCount,
      },
    },
  })
})

const getRecentUploads = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id
  const space = await SpaceModel.findOne({ user: id })
  if (!space) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Space not found',
    })
  }

  // Get the 5 most recent IDs for each type
  const recentImageIds = (space.imageList || []).slice(0, 5)
  const recentNoteIds = (space.noteList || []).slice(0, 5)
  const recentPDFIds = (space.pdfList || []).slice(0, 5)

  // Fetch the details for each
  const [recentImages, recentNotes, recentPDFs] = await Promise.all([
    ImageModel.find({ _id: { $in: recentImageIds } }).select('name createdAt'),
    NoteModel.find({ _id: { $in: recentNoteIds } }).select('name createdAt'),
    PDFModel.find({ _id: { $in: recentPDFIds } }).select('name createdAt'),
  ])

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recent uploads fetched',
    data: {
      images: recentImages,
      notes: recentNotes,
      pdfs: recentPDFs,
    },
  })
})

export const HomeController = { getData, getRecentUploads }

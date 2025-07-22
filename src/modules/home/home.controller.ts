import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { SpaceModel } from '../space/space.model'
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

export const HomeController = { getData }

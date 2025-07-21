import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { FolderService } from './folder.service'

const createFolderController = catchAsync(
  async (req: Request, res: Response) => {
    const { name } = req.body
    const userId = req.user?.id

    const createFolder = await FolderService.createFolder(name, userId)

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Folder created successfully',
      data: {
        createFolder,
      },
    })
  },
)

export const FolderController = { createFolderController }

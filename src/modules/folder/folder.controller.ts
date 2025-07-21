import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { FolderService } from './folder.service'
import { FolderModel } from './folder.model'

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

const getAllFolders = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id;
  const allFolders = await FolderModel.find({ user: id }).select("name updatedAt ")
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All Folders Retrived successfully.",
    data: allFolders
  })
})


export const FolderController = { createFolderController, getAllFolders }

import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { FolderService } from './folder.service'
import { FolderModel } from './folder.model'
import AppError from '../../errors/appError'

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
  const id = req.user?.id
  const allFolders = await FolderModel.find({ user: id }).select(
    'name updatedAt ',
  )
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'All Folders Retrived successfully.',
    data: allFolders,
  })
})

const getSingleFolder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id

  const folder = await FolderModel.findOne({ _id: id, user: userId })
    .populate({
      path: 'imageList',
      select:
        'name createdAt properties.secure_url properties.bytes properties.width properties.height properties.format',
    })
    .populate({
      path: 'noteList',
      select: 'name createdAt properties.secure_url properties.bytes',
    })
    .populate({
      path: 'pdfList',
      select: 'name createdAt properties.secure_url properties.bytes',
    })
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Folder Retrived successfully.',
    data: folder,
  })
})

const updateFolderController = catchAsync(
  async (req: Request, res: Response) => {
    const { name } = req.body
    const userId = req.user?.id
    const id = req.params.id

    const updatedFolder = await FolderModel.findOneAndUpdate(
      { _id: id, user: userId },
      { name },
      { new: true },
    )

    if (!updatedFolder) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'Folder not found',
      })
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Folder updated successfully',
      data: {
        updatedFolder,
      },
    })
  },
)

const deleteFolderController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id
    const id = req.params.id

    const folder = await FolderModel.findOne({ user: userId, _id: id })

    if (!folder) {
      throw new AppError(404, 'No Folder Found')
    }

    if (
      (folder.imageList && folder.imageList.length > 0) ||
      (folder.pdfList && folder.pdfList.length > 0) ||
      (folder.noteList && folder.noteList.length > 0)
    ) {
      throw new AppError(
        400,
        'Cannot delete folder: Remove all images, notes, and PDFs first.',
      )
    }
    const deleteFolder = await FolderModel.deleteOne({ _id: id })
    if (!deleteFolder) {
      throw new AppError(404, 'Did not able t Delete folder.')
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Folder updated successfully',
    })
  },
)

export const FolderController = {
  createFolderController,
  getAllFolders,
  getSingleFolder,
  updateFolderController,
  deleteFolderController,
}

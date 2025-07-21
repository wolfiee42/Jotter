import { Request, Response } from 'express'
import { imageService } from './image.service'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { ObjectId } from 'mongoose'

const uploadImageController = catchAsync(
  async (req: Request, res: Response) => {
    const body = JSON.parse(req.body.data || '{}')
    const id = req.user?.id
    const file = req.file;

    if (!file) {
      throw new Error('No file uploaded')
    }

    const savedFile = await imageService.uploadFileService(file, body, id)
    await imageService.updateSpaceWithImage(
      savedFile._id as ObjectId,
      id as ObjectId,
    )
    if (body.folderId) {
      await imageService.updateFolderWithImage(
        savedFile._id as ObjectId,
        body.folderId as ObjectId,
      )
    }
    sendResponse(res, {
      success: true,
      message: 'Image uploaded successfully',
      statusCode: 201,
      data: savedFile,
    })
  },
)

export const imageController = {
  uploadImageController,
}

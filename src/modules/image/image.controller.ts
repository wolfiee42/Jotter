import { Request, Response } from 'express'
import { imageService } from './image.service'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'

const uploadImageController = catchAsync(
  async (req: Request, res: Response) => {
    const body = JSON.parse(req.body.data || '{}')

    const file = req.file
    if (!file) {
      throw new Error('No file uploaded')
    }

    const savedFile = await imageService.uploadFileService(file, body)
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

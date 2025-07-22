import { Request, Response } from 'express'
import { imageService } from './image.service'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { ObjectId } from 'mongoose'
import { ImageModel } from './image.model'

const uploadImageController = catchAsync(
  async (req: Request, res: Response) => {
    const body = JSON.parse(req.body.data || '{}')
    const id = req.user?.id
    const file = req.file

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

const getAllImages = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id
  const allImages = await ImageModel.find({ user: id }).select('name updatedAt')
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'All Images Retrived Successfully.',
    data: allImages,
  })
})

const getSingleImage = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id

  const image = await ImageModel.findOne({ user: userId, _id: id }).select(
    'name createdAt properties.secure_url properties.bytes properties.width properties.height properties.format',
  )
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Image Retrived Successfully.',
    data: image,
  })
})

const updateImageController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id
    const id = req.params.id
    const { name } = req.body

    const updatedImage = await ImageModel.findOneAndUpdate(
      { user: userId, _id: id },
      { name },
      { new: true },
    )

    if (!updatedImage) {
      throw new Error(
        'Image not found or you do not have permission to update it',
      )
    }

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Image Updated Successfully.',
      data: updatedImage,
    })
  },
)

export const imageController = {
  uploadImageController,
  getAllImages,
  getSingleImage,
  updateImageController,
}

import { Request, Response } from 'express'
import { imageService } from './image.service'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { ObjectId } from 'mongoose'
import { ImageModel } from './image.model'
import { FolderModel } from '../folder/folder.model'
import { FavoriteModel } from '../favorite/favorite.model'

const uploadImageController = catchAsync(
  async (req: Request, res: Response) => {
    const body = JSON.parse(req.body.data || '{}')
    const id = req.user?.id
    const file = req.file

    if (!file) {
      throw new Error('No file uploaded')
    }

    const session = await ImageModel.startSession()
    session.startTransaction()
    try {
      const savedFile = await imageService.uploadFileService(file, body, id)
      await imageService.updateSpaceWithImage(
        savedFile._id as ObjectId,
        id as ObjectId,
        session,
      )
      if (body.folderId) {
        await imageService.updateFolderWithImage(
          savedFile._id as ObjectId,
          body.folderId as ObjectId,
          session,
        )
      }
      await session.commitTransaction()
      sendResponse(res, {
        success: true,
        message: 'Image uploaded successfully',
        statusCode: 201,
        data: savedFile,
      })
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
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

const deleteImageController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id
    const id = req.params.id

    const image = await ImageModel.findOne({ user: userId, _id: id })

    if (!image) {
      throw new Error(
        'Image not found or you do not have permission to delete it',
      )
    }

    await FolderModel.updateOne(
      { _id: image.folderId },
      { $pull: { imageList: image._id } },
    )

    await ImageModel.deleteOne({ _id: id })

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Image Deleted Successfully.',
    })
  },
)

const duplicateImageController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id
    const id = req.params.id
    const { name } = req.body

    const image = await ImageModel.findOne({ user: userId, _id: id })
    if (!image) {
      throw new Error(
        'Image not found or you do not have permission to duplicate it',
      )
    }

    const duplicatedImage = await ImageModel.create({
      user: image.user,
      name: name || image.name + ' (Copy)',
      properties: image.properties,
      folderId: image.folderId || null,
    })

    if (duplicatedImage.folderId) {
      await FolderModel.updateOne(
        { _id: duplicatedImage.folderId },
        { $push: { imageList: duplicatedImage._id } },
      )
    }

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: 'Image duplicated successfully.',
      data: duplicatedImage,
    })
  },
)

const connectImageToFolderController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id
    const imageId = req.params.id
    const { folderId } = req.body

    if (!folderId) {
      throw new Error('No folderId provided')
    }

    const image = await ImageModel.findOne({ user: userId, _id: imageId })
    if (!image) {
      throw new Error(
        'Image not found or you do not have permission to connect it',
      )
    }

    if (image.folderId) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: 'Image is already linked to a folder.',
      })
    }

    image.folderId = folderId
    await image.save()

    await FolderModel.updateOne(
      { _id: folderId },
      { $addToSet: { imageList: image._id } },
    )

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Image connected to folder successfully.',
      data: image,
    })
  },
)

const makeImageFavorite = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id
  const session = await ImageModel.startSession()
  session.startTransaction()
  try {
    const image = await ImageModel.findOne({ _id: id, user: userId }).session(
      session,
    )
    if (!image) {
      throw new Error('Image not found')
    }

    const favourite = await FavoriteModel.findOne({ user: userId }).session(
      session,
    )
    if (!favourite) {
      throw new Error('Favorite not found')
    }

    if (favourite.imageList.includes(image._id)) {
      await session.abortTransaction()
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: 'Image is already favorited',
      })
    }

    favourite.imageList.push(image._id)
    await favourite.save({ session })
    await session.commitTransaction()
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Image favorite status updated successfully',
      data: image,
    })
  } catch (err) {
    await session.abortTransaction()
    throw err
  } finally {
    session.endSession()
  }
})

const unfavoriteImage = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id
  const session = await ImageModel.startSession()
  session.startTransaction()
  try {
    const image = await ImageModel.findOne({ _id: id, user: userId }).session(
      session,
    )
    if (!image) {
      throw new Error('Image not found')
    }

    const favourite = await FavoriteModel.findOne({ user: userId }).session(
      session,
    )
    if (!favourite) {
      throw new Error('Favorite not found')
    }

    if (!favourite.imageList.includes(image._id)) {
      await session.abortTransaction()
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: 'Image is not favorited',
      })
    }

    favourite.imageList = favourite.imageList.filter(
      imageId => imageId.toString() !== image._id.toString(),
    )
    await favourite.save({ session })
    await session.commitTransaction()
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Image unfavorited successfully',
      data: image,
    })
  } catch (err) {
    await session.abortTransaction()
    throw err
  } finally {
    session.endSession()
  }
})

export const imageController = {
  uploadImageController,
  getAllImages,
  getSingleImage,
  updateImageController,
  deleteImageController,
  duplicateImageController,
  connectImageToFolderController,
  makeImageFavorite,
  unfavoriteImage,
}

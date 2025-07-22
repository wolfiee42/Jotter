import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { FavoriteModel } from './favorite.model'

const getAllFavorites = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id

  const favorites = await FavoriteModel.findOne({ user: userId })
    .populate('folderList')
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
    message: 'All favorites retrieved successfully',
    data: favorites,
  })
})

export const FavoriteController = { getAllFavorites }

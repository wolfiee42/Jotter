import { Router } from 'express'
import Authentication from '../../middleware/authentication'
import { Authorize } from '../../middleware/authorize'
import { FavoriteController } from './favorite.controller'

const router = Router()

router.get(
  '/',
  Authentication,
  Authorize({ role: 'user' }),
  FavoriteController.getAllFavorites,
)

export const favoriteRouter = router

import { Router } from 'express'
import Authentication from '../../middleware/authentication'
import { Authorize } from '../../middleware/authorize'
import { HomeController } from './home.controller'

const router = Router()

router.get(
  '/',
  Authentication,
  Authorize({ role: 'user' }),
  HomeController.getData,
)

router.get(
  '/recent-uploads',
  Authentication,
  Authorize({ role: 'user' }),
  HomeController.getRecentUploads,
)

export const HomeRoute = router

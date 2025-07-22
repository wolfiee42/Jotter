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

export const HomeRoute = router

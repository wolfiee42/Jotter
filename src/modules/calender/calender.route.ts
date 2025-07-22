import { Router } from 'express'
import Authentication from '../../middleware/authentication'
import { Authorize } from '../../middleware/authorize'
import { calenderController } from './calender.controller'

const router = Router()

router.get(
  '/',
  Authentication,
  Authorize({ role: 'user' }),
  calenderController.getAllDocByDate,
)

export const CalenderRouter = router

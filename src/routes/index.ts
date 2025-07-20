import { Router } from 'express'
import { UserRoute } from '../modules/user/user.route'

const router = Router()

const applicationRoutes = [
  {
    path: '/auth',
    route: UserRoute,
  },
]

applicationRoutes.forEach(route => router.use(route.path, route.route))

export default router

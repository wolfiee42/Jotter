import { Router } from 'express'
import { UserRoute } from '../modules/user/user.route'
import { ImageRouter } from '../modules/image/image.routes'
import { folderRoute } from '../modules/folder/folder.route'

const router = Router()

const applicationRoutes = [
  {
    path: '/auth',
    route: UserRoute,
  },
  {
    path: '/folder',
    route: folderRoute,
  },
  {
    path: '/image',
    route: ImageRouter,
  },
]

applicationRoutes.forEach(route => router.use(route.path, route.route))

export default router

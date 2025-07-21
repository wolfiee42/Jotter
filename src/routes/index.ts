import { Router } from 'express'
import { UserRoute } from '../modules/user/user.route'
import { ImageRouter } from '../modules/image/image.routes'
import { folderRoute } from '../modules/folder/folder.route'
import { NoteRouter } from '../modules/note/note.route'

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
  {
    path: '/note',
    route: NoteRouter,
  },
]

applicationRoutes.forEach(route => router.use(route.path, route.route))

export default router

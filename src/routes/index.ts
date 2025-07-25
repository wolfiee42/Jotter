import { Router } from 'express'
import { UserRoute } from '../modules/user/user.route'
import { ImageRouter } from '../modules/image/image.routes'
import { folderRoute } from '../modules/folder/folder.route'
import { NoteRouter } from '../modules/note/note.route'
import { PDFRouter } from '../modules/pdf/pdf.route'
import { favoriteRouter } from '../modules/favorite/favorite.route'
import { CalenderRouter } from '../modules/calender/calender.route'
import { HomeRoute } from '../modules/home/home.route'

const router = Router()

const applicationRoutes = [
  {
    path: '/auth',
    route: UserRoute,
  },
  {
    path: '/home',
    route: HomeRoute,
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
  {
    path: '/pdf',
    route: PDFRouter,
  },
  {
    path: '/favorite',
    route: favoriteRouter,
  },
  {
    path: '/calendar',
    route: CalenderRouter,
  },
]

applicationRoutes.forEach(route => router.use(route.path, route.route))

export default router

import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import notFoundAPI from './middleware/notFoundAPI'
import router from './routes'
import globalErrorHandler from './middleware/globalErrorHandler'


const app: Application = express()

//parsers
app.use(express.json())

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  }),
)
app.use(cookieParser())

// routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

// api endpoints
app.use('/api/v1', router)

// Handle Not Found API Request
app.use(notFoundAPI)

// global error handler
app.use(globalErrorHandler)

export default app

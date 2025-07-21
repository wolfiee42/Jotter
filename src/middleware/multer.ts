import multer from 'multer'

// store in memory for buffer access
const storage = multer.memoryStorage()

const upload = multer({ storage })
export default upload

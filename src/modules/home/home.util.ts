import { ImageModel } from '../image/image.model'
import { ObjectId } from 'mongoose'
import { NoteModel } from '../note/note.model'
import { PDFModel } from '../pdf/pdf.model'
import { FolderModel } from '../folder/folder.model'

export const getImageListAndTotalSize = async (imageIds: ObjectId[]) => {
  if (!imageIds || imageIds.length === 0) {
    return {
      totalImageSize: 0,
      totalImageCount: 0,
      unit: 'bytes',
    }
  }

  const images = await ImageModel.find({ _id: { $in: imageIds } }).select(
    'properties.bytes properties.secure_url name',
  )

  const totalSize = images.reduce(
    (sum, img) => sum + (img.properties?.bytes || 0),
    0,
  )
  const totalCount = images.length

  // Determine the most appropriate unit and size
  let size: number
  let unit: string

  if (totalSize >= 1000 * 1000 * 1000) {
    // >= 1GB, return in GB
    size = totalSize / (1000 * 1000 * 1000)
    unit = 'GB'
  } else if (totalSize >= 1000 * 1000) {
    // >= 1MB, return in MB
    size = totalSize / (1000 * 1000)
    unit = 'MB'
  } else if (totalSize >= 1000) {
    // >= 1KB, return in KB
    size = totalSize / 1000
    unit = 'KB'
  } else {
    // < 1KB, return in bytes
    size = totalSize
    unit = 'bytes'
  }

  return {
    totalSize: Math.round(size * 100) / 100, // Round to 2 decimal places
    unit,
    totalCount,
  }
}
export const getNoteListAndTotalSize = async (noteId: ObjectId[]) => {
  if (!noteId || noteId.length === 0) {
    return {
      totalSize: 0,
      totalCount: 0,
      unit: 'bytes',
    }
  }

  const notes = await NoteModel.find({ _id: { $in: noteId } }).select(
    'properties.bytes properties.secure_url name',
  )

  const totalSize = notes.reduce(
    (sum, note) => sum + (note.properties?.bytes || 0),
    0,
  )
  const totalCount = notes.length

  // Determine the most appropriate unit and size
  let size: number
  let unit: string

  if (totalSize >= 1000 * 1000 * 1000) {
    // >= 1GB, return in GB
    size = totalSize / (1000 * 1000 * 1000)
    unit = 'GB'
  } else if (totalSize >= 1000 * 1000) {
    // >= 1MB, return in MB
    size = totalSize / (1000 * 1000)
    unit = 'MB'
  } else if (totalSize >= 1000) {
    // >= 1KB, return in KB
    size = totalSize / 1000
    unit = 'KB'
  } else {
    // < 1KB, return in bytes
    size = totalSize
    unit = 'bytes'
  }

  return {
    totalSize: Math.round(size * 100) / 100, // Round to 2 decimal places
    unit,
    totalCount,
  }
}
export const getPDFListAndTotalSize = async (pdfId: ObjectId[]) => {
  if (!pdfId || pdfId.length === 0) {
    return {
      totalSize: 0,
      totalCount: 0,
      unit: 'bytes',
    }
  }

  const pdfs = await PDFModel.find({ _id: { $in: pdfId } }).select(
    'properties.bytes properties.secure_url name',
  )

  const totalSize = pdfs.reduce(
    (sum, pdf) => sum + (pdf.properties?.bytes || 0),
    0,
  )
  const totalCount = pdfs.length

  // Determine the most appropriate unit and size
  let size: number
  let unit: string

  if (totalSize >= 1000 * 1000 * 1000) {
    // >= 1GB, return in GB
    size = totalSize / (1000 * 1000 * 1000)
    unit = 'GB'
  } else if (totalSize >= 1000 * 1000) {
    // >= 1MB, return in MB
    size = totalSize / (1000 * 1000)
    unit = 'MB'
  } else if (totalSize >= 1000) {
    // >= 1KB, return in KB
    size = totalSize / 1000
    unit = 'KB'
  } else {
    // < 1KB, return in bytes
    size = totalSize
    unit = 'bytes'
  }

  return {
    totalSize: Math.round(size * 100) / 100, // Round to 2 decimal places
    unit,
    totalCount,
  }
}

export const getFolderListAndTotalSize = async (folderId: ObjectId[]) => {
  if (!folderId || folderId.length === 0) {
    return {
      totalSize: 0,
      totalCount: 0,
      unit: 'bytes',
    }
  }

  // Define types for the populated fields
  type PopulatedFile = {
    properties?: {
      bytes?: number
      [key: string]: any
    }
    [key: string]: any
  }
  type PopulatedFolder = {
    imageList?: PopulatedFile[]
    noteList?: PopulatedFile[]
    pdfList?: PopulatedFile[]
    [key: string]: any
  }

  const folders = (await FolderModel.find({ _id: { $in: folderId } })
    .populate({
      path: 'imageList',
      select:
        'name createdAt properties.secure_url properties.bytes properties.width properties.height properties.format',
      model: 'Image',
    })
    .populate({
      path: 'noteList',
      select: 'name createdAt properties.secure_url properties.bytes',
      model: 'Note',
    })
    .populate({
      path: 'pdfList',
      select: 'name createdAt properties.secure_url properties.bytes',
      model: 'PDF',
    })) as unknown as PopulatedFolder[]

  let totalSize = 0
  let totalCount = 0
  for (const folder of folders) {
    // Images
    if (Array.isArray(folder.imageList)) {
      for (const img of folder.imageList) {
        if (img && img.properties && typeof img.properties.bytes === 'number') {
          totalSize += img.properties.bytes
        }
        totalCount++
      }
    }
    // Notes
    if (Array.isArray(folder.noteList)) {
      for (const note of folder.noteList) {
        if (
          note &&
          note.properties &&
          typeof note.properties.bytes === 'number'
        ) {
          totalSize += note.properties.bytes
        }
        totalCount++
      }
    }
    // PDFs
    if (Array.isArray(folder.pdfList)) {
      for (const pdf of folder.pdfList) {
        if (pdf && pdf.properties && typeof pdf.properties.bytes === 'number') {
          totalSize += pdf.properties.bytes
        }
        totalCount++
      }
    }
  }

  // Determine the most appropriate unit and size
  let size: number
  let unit: string
  if (totalSize >= 1000 * 1000 * 1000) {
    size = totalSize / (1000 * 1000 * 1000)
    unit = 'GB'
  } else if (totalSize >= 1000 * 1000) {
    size = totalSize / (1000 * 1000)
    unit = 'MB'
  } else if (totalSize >= 1000) {
    size = totalSize / 1000
    unit = 'KB'
  } else {
    size = totalSize
    unit = 'bytes'
  }

  return {
    totalSize: Math.round(size * 100) / 100, // Round to 2 decimal places
    unit,
    totalCount,
  }
}

export const formatBytes = (bytes: number) => {
  if (bytes >= 1000 * 1000 * 1000) {
    return {
      size: Math.round((bytes / (1000 * 1000 * 1000)) * 100) / 100,
      unit: 'GB',
    }
  } else if (bytes >= 1000 * 1000) {
    return {
      size: Math.round((bytes / (1000 * 1000)) * 100) / 100,
      unit: 'MB',
    }
  } else if (bytes >= 1000) {
    return {
      size: Math.round((bytes / 1000) * 100) / 100,
      unit: 'KB',
    }
  } else {
    return {
      size: bytes,
      unit: 'bytes',
    }
  }
}

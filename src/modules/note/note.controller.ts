import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { ObjectId } from 'mongoose'
import { NoteService } from './note.service'
import { NoteModel } from './note.model'
import { FolderModel } from '../folder/folder.model'
import { FavoriteModel } from '../favorite/favorite.model'

const uploadNoteController = catchAsync(async (req: Request, res: Response) => {
  const body = JSON.parse(req.body.data || '{}')
  const id = req.user?.id
  const file = req.file
  if (!file) {
    throw new Error('No file uploaded')
  }

  const savedFile = await NoteService.uploadFileService(file, body, id)
  await NoteService.updateSpaceWithNote(
    savedFile._id as ObjectId,
    id as ObjectId,
  )
  if (body.folderId) {
    await NoteService.updateFolderWithNote(
      savedFile._id as ObjectId,
      body.folderId as ObjectId,
    )
  }
  sendResponse(res, {
    success: true,
    message: 'Note uploaded successfully',
    statusCode: 201,
    data: savedFile,
  })
})

const getAllNote = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.id
  const allNotes = await NoteModel.find({ user: id }).select('name updatedAt ')
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'All Notes Retrived successfully.',
    data: allNotes,
  })
})

const getSingleNotes = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id

  const note = await NoteModel.findOne({ user: userId, _id: id }).select(
    'name createdAt properties.secure_url properties.bytes',
  )
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Note Retrived Successfully.',
    data: note,
  })
})

const updateNoteController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id
  const body = req.body

  const updatedNote = await NoteModel.findOneAndUpdate(
    { user: userId, _id: id },
    { name: body.name },
    { new: true },
  ).select('name updatedAt properties.secure_url properties.bytes')

  if (!updatedNote) {
    throw new Error('Note not found')
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Note updated successfully',
    data: updatedNote,
  })
})

const deleteNoteController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id

  const note = await NoteModel.findOne({ user: userId, _id: id })

  if (!note) {
    throw new Error('No Note Found')
  }

  if (note.folderId) {
    await FolderModel.updateOne(
      { _id: note.folderId },
      { $pull: { noteList: note._id } },
    )
  }

  await note.deleteOne()

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Note deleted successfully',
  })
})

const duplicateNoteController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id
    const id = req.params.id
    const { name } = req.body

    const note = await NoteModel.findOne({ user: userId, _id: id })
    if (!note) {
      throw new Error(
        'Note not found or you do not have permission to duplicate it',
      )
    }

    const duplicatedNote = await NoteModel.create({
      user: note.user,
      name: name || note.name + ' (Copy)',
      properties: note.properties,
      folderId: note.folderId || null,
    })

    if (duplicatedNote.folderId) {
      await FolderModel.updateOne(
        { _id: duplicatedNote.folderId },
        { $push: { noteList: duplicatedNote._id } },
      )
    }

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: 'Note duplicated successfully.',
      data: duplicatedNote,
    })
  },
)

const connectNoteToFolderController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id
    const noteId = req.params.id
    const { folderId } = req.body

    if (!folderId) {
      throw new Error('No folderId provided')
    }

    const note = await NoteModel.findOne({ user: userId, _id: noteId })
    if (!note) {
      throw new Error(
        'Note not found or you do not have permission to connect it',
      )
    }

    if (note.folderId) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: 'Note is already linked to a folder.',
      })
    }

    note.folderId = folderId
    await note.save()

    await FolderModel.updateOne(
      { _id: folderId },
      { $addToSet: { noteList: note._id } },
    )

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Note connected to folder successfully.',
      data: note,
    })
  },
)

const makeNoteFavorite = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id

  const note = await NoteModel.findOne({ _id: id, user: userId })
  if (!note) {
    throw new Error('Note not found')
  }

  const favourite = await FavoriteModel.findOne({ user: userId })
  if (!favourite) {
    throw new Error('Favorite not found')
  }

  if (favourite.noteList.includes(note._id)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'Note is already favorited',
    })
  }

  favourite.noteList.push(note._id)
  await favourite.save()

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Note favorite status updated successfully',
    data: note,
  })
})

const unfavoriteNote = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const id = req.params.id

  const note = await NoteModel.findOne({ _id: id, user: userId })
  if (!note) {
    throw new Error('Note not found')
  }

  const favourite = await FavoriteModel.findOne({ user: userId })
  if (!favourite) {
    throw new Error('Favorite not found')
  }

  if (!favourite.noteList.includes(note._id)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'Note is not favorited',
    })
  }

  favourite.noteList = favourite.noteList.filter(
    noteId => noteId.toString() !== note._id.toString(),
  )
  await favourite.save()

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Note unfavorited successfully',
    data: note,
  })
})

export const NoteController = {
  uploadNoteController,
  getAllNote,
  getSingleNotes,
  updateNoteController,
  deleteNoteController,
  duplicateNoteController,
  connectNoteToFolderController,
  makeNoteFavorite,
  unfavoriteNote,
}

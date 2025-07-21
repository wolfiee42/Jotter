import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { ObjectId } from 'mongoose'
import { NoteService } from './note.service'

const uploadNoteController = catchAsync(
    async (req: Request, res: Response) => {
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
    },
)

export const NoteController = {
    uploadNoteController,
}

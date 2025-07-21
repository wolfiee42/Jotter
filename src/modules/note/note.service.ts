import { UploadApiResponse } from 'cloudinary'
import cloudinary from '../../config/cloudinary'
import { SpaceModel } from '../space/space.model'
import { ObjectId } from 'mongoose'
import { FolderModel } from '../folder/folder.model'
import { TNote, UploadNoteBody } from './note.interface'
import { NoteModel } from './note.model'

const uploadToCloudinary = async (
    fileBuffer: ArrayBufferLike,
): Promise<UploadApiResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                { resource_type: 'auto', folder: 'notes' },
                (err: Error | undefined, result: UploadApiResponse | undefined) => {
                    if (err) return reject(err)
                    resolve(result)
                },
            )
            .end(fileBuffer as Buffer)
    })
}

const uploadFileService = async (
    file: { buffer: ArrayBufferLike },
    body: UploadNoteBody,
    userId: ObjectId,
): Promise<TNote> => {
    const fileUrl: UploadApiResponse | undefined = await uploadToCloudinary(
        file.buffer,
    )

    const savedFile = await NoteModel.create({
        name: body.name,
        user: userId,
        folderId: body.folderId ? body.folderId : null,
        properties: fileUrl,
    })

    return savedFile
}

const updateSpaceWithNote = async (
    noteId: ObjectId,
    userId: ObjectId,
): Promise<void> => {
    const space = await SpaceModel.findOne({ user: userId })
    if (!space) {
        throw new Error('Space not found')
    }

    space.noteList.push(noteId)
    await space.save()
}
const updateFolderWithNote = async (
    noteId: ObjectId,
    folderId: ObjectId,
): Promise<void> => {
    const folder = await FolderModel.findById(folderId)
    if (!folder) {
        throw new Error('Folder not found')
    }
    folder?.noteList.push(noteId)
    await folder.save()
}

export const NoteService = {
    uploadFileService,
    updateFolderWithNote,
    updateSpaceWithNote,
}

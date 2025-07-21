import { UploadApiResponse } from 'cloudinary'
import cloudinary from '../../config/cloudinary'
import { SpaceModel } from '../space/space.model'
import { ObjectId } from 'mongoose'
import { FolderModel } from '../folder/folder.model'
import { TPDF, UploadPDFBody } from './pdf.interface'
import { PDFModel } from './pdf.model'

const uploadToCloudinary = async (
    fileBuffer: ArrayBufferLike,
): Promise<UploadApiResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                { resource_type: 'auto', folder: 'pdfs' },
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
    body: UploadPDFBody,
    userId: ObjectId,
): Promise<TPDF> => {
    const fileUrl: UploadApiResponse | undefined = await uploadToCloudinary(
        file.buffer,
    )

    const savedFile = await PDFModel.create({
        name: body.name,
        user: userId,
        folderId: body.folderId ? body.folderId : null,
        properties: fileUrl,
    })

    return savedFile
}

const updateSpaceWithPDF = async (
    PDFId: ObjectId,
    userId: ObjectId,
): Promise<void> => {
    const space = await SpaceModel.findOne({ user: userId })
    if (!space) {
        throw new Error('Space not found')
    }

    space.pdfList.push(PDFId)
    await space.save()
}
const updateFolderWithPDF = async (
    PDFId: ObjectId,
    folderId: ObjectId,
): Promise<void> => {
    const folder = await FolderModel.findById(folderId)
    if (!folder) {
        throw new Error('Folder not found')
    }
    folder?.pdfList.push(PDFId)
    await folder.save()
}

export const PDFService = {
    uploadFileService,
    updateFolderWithPDF,
    updateSpaceWithPDF
}

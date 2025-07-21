import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { ObjectId } from 'mongoose'
import { PDFService } from './pdf.service'
import { PDFModel } from './pdf.model'

const uploadPDFController = catchAsync(
    async (req: Request, res: Response) => {
        const body = JSON.parse(req.body.data || '{}')
        const id = req.user?.id
        const file = req.file
        if (!file) {
            throw new Error('No file uploaded')
        }

        const savedFile = await PDFService.uploadFileService(file, body, id)
        await PDFService.updateSpaceWithPDF(
            savedFile._id as ObjectId,
            id as ObjectId,
        )
        if (body.folderId) {
            await PDFService.updateFolderWithPDF(
                savedFile._id as ObjectId,
                body.folderId as ObjectId,
            )
        }
        sendResponse(res, {
            success: true,
            message: 'PDF uploaded successfully',
            statusCode: 201,
            data: savedFile,
        })
    },
)

const getAllPDF = catchAsync(async (req: Request, res: Response) => {
    const id = req.user?.id;
    const allPDFs = await PDFModel.find({ user: id }).select("name updatedAt ")
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "All Pdfs Retrived successfully.",
        data: allPDFs
    })
})

export const PDFController = {
    uploadPDFController,
    getAllPDF
}

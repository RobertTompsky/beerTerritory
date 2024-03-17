import { handleServerError } from '@/utils/handleServerError';
import { Request, Response } from 'express';
import path from 'path';

export const getImage = (req: Request, res: Response) => {
    const {imageName} = req.params
    const imagePath = path.join(__dirname, `../../uploads/${imageName}`)

    try {
        if (imageName) {
            res.sendFile(imagePath)
        } else {
            return res.status(400).json({
                message: 'Картинка не найдена'
            })
        }
    } catch (error) {
        handleServerError(res, 'Не удалось получить файл картинки', error)
    }
}
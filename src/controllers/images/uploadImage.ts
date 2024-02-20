import { upload } from '@/config/multerConfig';
import { handleServerError } from '@/utils/handleServerError';
import { Request, Response } from 'express';
import { MulterError } from "multer";

export const uploadImage = async (req: Request, res: Response) => {
    const maxFileSize: number = 1024 * 1024; // 1 MB

    upload.single('avatar')(req, res, async (error: any) => {
        try {
            if (error instanceof MulterError) {
                return res.status(400).json({
                    error: error.message
                });
            } else if (error) {
                return res.status(400).json({
                    message: 'Ошибка при загрузке файла'
                });
            }

            if (req.file) {
                const validFileTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];

                if (!validFileTypes.includes(req.file.mimetype) || req.file.size > maxFileSize) {
                    return res.status(400).json({
                        message: 'Недопустимый файл или превышен допустимый размер (1 MB)'
                    });
                }

                console.log(req.file.path);
                res.status(200).json({ filePath: req.file.path });
            } else {
                console.log('Файл или данные не были загружены');
                res.status(400).json({ message: 'Файл не был загружен' });
            }
        } catch (error) {
            handleServerError(res, 'Ошибка при загрузке файла', error);
        }
    });
};
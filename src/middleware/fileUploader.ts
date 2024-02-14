import { upload } from '@/config/multerConfig';
import { handleServerError } from '@/utils/handleServerError';
import { Request, Response, NextFunction } from 'express'
import { MulterError } from "multer";

export const fileUploader = (fileToUpload: string) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const maxFileSize: number = 1024 * 1024; // 1 MB
            setTimeout(() => { // Добавление задержки в 2 секунды
                upload.single(fileToUpload)(req, res,  async (error: any) => {
                    if (error instanceof MulterError) {
                        return res.status(400).json({
                            error: error.message
                        })
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

                        console.log(req.file.path)
                    } else {
                        console.log('Файл или данные не были загружены');
                    }
                    next();
                });
            }, 2000); // Задержка в 2 секунды

        } catch (error) {
            handleServerError(res, 'Ошибка в fileUploader', error);
        }
    };
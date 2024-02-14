import { handleServerError } from '@/utils/handleServerError';
import { Request, Response } from 'express';


export const logOut = (req: Request, res: Response) => {
    try {
        res.clearCookie('jwtToken');

        res.status(200).json({ 
            message: 'Пользователь успешно вышел из системы' 
        });
    } catch (error) {
        handleServerError(res, 'Ошибка при выходе пользователя', error)
    }
};
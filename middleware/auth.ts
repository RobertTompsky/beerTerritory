import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma/script'
import { User } from '@prisma/client'
import { DecodedToken, RequestWithUser } from '../types/types'

export const auth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                message: "Токен не найден",
            });
        }

        // объект decoded имеет три параметра: userId, iat и exp. Надо указать, что поле userId имеет тип string, чтобы Typescript понимал, что ему ожидать.
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
        console.log(decoded)

        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                message: "Некорректный формат токена",
            });
        }

        const user: User = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            }
        });

        if (user) {
            req.user = user
        } else {
            throw new Error('Пользователь не найден');
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Пользователь не авторизован", error: error.message });
    }
}
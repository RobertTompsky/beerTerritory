import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '@/prisma/script';
import { UserLoginData } from '@/types/types';
import { handleServerError } from '@/utils/handleServerError';
import { logger } from '@/config/loggerConfig';
 
export const logIn = async (req: Request, res: Response) => {
    const { nickName, password }: UserLoginData = req.body
    try {
        const existingUser = await prisma.user.findFirst({
            where: { nickName }
        }) 
        if (!existingUser) {
            // return Обязательно нужно добавить, чтобы после возвращения ответа код останавливался, а не продолжал слать headers
            return res.status(401).send("Пользователя не существует");
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password)
        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Неверный пароль'
            });
        }

        const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        logger.info(`${nickName} выполнил вход в приложение`)

        res.status(201).json({
            id: existingUser.id,
            nickName: existingUser.nickName,
            token,
            message: 'Пользователь залогинился'
        })
    } catch (error) {
        handleServerError(res, 'Не удалось совершить авторизацию пользователя', error)
    }
}
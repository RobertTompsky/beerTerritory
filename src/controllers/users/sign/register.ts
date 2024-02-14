import { Request, Response } from 'express';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '@/prisma/script';
import { UserRegistrationData } from '@/types/types';
import { handleServerError } from '@/utils/handleServerError';

export const register = async (req: Request, res: Response) => {
    const { nickName, email, password }: UserRegistrationData = req.body
    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { nickName },
                    { email }
                ]
            }
        })

        if (existingUser) {
            // return Обязательно нужно добавить, чтобы после возвращения ответа код останавливался, а не продолжал слать headers
            return res.status(409).send("Пользователь уже существует");
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user: User = await prisma.user.create({
            data: {
                nickName,
                email,
                password: hashedPassword
            }
        })

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.status(201).json({
            id: user.id,
            nickName: user.nickName,
            token,
            message: 'Пользователь зарегистрировался'
        })

    } catch (error) {
        handleServerError(res, 'Не удалось зарегистрировать пользователя', error)
    }
}
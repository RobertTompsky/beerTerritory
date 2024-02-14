import { prisma } from '@/prisma/script';
import { handleServerError } from '@/utils/handleServerError';
import { Request, Response } from 'express';

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                nickName: true,
                favouriteBeers: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                profile: true
            }
        })

        if (user) {
            res.status(200).json(user)

        } else {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

    } catch (error) {
        handleServerError(res, 'Не удалось выполнить запрос пользователя', error)
    }
}
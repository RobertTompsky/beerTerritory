import { prisma } from '@/prisma/script';
import { UserRequest } from '@/types/types';
import { handleServerError } from '@/utils/handleServerError';
import { Response } from 'express';

export const getMe = async (req: UserRequest, res: Response) => {
    const { id } = req.user
    try {
        const me = await prisma.user.findUnique({
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

        if (me) {
            res.status(200).json(me)
        } else {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
    } catch (error) {
        handleServerError(res, 'Не удалось выполнить запрос пользователя', error)
    }
}
import { prisma } from "../../prisma/script"
import { UserRequest } from "../../types/types"
import { handleServerError } from "../../utils/handleServerError"
import { Response } from 'express';

export const getAllUsers = async (req: UserRequest, res: Response) => {
    try {
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                nickName: true,
                profile: {
                    select: {
                        avatar: true
                    }
                }
            }
        })

        if (allUsers.length >= 1) {
            res.status(200).json(allUsers)
        } else {
            return res.status(404).json({
                message: 'Список пользователей пуст'
            })
        }
    } catch (error) {
        handleServerError(res, 'Не удалось выполнить запрос пользователей', error)
    }
}
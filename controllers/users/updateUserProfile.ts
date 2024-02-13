import { Profile } from "@prisma/client";
import { prisma } from "../../prisma/script";
import { UserRequest, ProfileInputData } from "../../types/types";
import { handleServerError } from "../../utils/handleServerError";
import { Response } from 'express';

export const updateUserProfile = async (req: UserRequest, res: Response) => {
    const { id } = req.user
    const { realName, age, bio }: ProfileInputData = req.body
    try {
        const existingProfile: Profile = await prisma.profile.findUnique({
            where: {
                userId: id
            }
        })

        if (!existingProfile) {
            return res.status(400).json({
                message: 'Для начала создайте профиль пользователя'
            });
        }

        const updatedUserProfile: Profile = await prisma.profile.update({
            where: {
                userId: id
            },
            data: {
                realName,
                age,
                bio,
                avatar: req?.file?.path || ''
            }
        })

        res.status(200).json(updatedUserProfile)

    } catch (error) {
        handleServerError(res, 'Не удалось обновить профиль пользователя', error)
    }
}
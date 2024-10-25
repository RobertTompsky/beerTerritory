import { prisma } from "@/prisma/script";
import { UserRequest, ProfileInputData } from "@/types/types";
import { handleServerError } from "@/utils/handleServerError";
import { Profile } from "@prisma/client";
import { Response, Request } from 'express';

// Request<{}, {}, ProfileInputData>
export const createUserProfile = async (req: UserRequest, res: Response) => {
    const { id } = req.user
    const { realName, age, bio, avatar } = req.body
    try {
        const existingProfile: Profile = await prisma.profile.findUnique({
            where: {
                userId: id
            }
        })

        if (existingProfile) {
            return res.status(400).json({ 
                message: 'Профиль пользователя уже существует' 
            });
        }

        const profile: Profile = await prisma.profile.create({
            data: {
                realName,
                age,
                bio,
                avatar: avatar || '',
                user: {
                    connect: {
                        id
                    }
                }
            }
        })

        res.status(201).json(profile)

    } catch (error) {
        handleServerError(res, 'Не удалось создать профиль пользователя', error)
    }
}
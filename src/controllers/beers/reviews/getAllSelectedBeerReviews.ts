import { prisma } from "@/prisma/script";
import { handleServerError } from "@/utils/handleServerError";
import { Review } from "@prisma/client";
import { Request, Response } from 'express';

export const getAllSelectedBeerReviews = async (req: Request, res: Response) => {
    const { beerId } = req.params

    try {
        const selectedBeerReviews = await prisma.review.findMany({
            where: { beerId },
            include: {
                user: {
                    select: {
                        id: true,
                        nickName: true,
                        profile: true
                    }
                }
            }
        })

        if (selectedBeerReviews.length >= 1) {
            res.status(200).json(selectedBeerReviews)
        } else {
            return res.status(200).json([]);
        }

    } catch (error) {
        handleServerError(res, 'Не удалось найти обзоры на пиво', error)
    }
}
import { Review } from "@prisma/client"
import { prisma } from "../../prisma/script"
import { UserRequest, ReviewInputData } from "../../types/types"
import { Response } from 'express';
import { handleServerError } from "../../utils/handleServerError";

export const addReview = async (req: UserRequest, res: Response) => {
    const { id } = req.user
    const { beerId } = req.params
    const { title, body, rating }: ReviewInputData = req.body

    try {
        // Если поиск не по id самого отзыва, то тогда findFirst
        const existingReviewByUser: Review = await prisma.review.findFirst({
            where: { userId: id, beerId }
        })

        if (!existingReviewByUser) {
            const review: Review = await prisma.review.create({
                data: {
                    title,
                    body,
                    rating,
                    user: {
                        connect: {
                            id
                        },
                    },
                    beer: {
                        connect: {
                            id: beerId
                        }
                    }
                }
            })

            return res.status(201).json(review)
        } else {
            return res.status(403).json({
                message: 'Ваш отзыв на пиво уже имеется'
            })
        }

    } catch (error) {
        handleServerError(res, 'Не удалось добавить обзор на пиво', error)
    }
}
import { prisma } from "@/prisma/script";
import { UserRequest, ReviewInputData } from "@/types/types";
import { handleServerError } from "@/utils/handleServerError";
import { Review } from "@prisma/client"
import { Response } from 'express';

export const updateReview = async (req: UserRequest, res: Response) => {
    const { id } = req.user
    const { reviewId } = req.params
    const { title, body, rating }: ReviewInputData = req.body

    try {
        const existingReview: Review = await prisma.review.findUnique({
            where: { id: reviewId }
        })

        if (existingReview) {
            const updatedReview: Review = await prisma.review.update({
                where: { id: reviewId },
                data: {
                    title,
                    body,
                    rating
                }
            })
            if (existingReview.userId === id) {
                return res.status(200).json(updatedReview)
            } else {
                return res.status(403).json({
                    message: 'Вы не можете редактировать чужие отзывы'
                })
            }
        } else {
            return res.status(403).json({
                message: 'Вы пытаетесь обновить отзыв, которого не существует'
            })
        }

    } catch (error) {
        handleServerError(res, 'Не удалось обновить обзор', error)
    }
}
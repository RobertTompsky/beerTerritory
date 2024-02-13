import { Review } from "@prisma/client";
import { prisma } from "../../prisma/script";
import { Request, Response } from 'express';
import { handleServerError } from "../../utils/handleServerError";

export const getSelectedBeerSelectedReview = async (req: Request, res: Response) => {
    const { reviewId } = req.params

    try {
        const selectedBeerReview: Review = await prisma.review.findUnique({
            where: { id: reviewId }
        })

        if (selectedBeerReview) {
            res.status(200).json(selectedBeerReview)
        } else {
            return res.status(403).json({
                message: 'Обзора с таким идентификатором не существует'
            });
        }

    } catch (error) {
        handleServerError(res, 'Не удалось найти выбранный обзор на пиво', error)
    }
}
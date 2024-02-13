import { Review } from "@prisma/client";
import { prisma } from "../../prisma/script";
import { Request, Response } from 'express';
import { handleServerError } from "../../utils/handleServerError";

export const getAllSelectedBeerReviews = async (req: Request, res: Response) => {
    const { beerId } = req.params

    try {
        const selectedBeerReviews: Review[] = await prisma.review.findMany({
            where: { beerId }
        })

        if (selectedBeerReviews.length >= 1) {
            res.status(200).json(selectedBeerReviews)
        } else {
            return res.status(403).json({
                message: 'Список обзоров на выбранное пиво пуст'
            });
        }

    } catch (error) {
        handleServerError(res, 'Не удалось найти обзоры на пиво', error)
    }
}
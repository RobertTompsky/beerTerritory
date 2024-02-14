import { Review } from "@prisma/client";
import { prisma } from "../../../prisma/script";
import { UserRequest } from "../../../types/types";
import { Response } from 'express';
import { handleServerError } from "../../../utils/handleServerError";

export const deleteReview = async (req: UserRequest, res: Response) => {
    const { id } = req.user;
    const { reviewId, beerId } = req.params;

    try {
        const existingBeer = await prisma.beer.findUnique({
            where: { id: beerId}
        })

        const reviewToDelete: Review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!reviewToDelete || !existingBeer) {
            return res.status(404).json({ message: 'Такого обзора или пива нет' });
        }

        if (reviewToDelete.userId === id) {
            await prisma.review.delete({
                where: { id: reviewId }
            });
            res.status(200).json({ message: 'Обзор успешно удален' });
        } else {
            return res.status(403).json({
                message: 'Вы не можете удалить чужой отзыв'
            });
        }
    } catch (error) {
        handleServerError(res, 'Не удалось удалить обзор', error)
    }
}
import { prisma } from "../../prisma/script";
import { UserRequest } from "../../types/types";
import { handleServerError } from "../../utils/handleServerError";
import { Response } from 'express';

export const deleteUser = async (req: UserRequest, res: Response) => {
    const { id } = req.user;
    try {
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id },
                include: {
                    favouriteBeers: true
                },
            });

            for (const beer of user.favouriteBeers) {
                await tx.beer.update({
                    where: {
                        id: beer.id,
                    },
                    data: {
                        favouriteInUsers: {
                            disconnect: { id },
                        },
                    },
                });
            }

            await tx.beer.deleteMany({
                where: {
                    creatorId: id
                }
            });

            await tx.user.delete({
                where: { id }
            })
        })

        res.status(200).json({
            message: 'Пользователь успешно удален'
        });
    }
    catch (error) {
        handleServerError(res, 'Не удалось выполнить запрос на удаление пользователя', error)
    }
};
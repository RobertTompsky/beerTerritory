import { prisma } from "../../prisma/script";
import { UserRequest } from "../../types/types";
import { Response } from 'express';
import { handleServerError } from "../../utils/handleServerError";

export const deleteBeer = async (req: UserRequest, res: Response) => {
    const { id } = req.user
    const { beerId } = req.params

    try {
        await prisma.$transaction(async (tx) => {
            const beerToDelete = await tx.beer.findUnique({
                where: { id: beerId },
                include: { favouriteInUsers: true },
            });

            if (!beerToDelete) {
                return res.status(404).json({ message: 'Пиво не найдено' });
            }

            if (beerToDelete.creatorId === id) {
                for (const user of beerToDelete.favouriteInUsers) {
                    await tx.user.update({
                        where: { id: user.id },
                        data: {
                            favouriteBeers: {
                                disconnect: { id: beerId }
                            }
                        }
                    });
                }

                await tx.beer.delete({
                    where: { id: beerId }
                });

                res.status(200).json({
                    message: 'Пиво успешно удалено'
                });

            } else {
                return res.status(403).json({
                    message: 'У вас нет разрешения на удаление этого пива'
                });
            }
        })
    } catch (error) {
        handleServerError(res, 'Не удалось удалить пиво', error)
    }
}
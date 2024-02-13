import { prisma } from "../../prisma/script"
import { UserRequest } from "../../types/types"
import { Response } from 'express';
import { handleServerError } from "../../utils/handleServerError";

export const removeBeerFromFavourites = async (req: UserRequest, res: Response) => {
    const { id } = req.user
    const { beerId } = req.params

    try {
        const me = await prisma.user.findUnique({
            where: { id },
            include: {
                favouriteBeers: true
            }
        })

        const beerToRemoveFromFav = await prisma.beer.findUnique({
            where: { id: beerId },
            include: {
                favouriteInUsers: true
            }
        })

        const isBeerExistsInFav: boolean = me.favouriteBeers.some((favBeer) => favBeer.id === beerToRemoveFromFav.id)

        if (!isBeerExistsInFav) {
            return res.status(403).json({
                message: 'Пиво уже удалено из списка избранного'
            });
        }

        if (me && beerToRemoveFromFav) {
            await prisma.beer.update({
                where: { id: beerId },
                data: {
                    favouriteInUsers: {
                        disconnect: { id },
                    },
                },
            });

            res.status(200).json({
                message: 'Пиво удалено из списка избранного'
            })

        } else {
            return res.status(403).json({
                message: 'Пользователя и/или пива не существует'
            });
        }


    } catch (error) {
        handleServerError(res, 'Не удалось удалить пиво из избранного', error)
    }
}
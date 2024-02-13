import { prisma } from "../../prisma/script"
import { UserRequest } from "../../types/types"
import { Response } from 'express';
import { handleServerError } from "../../utils/handleServerError";

export const addBeerToFavorite = async (req: UserRequest, res: Response) => {
    const { id } = req.user
    const { beerId } = req.params

    try {
        const me = await prisma.user.findUnique({
            where: { id },
            include: {
                favouriteBeers: true
            }
        })

        const beerToAddToFav = await prisma.beer.findUnique({
            where: { id: beerId }
        })

        // метод some использует функцию колбэка для сравнения объектов по их id. Если хотя бы один элемент в me.favouriteBeers имеет такое же id как beerToAddToFav, то проверка вернет true, и код внутри условия выполнится.
        const isBeerExistsInFav: boolean = me.favouriteBeers.some((favBeer) => favBeer.id === beerToAddToFav.id)

        if (isBeerExistsInFav) {
            return res.status(403).json({
                message: 'Пиво уже есть в списке избранного'
            });
        }

        if (me && beerToAddToFav) {
            await prisma.user.update({
                where: { id },
                data: {
                    favouriteBeers: {
                        connect: { id: beerId }
                    }
                }
            })
        } else {
            return res.status(403).json({
                message: 'Пользователя и/или пива не существует'
            });
        }

        res.status(200).json({
            message: 'Пиво добавлено в избранное'
        })
    } catch (error) {
        handleServerError(res, 'Не удалось добавить пиво в избранное', error)
    }

}
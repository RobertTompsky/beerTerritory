import { prisma } from "@/prisma/script";
import { UserRequest, BeerInputData } from "@/types/types";
import { handleServerError } from "@/utils/handleServerError";
import { Beer } from "@prisma/client"
import { Response } from 'express';

export const addBeer = async (req: UserRequest, res: Response) => {
    const { id } = req.user
    const { name, brewery, type, abv, volume, image }: BeerInputData = req.body

    try {
        // Если поиск не по id самого отзыва, то тогда findFirst
        const existingBeer: Beer = await prisma.beer.findFirst({
            where: {
                name,
                type
            }
        })

        if (!existingBeer) {
            const beer: Beer = await prisma.beer.create({
                data: {
                    name,
                    brewery,
                    type,
                    abv,
                    volume,
                    image: image || '',
                    createdBy: {
                        connect: {
                            id
                        }
                    }
                }
            })

            res.status(201).json(beer)
        } else {
            return res.status(400).json({
                message: 'Такое пиво уже существует'
            })
        }
    } catch (error) {
        handleServerError(res, 'Не удалось добавить пиво', error)
    }
}
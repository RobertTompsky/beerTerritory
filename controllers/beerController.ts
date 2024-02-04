import { Beer } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../prisma/script';
import { BeerInputData, RequestWithUser } from '../types/types';
import { beerAddSchema, validateData } from '../utils/validateData';

//даже если req не используется, его все равно надо указывать в параметрах
export const getAllBeers = async (req: Request, res: Response) => {
    try {
        const beers: Beer[] = await prisma.beer.findMany()

        if (beers && beers.length >= 1) {
            return res.status(201).json(beers)
        } else {
            return res.status(400).json({
                message: 'Список пива пуст'
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Не удалось получить список пива",
            error: error.message
        })
    }
}

export const getSelectedBeer = async (req: Request, res: Response) => {
    const { beerId } = req.params
    try {
        const beer: Beer = await prisma.beer.findUnique({
            where: {
                id: beerId
            }
        })

        if (beer) {
            return res.status(201).json(beer)
        } else {
            return res.status(400).json({
                message: 'Такого пива не существует (пока что)'
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Не удалось совершить запрос к пиву",
            error: error.message
        })
    }
}

export const addBeer = async (req: RequestWithUser, res: Response) => {
    try {
        const beerData: BeerInputData = validateData(beerAddSchema, req.body)
        const { id } = req.user
        const { name, sort, ibu, abv, og, volume, format, image } = beerData
        console.log(id)
        const existingBeer = await prisma.beer.findFirst({
            where: {
                name,
                sort
            }
        })
        if (!existingBeer) {
            const beer: Beer = await prisma.beer.create({
                data: {
                    name,
                    sort,
                    ibu,
                    abv,
                    og,
                    volume,
                    format,
                    image,
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
        res.status(500).json({
            message: "Не удалось создать пиво",
            error: error.message
        })
    }
}

export const updateBeer = async (req: Request, res: Response) => {
    try {
        const updatedBeerData: BeerInputData = validateData(beerAddSchema, req.body)
        const { beerId } = req.params
        const { name, sort, ibu, abv, og, volume, format, image } = updatedBeerData
        console.log(beerId)
        const existingBeer = await prisma.beer.findFirst({
            where: { id: beerId }
        })
        if (existingBeer) {
            const updatedExistingBeer = await prisma.beer.update({
                where: { id: beerId },
                data: {
                    name,
                    sort,
                    ibu,
                    abv,
                    og,
                    volume,
                    format,
                    image,
                }
            })
            return res.json(updatedExistingBeer)
        } else {
            return res.status(400).json({
                message: 'Такого пива нет'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Не удалось обновить пиво",
            error: error.message
        })
    }
}
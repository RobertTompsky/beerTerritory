import { prisma } from '@/prisma/script';
import { handleServerError } from '@/utils/handleServerError';
import { Request, Response } from 'express';

export const searchBeers = async (req: Request, res: Response) => {
    const { q } = req.query

    try {
        if (q) {
            const beersToSearch = await prisma.beer.findMany({
                where: {
                    name: {
                    contains: q as string
                    // если используется MongoDb и PostgreSQL, для игнора регистра нужно добавить mode: 'insensitive'
                    // для MySQL ничего добавлять не надо
                    }
                },
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            })
            res.status(200).json(beersToSearch)

        } else {
            return res.status(400).json({
                message: 'Не указан поисковый запрос'
            })
        }
    } catch (error) {
        handleServerError(res, 'Не удалось выполнить поиск пива', error)
    }
}
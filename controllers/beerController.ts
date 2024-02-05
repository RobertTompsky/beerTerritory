import { Beer, Review } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../prisma/script';
import { BeerInputData, RequestWithUser, ReviewInputData } from '../types/types';
import { beerAddSchema, reviewAddSchema, validateData } from '../utils/validateData';

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
        const selectedBeer: Beer = await prisma.beer.findUnique({
            where: { id: beerId }
        })

        if (selectedBeer) {
            const selectedBeerWithViewsIncreased = await prisma.beer.update({
                where: { id: beerId },
                data: {
                    viewsCount: {
                        increment: 1
                    }
                }
            })
            return res.status(201).json(selectedBeerWithViewsIncreased)
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
    const { id } = req.user

    try {
        const beerData: BeerInputData = validateData(beerAddSchema, req.body)
        const { name, brewery, sort, ibu, abv, og, volume, format, image } = beerData

        // Если поиск не по id самого отзыва, то тогда findFirst
        const existingBeer: Beer = await prisma.beer.findFirst({
            where: {
                name,
                sort
            }
        })

        if (!existingBeer) {
            const beer: Beer = await prisma.beer.create({
                data: {
                    name,
                    brewery,
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
    const { beerId } = req.params

    try {
        const updatedBeerData: BeerInputData = validateData(beerAddSchema, req.body)
        const { name, brewery, sort, ibu, abv, og, volume, format, image } = updatedBeerData

        const existingBeer: Beer = await prisma.beer.findUnique({
            where: { id: beerId }
        })

        if (existingBeer) {
            const updatedExistingBeer = await prisma.beer.update({
                where: { id: beerId },
                data: {
                    name,
                    brewery,
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

export const deleteBeer = async (req: RequestWithUser, res: Response) => {
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

                await tx.beer.update({
                    where: { id: beerId },
                    data: {
                        favouriteInUsers: {
                            set: []
                        }
                    }
                });

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
        res.status(500).json({
            message: "Не удалось удалить пиво",
            error: error.message
        })
    }
}

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
        res.status(500).json({
            message: "Не удалось найти обзоры на выбранное пиво",
            error: error.message
        })
    }
}

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
        res.status(500).json({
            message: "Не удалось найти выбранный обзор",
            error: error.message
        })
    }
}

export const addReview = async (req: RequestWithUser, res: Response) => {
    const { id } = req.user
    const { beerId } = req.params

    try {
        const reviewData: ReviewInputData = validateData(reviewAddSchema, req.body)
        const { title, body, rating } = reviewData

        // Если поиск не по id самого отзыва, то тогда findFirst
        const existingReviewByUser: Review = await prisma.review.findFirst({
            where: { userId: id, beerId }
        })

        if (!existingReviewByUser) {
            const review: Review = await prisma.review.create({
                data: {
                    title,
                    body,
                    rating,
                    user: {
                        connect: {
                            id
                        },
                    },
                    beer: {
                        connect: {
                            id: beerId
                        }
                    }
                }
            })

            return res.status(201).json(review)
        } else {
            return res.status(403).json({
                message: 'Ваш отзыв на пиво уже имеется'
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Не удалось добавить обзор",
            error: error.message
        })
    }
}

export const updateReview = async (req: RequestWithUser, res: Response) => {
    const { id } = req.user
    const { reviewId } = req.params

    try {
        const reviewData: ReviewInputData = validateData(reviewAddSchema, req.body)
        const { title, body, rating } = reviewData

        const existingReview: Review = await prisma.review.findUnique({
            where: { id: reviewId }
        })

        if (existingReview) {
            const updatedReview: Review = await prisma.review.update({
                where: { id: reviewId },
                data: {
                    title,
                    body,
                    rating
                }
            })
            if (existingReview.userId === id) {
                return res.status(201).json(updatedReview)
            } else {
                return res.status(403).json({
                    message: 'Вы не можете редактировать чужие отзывы'
                })
            }
        } else {
            return res.status(403).json({
                message: 'Вы пытаетесь обновить отзыв, которого не существует'
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Не удалось добавить обзор",
            error: error.message
        })
    }
}

export const deleteReview = async (req: RequestWithUser, res: Response) => {
    const { id } = req.user;
    const { reviewId } = req.params;

    try {
        const reviewToDelete: Review = await prisma.review.findUnique({
            where: { id: reviewId }
        });
        if (!reviewToDelete) {
            return res.status(404).json({ message: 'Обзор не найден' });
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
        res.status(500).json({
            message: "Не удалось удалить обзор",
            error: error.message
        });
    }
}
import { Beer } from "@prisma/client";
import { sortOptions } from "../../config/sortingConfig";
import { prisma } from "../../prisma/script";
import { FilterOptions } from "../../types/types";
import { handleServerError } from "../../utils/handleServerError";
import { Request, Response } from 'express';

//даже если req не используется, его все равно надо указывать в параметрах
export const getBeers = async (req: Request, res: Response) => {
    // sort - query-параметр для сортировки 
    const { page, per_page, brewery, type, sort } = req.query;

    const pageNumber = Number(page as string) || 1;
    const itemsPerPage = Number(per_page as string) || 228;

    const filterOptions: FilterOptions = {
        skip: (pageNumber - 1) * itemsPerPage,
        take: itemsPerPage,
        where: {},
        orderBy: {
            // по дефолту сортировка идет по дате добавления
            createdAt: sort === 'asc' ? 'asc' : 'desc' 
        }
    };
    // filterAdditionalParams имеет тип объекта, который может содержать бесконечное количество пар ключ-значение
    const filterParams: { [key: string]: string } = {
        brewery: brewery as string,
        type: type as string
    };

    Object.entries(filterParams).forEach(([key, value]) => {
        if (value) {
            filterOptions.where[key] = value;
        }
    });


    if (sort && sortOptions[sort as string]) {
        const { field, order } = sortOptions[sort as string];
        filterOptions.orderBy = {
            [field]: order
        };
    }

    if (pageNumber < 1 || itemsPerPage < 1) {
        return res.status(400).json({
            message: 'Неправильные параметры запроса'
        });
    }

    try {
        const beers: Beer[] = await prisma.beer.findMany(filterOptions);

        if (beers && beers.length >= 1) {
            return res.status(200).json(beers);
        } else {
            return res.status(400).json({
                message: 'Список пива пуст'
            });
        }
    } catch (error) {
        handleServerError(res, 'Не удалось получить список пива', error);
    }
};
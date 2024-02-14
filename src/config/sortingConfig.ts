import { SortOption } from "@/types/types";

export const sortOptions: Record<string, SortOption> = {
    viewsCountDesc: {
        field: 'viewsCount',
        order: 'desc'
    },
    viewsCountAsc: {
        field: 'viewsCount',
        order: 'asc'
    },
    abvDesc: {
        field: 'abv',
        order: 'desc'
    },
    abvAsc: {
        field: 'abv',
        order: 'desc'
    },
    // Другие варианты сортировки могут быть добавлены аналогичным образом
};
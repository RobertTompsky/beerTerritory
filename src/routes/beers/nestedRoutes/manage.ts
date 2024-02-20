import express from 'express';
import { 
    addBeer, 
    addBeerToFavorite, 
    deleteBeer, 
    removeBeerFromFavourites, 
    updateBeer } 
    from '@/controllers/beers/manage';
import { auth } from '@/middleware/auth';
import { zodValidation } from '@/middleware/zodValidation';
import { beerSchema } from '@/zodSchemas/zodSchemas';
import { ReviewsRoutes } from '.';

const router = express.Router()

router.post('/add', auth, zodValidation(beerSchema), addBeer)

router.patch('/:beerId/update', auth, zodValidation(beerSchema), updateBeer)
router.delete('/:beerId/delete', auth, deleteBeer)

router.post('/:beerId/add_to_favourites', auth, addBeerToFavorite)
router.delete('/:beerId/remove_from_favourites', auth, removeBeerFromFavourites)

router.use(ReviewsRoutes)

export default router
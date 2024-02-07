import express from 'express';
import {
    addBeer,
    addBeerToFavourite,
    addReview,
    deleteBeer,
    deleteReview,
    getAllBeers,
    getAllSelectedBeerReviews,
    getSelectedBeer,
    getSelectedBeerSelectedReview,
    removeBeerFromFavourites,
    updateBeer,
    updateReview
} from '../controllers/beerController';
import { auth } from '../middleware/auth';
import { zodValidation } from '../middleware/zodValidation';
import { beerSchema, reviewSchema } from '../zodSchemas/zodSchemas';

const router = express.Router()

router.get('/', getAllBeers)
router.get('/:beerId', getSelectedBeer)
router.post('/add', auth, zodValidation(beerSchema), addBeer)
router.patch('/:beerId/update', auth, zodValidation(beerSchema), updateBeer)
router.delete('/:beerId/delete', auth, deleteBeer)

router.post('/:beerId/add_to_favourites', auth, addBeerToFavourite)
router.delete('/:beerId/remove_from_favourites', auth, removeBeerFromFavourites)

router.get('/:beerId/reviews', auth, getAllSelectedBeerReviews)
router.get('/:beerId/reviews/:reviewId', auth, getSelectedBeerSelectedReview)
router.post('/:beerId/add_review', auth, zodValidation(reviewSchema), addReview)
router.patch('/:beerId/reviews/:reviewId/edit', auth, zodValidation(reviewSchema), updateReview)
router.delete('/:beerId/reviews/:reviewId/delete', auth, deleteReview)

export default router
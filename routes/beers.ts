import express from 'express';
import { addBeer, addReview, deleteBeer, deleteReview, getAllBeers, getAllSelectedBeerReviews, getSelectedBeer, getSelectedBeerSelectedReview, updateBeer, updateReview } from '../controllers/beerController';
import { auth } from '../middleware/auth';

const router = express.Router()

router.get('/', getAllBeers)
router.get('/:beerId', getSelectedBeer)
router.post('/add', auth, addBeer)
router.patch('/:beerId/update', auth, updateBeer)
router.delete('/:beerId/delete', auth, deleteBeer)

router.get('/:beerId/reviews', auth, getAllSelectedBeerReviews)
router.get('/:beerId/reviews/:reviewId', auth, getSelectedBeerSelectedReview)
router.post('/:beerId/add_review', auth, addReview)
router.patch('/:beerId/reviews/:reviewId/edit', auth, updateReview)
router.delete('/:beerId/reviews/:reviewId/delete', auth, deleteReview)

export default router
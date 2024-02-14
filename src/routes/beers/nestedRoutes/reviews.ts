import { 
    getAllSelectedBeerReviews, 
    getSelectedBeerSelectedReview, 
    addReview, 
    updateReview, 
    deleteReview } 
    from '@/controllers/beers/reviews';
import { auth } from '@/middleware/auth';
import { zodValidation } from '@/middleware/zodValidation';
import { reviewSchema } from '@/zodSchemas/zodSchemas';
import express from 'express';

const router = express.Router()

router.get('/:beerId/reviews', auth, getAllSelectedBeerReviews)
router.get('/:beerId/reviews/:reviewId', auth, getSelectedBeerSelectedReview)
router.post('/:beerId/add_review', auth, zodValidation(reviewSchema), addReview)
router.patch('/:beerId/reviews/:reviewId/edit', auth, zodValidation(reviewSchema), updateReview)
router.delete('/:beerId/reviews/:reviewId/delete', auth, deleteReview)

export default router
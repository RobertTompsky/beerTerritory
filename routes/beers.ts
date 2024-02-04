import express from 'express';
import { addBeer, getAllBeers, getSelectedBeer, updateBeer } from '../controllers/beerController';
import { auth } from '../middleware/auth';

const router = express.Router()

router.get('/', getAllBeers)
router.get('/:beerId', getSelectedBeer)
router.post('/add', auth, addBeer)
router.patch('/:beerId/update', auth, updateBeer)

export default router
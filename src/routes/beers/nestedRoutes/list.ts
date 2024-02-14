import express from 'express';
import { getBeers, getSelectedBeer } from '@/controllers/beers/list';
import { auth } from '@/middleware/auth';

const router = express.Router()

router.get('/', auth, getBeers)
router.get('/:beerId', auth, getSelectedBeer)

export default router
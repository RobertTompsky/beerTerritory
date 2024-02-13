import express from 'express';
import { auth } from '../middleware/auth';
import { searchBeers } from '../controllers/search/SearchBeers';

const router = express.Router()

router.get('/beers_by_name', auth, searchBeers)

export default router
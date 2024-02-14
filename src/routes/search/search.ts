import { searchBeers } from '@/controllers/search';
import { auth } from '@/middleware/auth';
import express from 'express';

const router = express.Router()

router.get('/beers_by_name', auth, searchBeers)

export default router
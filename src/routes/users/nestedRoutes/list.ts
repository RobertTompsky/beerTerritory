import express from 'express';

import { getAllUsers, getUser } from '@/controllers/users/list';
import { auth } from '@/middleware/auth';

const router = express.Router()

router.get('/', auth, getAllUsers)
router.get('/:id', auth, getUser)

export default router

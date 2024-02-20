import { uploadImage } from '@/controllers/images/uploadImage';
import { auth } from '@/middleware/auth';
import express from 'express';

const router = express.Router()

router.post('/', auth, uploadImage)

export default router
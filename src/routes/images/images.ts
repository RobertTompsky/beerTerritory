import { uploadImage, getImage } from '@/controllers/images';
import { auth } from '@/middleware/auth';
import express from 'express';

const router = express.Router()

router.post('/', auth, uploadImage)
router.get('/:imageName', getImage)

export default router
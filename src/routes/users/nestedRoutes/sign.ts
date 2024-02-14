import { logIn, logOut, register } from '@/controllers/users/sign';
import { auth } from '@/middleware/auth';
import { zodValidation } from '@/middleware/zodValidation';
import { userRegistrationSchema, userLoginSchema } from '@/zodSchemas/zodSchemas';
import express from 'express';

const router = express.Router()

router.post('/register', zodValidation(userRegistrationSchema), register)
router.post('/login', zodValidation(userLoginSchema), logIn)
router.post('/logout', auth, logOut)

export default router


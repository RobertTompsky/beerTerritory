import express from 'express';
import {register, login, getUser, deleteUser, createUserProfile, updateUserProfile, getMe, getAllUsers} from '../controllers/userController'
import { auth } from '../middleware/auth';
import { zodValidation } from '../middleware/zodValidation';
import { profileSchema, userLoginSchema, userRegistrationSchema } from '../zodSchemas/zodSchemas';

const router = express.Router()

router.post('/register', zodValidation(userRegistrationSchema), register)
router.post('/login', zodValidation(userLoginSchema), login)

router.get('/', auth, getAllUsers)
router.get('/:id', auth, getUser)
router.get('/me', auth, getMe)

router.delete('/me/delete', auth, deleteUser)

router.post('/me/create_profile', auth, zodValidation(profileSchema), createUserProfile)
router.patch('/me/update_profile', auth, zodValidation(profileSchema), updateUserProfile)

export default router
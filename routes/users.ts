import express from 'express';
import {register, login, getUser, deleteUser, createUserProfile, updateUserProfile, getSelectedUserProfile, getMe, getAllUsers} from '../controllers/userController'
import { ROUTES } from '../config/routesConfig';
import { auth } from '../middleware/auth';

const router = express.Router()

router.post(ROUTES.REGISTER, register)
router.post('/login', login)

router.get('/', auth, getAllUsers)
router.get('/:id', auth, getUser)
router.get('/me', auth, getMe)

router.delete('/me/delete', auth, deleteUser)

router.post('/me/create_profile', auth, createUserProfile)
router.patch('/me/update_profile', auth, updateUserProfile)
router.get('/:id/profile', auth, getSelectedUserProfile)

export default router
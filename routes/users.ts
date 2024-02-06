import express from 'express';
import {register, login, getUser, deleteUser, createUserProfile, updateUserProfile, getSelectedUserProfile} from '../controllers/userController'
import { ROUTES } from '../config/routesConfig';
import { auth } from '../middleware/auth';

const router = express.Router()

router.post(ROUTES.REGISTER, register)
router.post('/login', login)
router.get('/:id', auth, getUser)
// Get /me через req.user
router.delete('/:id/delete', auth, deleteUser)
// DELETE /me/delete req.user
router.post('/:id/create_profile', auth, createUserProfile)
router.patch('/:id/update_profile', auth, updateUserProfile)
router.get('/:id/profile', auth, getSelectedUserProfile)

export default router
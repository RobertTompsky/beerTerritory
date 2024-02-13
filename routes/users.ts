import express, {Request} from 'express';
import {register, logIn, getUser, deleteUser, createUserProfile, updateUserProfile, getMe, getAllUsers, logOut} from '../controllers/userController'
import { auth } from '../middleware/auth';
import { zodValidation } from '../middleware/zodValidation';
import { profileSchema, userLoginSchema, userRegistrationSchema } from '../zodSchemas/zodSchemas';
import { fileUploader } from '../middleware/fileUploader';

const router = express.Router()

router.post('/register', zodValidation(userRegistrationSchema), register)
router.post('/login', zodValidation(userLoginSchema), logIn)
router.post('/logout', auth, logOut)

router.get('/', auth, getAllUsers)
router.get('/:id', auth, getUser)
router.get('/me', auth, getMe)

router.delete('/me/delete', auth, deleteUser)
// порядок fileuploader и zodValidation должен быть таким, так как  multer "разбирает" данные формы, включая файл, 
// перед тем как zodValidation имеет возможность проверить поля. 
router.post('/me/create_profile', auth, fileUploader('avatar'), zodValidation(profileSchema), createUserProfile)
router.patch('/me/update_profile', auth, fileUploader('avatar'), zodValidation(profileSchema), updateUserProfile)

export default router
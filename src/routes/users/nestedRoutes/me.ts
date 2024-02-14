import { getMe, 
    deleteUser, 
    createUserProfile, 
    updateUserProfile } 
    from '@/controllers/users/me';
import { auth } from '@/middleware/auth';
import { fileUploader } from '@/middleware/fileUploader';
import { zodValidation } from '@/middleware/zodValidation';
import { profileSchema } from '@/zodSchemas/zodSchemas';
import express from 'express';

const router = express.Router()

router.get('/', auth, getMe)
router.delete('/delete', auth, deleteUser)
// порядок fileuploader и zodValidation должен быть таким, так как  multer "разбирает" данные формы, включая файл, 
// перед тем как zodValidation имеет возможность проверить поля. 
router.post('/create_profile', auth, fileUploader('avatar'), zodValidation(profileSchema), createUserProfile)
router.patch('/update_profile', auth, fileUploader('avatar'), zodValidation(profileSchema), updateUserProfile)

export default router
import express from 'express';
import SignRoutes from './nestedRoutes/sign'
import ListRoutes from './nestedRoutes/list'
import MeRoutes from './nestedRoutes/me'

const router = express.Router()

router.use('/sign', SignRoutes)
router.use('/list', ListRoutes)
router.use('/me', MeRoutes)

export default router

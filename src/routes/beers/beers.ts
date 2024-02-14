import express from 'express';
import ListRoutes from './nestedRoutes/list'
import ManageRoutes from './nestedRoutes/manage'

const router = express.Router()

router.use('/list', ListRoutes)
router.use('/manage', ManageRoutes)

export default router
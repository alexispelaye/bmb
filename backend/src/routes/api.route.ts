import { Router } from 'express';
import authRouter from './auth.route';
import equipmentRouter from './equipment.route';
import bomberoRouter from './bombero.route';
import controlRouter from './control.route';

const router = Router();

router.use('/auth', authRouter)
router.use('/equipamientos', equipmentRouter)
router.use('/bomberos', bomberoRouter)
router.use('/controles', controlRouter)
export default router;

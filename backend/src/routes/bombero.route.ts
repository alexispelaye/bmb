import { Router } from "express";
import { addEquipment, create, getAll, getById, getStats, refresh } from "../controllers/bombero.controller";

const router = Router()

router.get('/', getAll);
router.get('/stats', getStats);
router.get('/refresh', refresh);
router.get('/:id', getById);
router.post('/', create);
router.post('/añadir-equipamiento', addEquipment);

export default router;

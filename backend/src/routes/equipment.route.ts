import { Router } from "express";
import { createEquipment, getEquipment, getEquipmentById, updateEquipmentStatus } from "../controllers/equipment.controller";

const router = Router();

router.get('/', getEquipment)
router.get('/:id', getEquipmentById)
router.post('/', createEquipment)
router.patch('/:id', updateEquipmentStatus)
export default router;

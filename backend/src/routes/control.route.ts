import { Router } from "express";
import { addControl, getAllControl, getControlByMonth, getControlByMonthAndMovil } from "../controllers/control.controller";

const router = Router();

router.get('/', getAllControl)
router.get('/:mes', getControlByMonth)
router.get('/:movil/:mes', getControlByMonthAndMovil)
router.post('/', addControl)

export default router;

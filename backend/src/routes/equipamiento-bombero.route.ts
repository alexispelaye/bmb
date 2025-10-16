import { Router } from "express";
import { updateStatus, getAll } from "../controllers/equipamiento-bombero.controller";

const router = Router();

router.get('/', getAll)
router.patch('/:idBombero', updateStatus)

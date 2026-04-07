import { Router } from "express";
import controlador from "../controllers/pacienteController.js";
import { verificarRol } from "../middlewares/rolesMiddleware.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

export const router = Router();

router.post('/', verificarToken, verificarRol('admin', 'recepcionista'), controlador.crear);
router.get('/', verificarToken, controlador.listar);
router.delete('/:id', verificarToken, verificarRol('admin'), controlador.eliminar);
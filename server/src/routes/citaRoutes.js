import { Router } from "express";
import controlador from "../controllers/citaController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { verificarRol } from "../middlewares/rolesMiddleware.js";

export const router = Router();

router.post('/', verificarToken, verificarRol('admin', 'recepcionista'), controlador.crear);
router.get('/', verificarToken, controlador.listar);
router.patch('/:id/cancelar', verificarToken, verificarRol('admin', 'recepcionista'), controlador.cancelar);
router.get('/mis-citas', verificarToken, verificarRol('medico'), controlador.misCitas);
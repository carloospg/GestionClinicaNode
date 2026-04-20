import { Router } from "express";
import controlador from "../controllers/historialController.js";
import { verificarRol } from "../middlewares/rolesMiddleware.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

export const router = Router();

router.post('/:id_paciente', verificarToken, verificarRol('medico'), controlador.addEntrada);
router.get('/:id_paciente', verificarToken, verificarRol('medico', 'admin'), controlador.obtenerHistorial)
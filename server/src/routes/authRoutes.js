import { Router } from 'express';
import controlador from '../controllers/authController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarRol } from '../middlewares/rolesMiddleware.js';

export const router = Router();

router.post('/login', controlador.login);
router.post('/registro', verificarToken, verificarRol('admin'), controlador.registrar);
router.get('/usuarios', verificarToken, verificarRol('admin'), controlador.listar);
router.delete('/usuarios/:id', verificarToken, verificarRol('admin'), controlador.eliminar);
router.put('/usuarios/:id', verificarToken, verificarRol('admin'), controlador.actualizarRol);
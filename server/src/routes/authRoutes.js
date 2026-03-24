import { Router } from 'express';
import controlador from '../controllers/authController.js';

export const router = Router();

router.post('/login', controlador.login);
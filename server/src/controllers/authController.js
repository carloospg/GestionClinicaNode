import { response, request } from 'express';
import jwt from 'jsonwebtoken';
import AuthService from '../services/authService.js';

const controlador = {
  login: async (req = request, res = response) => {
    try {
      const { email, password } = req.body;

      const service = new AuthService();
      const usuario = await service.loginUsuario(email, password);

      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          rol: usuario.rol,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(200).json({
        ok: true,
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      });

    } catch (err) {
      res.status(401).json({ ok: false, msg: err.message });
    }
  },

};

export default controlador;
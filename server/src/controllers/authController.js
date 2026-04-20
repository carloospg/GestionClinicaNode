import { response, request } from "express";
import jwt from "jsonwebtoken";
import AuthService from "../services/authService.js";

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
        { expiresIn: process.env.JWT_EXPIRES_IN },
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

  registrar: async (req = request, res = response) => {
    try {
      const { nombre, email, password, rol } = req.body;

      if (rol === "admin") {
        return res.status(403).json({
          ok: false,
          msg: "No se puede crear un usuario admin",
        });
      }

      const service = new AuthService();
      const usuario = await service.registrarUsuario(
        nombre,
        email,
        password,
        rol,
      );

      res.status(201).json({
        ok: true,
        msg: "Usuario creado correctamente",
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      });
    } catch (err) {
      res.status(400).json({
        ok: false,
        msg: err.message,
      });
    }
  },

  listar: async (req = request, res = response) => {
    try {
      const service = new AuthService();
      const usuarios = await service.listarUsuarios();

      res.status(200).json({
        ok: true,
        usuarios,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        msg: err.message,
      });
    }
  },

  eliminar: async (req = request, res = response) => {
    try {
      const { id } = req.params;
      const service = new AuthService();
      const usuario = await service.eliminarUsuario(id);

      res.status(200).json({
        ok: true,
        msg: "Usuario eliminado correctamente",
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      });
    } catch (err) {
      res.status(400).json({
        ok: false,
        msg: err.message,
      });
    }
  },

  actualizarRol: async (req = request, res = response) => {
    try {
      const { id } = req.params;
      const { rol } = req.body;

      const rolesValidos = ["admin", "medico", "recepcionista"];
      if (!rolesValidos.includes(rol)) {
        return res.status(400).json({
          ok: false,
          msg: "Rol no valido",
        });
      }

      const service = new AuthService();
      const usuario = await service.actualizarRolUsuario(id, rol);

      res.status(200).json({
        ok: true,
        msg: "Rol modificado correctamente",
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      });
    } catch (err) {
      res.status(400).json({
        ok: false,
        msg: err.message,
      });
    }
  },

  listarMedicos: async (req = request, res = response) => {
    try {
      const service = new AuthService();
      const medicos = await service.listarMedicos();

      res.status(200).json({
        ok: true,
        medicos,
      });
    } catch (err) {
      res.status(500).json({ ok: false, msg: err.message });
    }
  },
};

export default controlador;

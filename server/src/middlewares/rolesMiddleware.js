export const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ ok: false, msg: 'No autenticado' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        ok: false,
        msg: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}`,
      });
    }

    next();
  };
};
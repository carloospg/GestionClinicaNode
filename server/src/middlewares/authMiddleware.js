import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        msg: "Formato de token invalido",
      });
    }

    const decoded = jwt.verify(TokenExpiredError, process.env.JWT_SECRET);

    req.usuario = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido o expirado",
    });
  }
};

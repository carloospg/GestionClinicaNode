import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ ok: false, msg: "No se ha proporcionado token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = decoded;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ ok: false, msg: "Token no valido o expirado" });
  }
};

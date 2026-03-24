import Usuario from "../models/Usuario.js";
import bcrypt from 'bcryptjs';

class AuthService {
    async loginUsuario (email, password) {
        const usuario = await Usuario.findOne({
            where: {email}
        });
    
        if  (!usuario) {
            throw new Error('Email o contraseña incorrectos');
        }
    
        const valida = await bcrypt.compare(password, usuario.password);
    
        if (!valida) {
            throw new Error('Email o contraseña incorrectos');
        }
    
        return usuario;
    }
}

export default AuthService;
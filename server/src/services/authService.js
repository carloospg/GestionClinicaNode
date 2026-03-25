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

    async registrarUsuario(nombre, email, password, rol) {
        const existe = await Usuario.findOne({
            where: {
                email
            }
        })

        if (existe) {
            throw new Error('Ya existe un usuario con ese correo')
        }

        const hash = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            nombre,
            email,
            password: hash,
            rol
        })

        return usuario;
    }

    async listarUsuarios() {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'email', 'rol'],
        });
        return usuarios;
    }

    async eliminarUsuario(id) {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            throw new Error('Usuario no encontrado')
        }

        await usuario.destroy();
        return usuario;
    }
}

export default AuthService;
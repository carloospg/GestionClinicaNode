import { initNavbar } from './navbar.js';

const token = sessionStorage.getItem('token');
const usuario = JSON.parse(sessionStorage.getItem('usuario'));

if (!token || !usuario) {
  window.location.href = 'login.html';
}

initNavbar('perfil');

document.getElementById('perfil-nombre').textContent = usuario.nombre;
document.getElementById('perfil-email').textContent = usuario.email;
document.getElementById('perfil-rol').textContent = usuario.rol;

document.getElementById('btn-logout').addEventListener('click', () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('usuario');
  window.location.href = 'login.html';
});
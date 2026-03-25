const API_URL = 'http://localhost:3000/api';

const token = sessionStorage.getItem('token');
const usuario = JSON.parse(sessionStorage.getItem('usuario'));

if (!token || !usuario) {
  window.location.href = 'login.html';
}

if (usuario.rol !== 'admin') {
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('registro-form');
  const errorMsg = document.getElementById('error-msg');
  const successMsg = document.getElementById('success-msg');

  document.getElementById('toggle-password').addEventListener('click', () => {
    const input = document.getElementById('password');
    const icono = document.getElementById('icono-ojo');
    if (input.type === 'password') {
      input.type = 'text';
      icono.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
      input.type = 'password';
      icono.classList.replace('bi-eye-slash', 'bi-eye');
    }
  });

  document.getElementById('btn-volver').addEventListener('click', () => {
    window.location.href = 'usuarios.html';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;

    try {
      const response = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, email, password, rol }),
      });

      const data = await response.json();

      if (!data.ok) {
        errorMsg.textContent = data.msg;
        errorMsg.classList.remove('d-none');
        successMsg.classList.add('d-none');
        return;
      }

      successMsg.textContent = `Usuario ${data.usuario.nombre} creado correctamente`;
      successMsg.classList.remove('d-none');
      errorMsg.classList.add('d-none');
      form.reset();

    } catch (err) {
      errorMsg.textContent = 'Error al conectar con el servidor';
      errorMsg.classList.remove('d-none');
    }
  });

});
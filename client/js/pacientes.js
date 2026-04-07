import { initNavbar } from './navbar.js';

const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');
const usuario = JSON.parse(sessionStorage.getItem('usuario'));

if (!token || !usuario) {
  window.location.href = 'login.html';
}

if (usuario.rol !== 'admin' && usuario.rol !== 'recepcionista') {
  window.location.href = 'index.html';
}

initNavbar('pacientes');

const cargarPacientes = async () => {
  try {
    const response = await fetch(`${API_URL}/pacientes`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();

    if (!data.ok) {
      document.getElementById('error-msg').textContent = data.msg;
      document.getElementById('error-msg').classList.remove('d-none');
      return;
    }

    const tbody = document.getElementById('tabla-pacientes');
    tbody.innerHTML = '';

    data.pacientes.forEach(p => {
      tbody.innerHTML += `
        <tr>
          <td>${p.id}</td>
          <td>${p.nombre}</td>
          <td>${p.apellidos}</td>
          <td>${p.dni}</td>
          <td>${p.telefono || '-'}</td>
          <td>${p.fecha_nacimiento || '-'}</td>
          <td>
            ${usuario.rol === 'admin' ? `
              <button class="btn btn-danger btn-sm" onclick="eliminarPaciente(${p.id})">
                <i class="bi bi-trash"></i>
              </button>
            ` : ''}
          </td>
        </tr>
      `;
    });

  } catch (err) {
    document.getElementById('error-msg').textContent = 'Error al conectar con el servidor';
    document.getElementById('error-msg').classList.remove('d-none');
  }
};

const eliminarPaciente = async (id) => {
  if (!confirm('¿Estas seguro de que quieres eliminar este paciente?')) return;

  try {
    const response = await fetch(`${API_URL}/pacientes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();

    if (!data.ok) {
      alert(data.msg);
      return;
    }

    cargarPacientes();

  } catch (err) {
    alert('Error al conectar con el servidor');
  }
};

window.eliminarPaciente = eliminarPaciente;

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('btn-nuevo-paciente').addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('modal-paciente'));
    modal.show();
  });

  document.getElementById('btn-guardar-paciente').addEventListener('click', async () => {
    const nombre = document.getElementById('input-nombre').value;
    const apellidos = document.getElementById('input-apellidos').value;
    const dni = document.getElementById('input-dni').value;
    const telefono = document.getElementById('input-telefono').value;
    const fecha_nacimiento = document.getElementById('input-fecha').value;

    const modalError = document.getElementById('modal-error');

    try {
      const response = await fetch(`${API_URL}/pacientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, apellidos, dni, telefono, fecha_nacimiento }),
      });

      const data = await response.json();

      if (!data.ok) {
        modalError.textContent = data.msg;
        modalError.classList.remove('d-none');
        return;
      }

      bootstrap.Modal.getInstance(document.getElementById('modal-paciente')).hide();
      modalError.classList.add('d-none');
      document.getElementById('input-nombre').value = '';
      document.getElementById('input-apellidos').value = '';
      document.getElementById('input-dni').value = '';
      document.getElementById('input-telefono').value = '';
      document.getElementById('input-fecha').value = '';
      cargarPacientes();

    } catch (err) {
      modalError.textContent = 'Error al conectar con el servidor';
      modalError.classList.remove('d-none');
    }
  });

});

cargarPacientes();
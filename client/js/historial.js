import { initNavbar } from './navbar.js';

const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');
const usuario = JSON.parse(sessionStorage.getItem('usuario'));

if (!token || !usuario) {
  window.location.href = 'login.html';
}

if (usuario.rol !== 'medico' && usuario.rol !== 'admin') {
  window.location.href = 'index.html';
}

initNavbar('historial');

// Cargamos los pacientes en el desplegable
const cargarPacientes = async () => {
  try {
    const response = await fetch(`${API_URL}/pacientes`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();

    const select = document.getElementById('select-paciente');
    data.pacientes.forEach(p => {
      select.innerHTML += `<option value="${p.id}">${p.nombre} ${p.apellidos} - ${p.dni}</option>`;
    });

  } catch (err) {
    console.error('Error al cargar pacientes:', err);
  }
};

document.addEventListener('DOMContentLoaded', () => {

  cargarPacientes();

  document.getElementById('btn-buscar').addEventListener('click', async () => {
    const id_paciente = document.getElementById('select-paciente').value;
    const errorMsg = document.getElementById('error-msg');
    const sinHistorial = document.getElementById('sin-historial');
    const contenedor = document.getElementById('contenedor-historial');
    const listaEntradas = document.getElementById('lista-entradas');

    if (!id_paciente) {
      errorMsg.textContent = 'Selecciona un paciente';
      errorMsg.classList.remove('d-none');
      return;
    }

    errorMsg.classList.add('d-none');
    sinHistorial.classList.add('d-none');
    contenedor.classList.add('d-none');

    try {
      const response = await fetch(`${API_URL}/historial/${id_paciente}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (!data.ok) {
        sinHistorial.classList.remove('d-none');
        return;
      }

      // Mostramos las entradas
      listaEntradas.innerHTML = '';

      data.historial.entradas.forEach((entrada, index) => {
        listaEntradas.innerHTML += `
          <div class="card shadow-sm mb-3">
            <div class="card-header bg-primary text-white">
              <strong>Entrada ${index + 1}</strong> — ${new Date(entrada.fecha).toLocaleString()}
            </div>
            <div class="card-body">
              <div class="mb-2">
                <span class="text-muted">Medico ID:</span> ${entrada.id_medico}
              </div>
              <div class="mb-2">
                <span class="text-muted">Observaciones:</span> ${entrada.observaciones}
              </div>
              <div class="mb-2">
                <span class="text-muted">Diagnostico:</span> ${entrada.diagnostico}
              </div>
              <div class="mb-2">
                <span class="text-muted">Tratamiento:</span> ${entrada.tratamiento}
              </div>
            </div>
          </div>
        `;
      });

      contenedor.classList.remove('d-none');

    } catch (err) {
      errorMsg.textContent = 'Error al conectar con el servidor';
      errorMsg.classList.remove('d-none');
    }
  });

});
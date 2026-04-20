import { initNavbar } from './navbar.js';

const API_URL = 'http://localhost:3000/api';
const token = sessionStorage.getItem('token');
const usuario = JSON.parse(sessionStorage.getItem('usuario'));

if (!token || !usuario) {
  window.location.href = 'login.html';
}

if (usuario.rol !== 'medico') {
  window.location.href = 'index.html';
}

initNavbar('mis-citas');

const socket = io('http://localhost:3000');
socket.emit('unirse-sala', usuario.id);

const mostrarNotificacion = (mensaje, tipo = 'primary') => {
  const contenedor = document.getElementById('contenedor-notificaciones');
  const id = `notif-${Date.now()}`;

  contenedor.innerHTML += `
    <div id="${id}" class="toast align-items-center text-bg-${tipo} border-0 show mb-2" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          <i class="bi bi-bell-fill me-2"></i>${mensaje}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="document.getElementById('${id}').remove()"></button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.remove();
  }, 5000);
};

socket.on('cita-estado-cambiado', (data) => {
  const tipo = data.estado === 'finalizada' ? 'success' : 'warning';
  mostrarNotificacion(data.msg, tipo);
  cargarMisCitas();
});

socket.on('cita-asignada', (data) => {
  mostrarNotificacion(data.msg, 'primary');
  cargarMisCitas();
});

socket.on('actualizar-citas', () => {
  cargarMisCitas();
});

let citaFinalizandoId = null;

const getBadgeColor = (estado) => {
  switch (estado) {
    case 'pendiente': return 'warning';
    case 'en_curso': return 'primary';
    case 'finalizada': return 'success';
    case 'cancelada': return 'danger';
    default: return 'secondary';
  }
};

const cargarMisCitas = async () => {
  try {
    const response = await fetch(`${API_URL}/citas/mis-citas`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();

    if (!data.ok) {
      document.getElementById('error-msg').textContent = data.msg;
      document.getElementById('error-msg').classList.remove('d-none');
      return;
    }

    const tbody = document.getElementById('tabla-mis-citas');
    tbody.innerHTML = '';

    if (data.citas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted">No tienes citas asignadas</td>
        </tr>
      `;
      return;
    }

    data.citas.forEach(c => {
      tbody.innerHTML += `
        <tr>
          <td>${c.id}</td>
          <td>${c.id_paciente}</td>
          <td>${new Date(c.fecha_hora).toLocaleString()}</td>
          <td>${c.motivo || '-'}</td>
          <td><span class="badge bg-${getBadgeColor(c.estado)}">${c.estado}</span></td>
          <td>
            ${c.estado === 'pendiente' ? `
              <button class="btn btn-primary btn-sm" onclick="cambiarEstado(${c.id}, 'en_curso')">
                <i class="bi bi-play-circle"></i>
              </button>
            ` : ''}
            ${c.estado === 'en_curso' ? `
              <button class="btn btn-success btn-sm" onclick="abrirModalFinalizar(${c.id})">
                <i class="bi bi-check-circle"></i>
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

const cambiarEstado = async (id, estado) => {
  try {
    const response = await fetch(`${API_URL}/citas/${id}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ estado }),
    });

    const data = await response.json();

    if (!data.ok) {
      alert(data.msg);
      return;
    }

    cargarMisCitas();

  } catch (err) {
    alert('Error al conectar con el servidor');
  }
};

const abrirModalFinalizar = (id) => {
  citaFinalizandoId = id;
  document.getElementById('input-observaciones').value = '';
  document.getElementById('input-diagnostico').value = '';
  document.getElementById('input-tratamiento').value = '';
  document.getElementById('modal-error').classList.add('d-none');
  const modal = new bootstrap.Modal(document.getElementById('modal-finalizar'));
  modal.show();
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-confirmar-finalizar').addEventListener('click', async () => {
    const observaciones = document.getElementById('input-observaciones').value;
    const diagnostico = document.getElementById('input-diagnostico').value;
    const tratamiento = document.getElementById('input-tratamiento').value;
    const modalError = document.getElementById('modal-error');

    if (!observaciones || !diagnostico || !tratamiento) {
      modalError.textContent = 'Todos los campos son obligatorios';
      modalError.classList.remove('d-none');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/citas/${citaFinalizandoId}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          estado: 'finalizada',
          observaciones,
          diagnostico,
          tratamiento,
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        modalError.textContent = data.msg;
        modalError.classList.remove('d-none');
        return;
      }

      bootstrap.Modal.getInstance(document.getElementById('modal-finalizar')).hide();
      cargarMisCitas();

    } catch (err) {
      modalError.textContent = 'Error al conectar con el servidor';
      modalError.classList.remove('d-none');
    }
  });
});

window.cambiarEstado = cambiarEstado;
window.abrirModalFinalizar = abrirModalFinalizar;

cargarMisCitas();
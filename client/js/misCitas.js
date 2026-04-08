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
              <button class="btn btn-success btn-sm" onclick="cambiarEstado(${c.id}, 'finalizada')">
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

window.cambiarEstado = cambiarEstado;

cargarMisCitas();
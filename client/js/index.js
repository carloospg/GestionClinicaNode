import { initNavbar } from "./navbar.js";

const API_URL = "http://localhost:3000/api";
const token = sessionStorage.getItem("token");
const usuario = JSON.parse(sessionStorage.getItem("usuario"));

if (!token || !usuario) {
  window.location.href = "login.html";
}

initNavbar("index");

document.getElementById("bienvenida").textContent =
  `Bienvenido, ${usuario.nombre}`;

// Conectamos con Socket.io y nos unimos a nuestra sala personal
const socket = io("http://localhost:3000");
socket.emit("unirse-sala", usuario.id);

// Funcion para mostrar notificaciones
const mostrarNotificacion = (mensaje, tipo = "primary") => {
  const contenedor = document.getElementById("contenedor-notificaciones");
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

  // Eliminamos la notificacion automaticamente despues de 5 segundos
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.remove();
  }, 5000);
};

// Escuchamos eventos de Socket.io
socket.on("cita-asignada", (data) => {
  mostrarNotificacion(data.msg, "primary");
  cargarDatos();
});

socket.on("cita-estado-cambiado", (data) => {
  const tipo = data.estado === "finalizada" ? "success" : "warning";
  mostrarNotificacion(data.msg, tipo);
  cargarDatos();
});

socket.on("actualizar-citas", () => {
  cargarDatos();
});

// Mostramos el panel segun el rol
const mostrarPanel = () => {
  if (usuario.rol === "admin") {
    document.getElementById("panel-admin").classList.remove("d-none");
  } else if (usuario.rol === "medico") {
    document.getElementById("panel-medico").classList.remove("d-none");
  } else if (usuario.rol === "recepcionista") {
    document.getElementById("panel-recepcionista").classList.remove("d-none");
  }
};

const cargarDatos = async () => {
  if (usuario.rol === "admin") {
    await cargarMetricasAdmin();
  } else if (usuario.rol === "medico") {
    await cargarCitasMedico();
  } else if (usuario.rol === "recepcionista") {
    await cargarCitasRecepcionista();
  }
};

const cargarMetricasAdmin = async () => {
  try {
    const [resUsuarios, resPacientes, resCitas] = await Promise.all([
      fetch(`${API_URL}/auth/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_URL}/pacientes`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_URL}/citas`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const dataUsuarios = await resUsuarios.json();
    const dataPacientes = await resPacientes.json();
    const dataCitas = await resCitas.json();

    document.getElementById("total-usuarios").textContent =
      dataUsuarios.usuarios.length;
    document.getElementById("total-pacientes").textContent =
      dataPacientes.pacientes.length;
    document.getElementById("total-medicos").textContent =
      dataUsuarios.usuarios.filter((u) => u.rol === "medico").length;

    const hoy = new Date().toDateString();
    const citasHoy = dataCitas.citas.filter(
      (c) =>
        c.estado === "pendiente" &&
        new Date(c.fecha_hora).toDateString() === hoy,
    );
    document.getElementById("citas-hoy").textContent = citasHoy.length;
  } catch (err) {
    console.error("Error al cargar metricas:", err);
  }
};

const cargarCitasMedico = async () => {
  try {
    const response = await fetch(`${API_URL}/citas/mis-citas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    const hoy = new Date().toDateString();
    const citasHoy = data.citas.filter(
      (c) =>
        c.estado === "pendiente" &&
        new Date(c.fecha_hora).toDateString() === hoy,
    );

    document.getElementById("contador-citas-medico").textContent =
      citasHoy.length;

    const tbody = document.getElementById("tabla-citas-medico");
    tbody.innerHTML = "";

    if (citasHoy.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="4" class="text-center text-muted">No tienes citas pendientes hoy</td></tr>';
      return;
    }

    citasHoy.forEach((c) => {
      tbody.innerHTML += `
        <tr>
          <td>${c.id}</td>
          <td>${c.id_paciente}</td>
          <td>${new Date(c.fecha_hora).toLocaleTimeString()}</td>
          <td>${c.motivo || "-"}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error al cargar citas medico:", err);
  }
};

const cargarCitasRecepcionista = async () => {
  try {
    const response = await fetch(`${API_URL}/citas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    const hoy = new Date().toDateString();
    const citasHoy = data.citas.filter(
      (c) =>
        c.estado === "pendiente" &&
        new Date(c.fecha_hora).toDateString() === hoy,
    );

    document.getElementById("contador-citas-recepcionista").textContent =
      citasHoy.length;

    const tbody = document.getElementById("tabla-citas-recepcionista");
    tbody.innerHTML = "";

    if (citasHoy.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="text-center text-muted">No hay citas pendientes hoy</td></tr>';
      return;
    }

    citasHoy.forEach((c) => {
      tbody.innerHTML += `
        <tr>
          <td>${c.id}</td>
          <td>${c.id_paciente}</td>
          <td>${c.id_medico}</td>
          <td>${new Date(c.fecha_hora).toLocaleTimeString()}</td>
          <td>${c.motivo || "-"}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error al cargar citas recepcionista:", err);
  }
};

mostrarPanel();
cargarDatos();

import { initNavbar } from "./navbar.js";

const API_URL = "http://localhost:3000/api";
const token = sessionStorage.getItem("token");
const usuario = JSON.parse(sessionStorage.getItem("usuario"));

if (!token || !usuario) {
  window.location.href = "login.html";
}

if (usuario.rol !== "admin" && usuario.rol !== "recepcionista") {
  window.location.href = "index.html";
}

initNavbar("citas");

const getBadgeColor = (estado) => {
  switch (estado) {
    case "pendiente":
      return "warning";
    case "en_curso":
      return "primary";
    case "finalizada":
      return "success";
    case "cancelada":
      return "danger";
    default:
      return "secondary";
  }
};

const cargarCitas = async () => {
  try {
    const response = await fetch(`${API_URL}/citas`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!data.ok) {
      document.getElementById("error-msg").textContent = data.msg;
      document.getElementById("error-msg").classList.remove("d-none");
      return;
    }

    const tbody = document.getElementById("tabla-citas");
    tbody.innerHTML = "";

    data.citas.forEach((c) => {
      tbody.innerHTML += `
        <tr>
          <td>${c.id}</td>
          <td>${c.id_paciente}</td>
          <td>${c.id_medico}</td>
          <td>${new Date(c.fecha_hora).toLocaleString()}</td>
          <td>${c.motivo || "-"}</td>
          <td><span class="badge bg-${getBadgeColor(c.estado)}">${c.estado}</span></td>
          <td>
            ${
              c.estado === "pendiente"
                ? `
              <button class="btn btn-danger btn-sm" onclick="cancelarCita(${c.id})">
                <i class="bi bi-x-circle"></i>
              </button>
            `
                : ""
            }
          </td>
        </tr>
      `;
    });
  } catch (err) {
    document.getElementById("error-msg").textContent =
      "Error al conectar con el servidor";
    document.getElementById("error-msg").classList.remove("d-none");
  }
};

const cargarDesplegables = async () => {
  try {
    const resPacientes = await fetch(`${API_URL}/pacientes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dataPacientes = await resPacientes.json();

    const selectPaciente = document.getElementById("select-paciente");
    selectPaciente.innerHTML =
      '<option value="">Selecciona un paciente</option>';
    dataPacientes.pacientes.forEach((p) => {
      selectPaciente.innerHTML += `<option value="${p.id}">${p.nombre} ${p.apellidos} - ${p.dni}</option>`;
    });

    const resMedicos = await fetch(`${API_URL}/auth/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dataMedicos = await resMedicos.json();

    const selectMedico = document.getElementById("select-medico");
    selectMedico.innerHTML = '<option value="">Selecciona un medico</option>';
    dataMedicos.usuarios
      .filter((u) => u.rol === "medico")
      .forEach((m) => {
        selectMedico.innerHTML += `<option value="${m.id}">${m.nombre}</option>`;
      });
  } catch (err) {
    console.error("Error al cargar desplegables:", err);
  }
};

const cancelarCita = async (id) => {
  if (!confirm("¿Estas seguro de que quieres cancelar esta cita?")) return;

  try {
    const response = await fetch(`${API_URL}/citas/${id}/cancelar`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!data.ok) {
      alert(data.msg);
      return;
    }

    cargarCitas();
  } catch (err) {
    alert("Error al conectar con el servidor");
  }
};

window.cancelarCita = cancelarCita;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-nueva-cita").addEventListener("click", () => {
    cargarDesplegables();
    const modal = new bootstrap.Modal(document.getElementById("modal-cita"));
    modal.show();
  });

  document
    .getElementById("btn-guardar-cita")
    .addEventListener("click", async () => {
      const id_paciente = document.getElementById("select-paciente").value;
      const id_medico = document.getElementById("select-medico").value;
      const fecha_hora = document.getElementById("input-fecha").value;
      const motivo = document.getElementById("input-motivo").value;

      const modalError = document.getElementById("modal-error");

      if (!id_paciente || !id_medico || !fecha_hora) {
        modalError.textContent = "Paciente, medico y fecha son obligatorios";
        modalError.classList.remove("d-none");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/citas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id_paciente, id_medico, fecha_hora, motivo }),
        });

        const data = await response.json();

        if (!data.ok) {
          modalError.textContent = data.msg;
          modalError.classList.remove("d-none");
          return;
        }

        bootstrap.Modal.getInstance(
          document.getElementById("modal-cita"),
        ).hide();
        modalError.classList.add("d-none");
        cargarCitas();
      } catch (err) {
        modalError.textContent = "Error al conectar con el servidor";
        modalError.classList.remove("d-none");
      }
    });
});

cargarCitas();

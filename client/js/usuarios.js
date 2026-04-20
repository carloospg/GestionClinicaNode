import { initNavbar } from "./navbar.js";

const API_URL = "http://localhost:3000/api";
const token = sessionStorage.getItem("token");
const usuario = JSON.parse(sessionStorage.getItem("usuario"));

if (!token || !usuario) {
  window.location.href = "login.html";
}

if (usuario.rol !== "admin") {
  window.location.href = "index.html";
}

initNavbar("usuarios");

let usuarioEditandoId = null;

const cargarUsuarios = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!data.ok) {
      document.getElementById("error-msg").textContent = data.msg;
      document.getElementById("error-msg").classList.remove("d-none");
      return;
    }

    const tbody = document.getElementById("tabla-usuarios");
    tbody.innerHTML = "";

    data.usuarios.forEach((u) => {
      tbody.innerHTML += `
        <tr>
          <td>${u.id}</td>
          <td>${u.nombre}</td>
          <td>${u.email}</td>
          <td>${u.rol}</td>
          <td>
            <button class="btn btn-primary btn-sm me-1" onclick="abrirModalEditar(${u.id}, '${u.rol}')">
              <i class="bi bi-pencil"></i>
            </button>
            ${
              u.rol !== "admin"
                ? `
              <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${u.id})">
                <i class="bi bi-trash"></i>
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

const abrirModalEditar = (id, rolActual) => {
  usuarioEditandoId = id;
  document.getElementById("select-rol").value = rolActual;
  const modal = new bootstrap.Modal(document.getElementById("modal-editar"));
  modal.show();
};

const eliminarUsuario = async (id) => {
  if (!confirm("¿Estas seguro de que quieres eliminar este usuario?")) return;

  try {
    const response = await fetch(`${API_URL}/auth/usuarios/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!data.ok) {
      alert(data.msg);
      return;
    }

    cargarUsuarios();
  } catch (err) {
    alert("Error al conectar con el servidor");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("btn-guardar-rol")
    .addEventListener("click", async () => {
      const rol = document.getElementById("select-rol").value;

      try {
        const response = await fetch(
          `${API_URL}/auth/usuarios/${usuarioEditandoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ rol }),
          },
        );

        const data = await response.json();

        if (!data.ok) {
          alert(data.msg);
          return;
        }

        bootstrap.Modal.getInstance(
          document.getElementById("modal-editar"),
        ).hide();
        cargarUsuarios();
      } catch (err) {
        alert("Error al conectar con el servidor");
      }
    });
});

window.abrirModalEditar = abrirModalEditar;
window.eliminarUsuario = eliminarUsuario;

cargarUsuarios();

export function initNavbar(paginaActiva) {
  const token = sessionStorage.getItem("token");
  const userString = sessionStorage.getItem("usuario");

  if (!token || !userString) {
    window.location.href = "login.html";
    return;
  }

  const usuario = JSON.parse(userString);

  const linkUsuarios =
    usuario.rol === "admin"
      ? `
    <li class="nav-item">
      <a class="nav-link ${paginaActiva === "usuarios" ? "active" : ""}" href="usuarios.html">
        <i class="bi bi-people-fill me-1"></i> Usuarios
      </a>
    </li>
  `
      : "";

  const linkPacientes =
    usuario.rol === "admin" || usuario.rol === "recepcionista"
      ? `
    <li class="nav-item">
      <a class="nav-link ${paginaActiva === "pacientes" ? "active" : ""}" href="pacientes.html">
        <i class="bi bi-person-vcard me-1"></i> Pacientes
      </a>
    </li>
  `
      : "";

  const linkCitas =
    usuario.rol === "admin" || usuario.rol === "recepcionista"
      ? `
  <li class="nav-item">
    <a class="nav-link ${paginaActiva === "citas" ? "active" : ""}" href="citas.html">
      <i class="bi bi-calendar-check me-1"></i> Citas
    </a>
  </li>
`
      : "";

  const linkMisCitas =
    usuario.rol === "medico"
      ? `
  <li class="nav-item">
    <a class="nav-link ${paginaActiva === "misCitas" ? "active" : ""}" href="misCitas.html">
      <i class="bi bi-calendar2-check me-1"></i> Mis Citas
    </a>
  </li>
`
      : "";

  const linkHistorial =
    usuario.rol === "medico" || usuario.rol === "admin"
      ? `
  <li class="nav-item">
    <a class="nav-link ${paginaActiva === "historial" ? "active" : ""}" href="historial.html">
      <i class="bi bi-clipboard2-pulse me-1"></i> Historial
    </a>
  </li>
`
      : "";

  const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid px-4">
        <a class="navbar-brand fw-bold" href="index.html">
          <i class="bi bi-hospital me-2"></i>Gestion Clinica
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            ${linkUsuarios}
            ${linkPacientes}
            ${linkCitas}
            ${linkMisCitas}
            ${linkHistorial}
          </ul>
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
              ${usuario.nombre}
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
              <li>
                <a class="dropdown-item py-2" href="perfil.html">
                  <i class="bi bi-person-badge me-2 text-primary"></i>${usuario.nombre}
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item py-2 text-danger fw-bold" id="btn-logout-nav">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesion
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  `;

  const contenedor = document.getElementById("navbar-container");
  if (contenedor) contenedor.innerHTML = navbarHTML;

  document.getElementById("btn-logout-nav")?.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    window.location.href = "login.html";
  });
}

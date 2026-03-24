const token = sessionStorage.getItem("token");
const usuario = JSON.parse(sessionStorage.getItem("usuario"));

if (!token || !usuario) {
  window.location.href = "pages/login.html";
}

document.getElementById("perfil-nombre").textContent = usuario.nombre;
document.getElementById("perfil-email").textContent = usuario.email;
document.getElementById("perfil-rol").textContent = usuario.rol;

if (usuario.rol === "admin") {
  document.getElementById("btn-registro").classList.remove("d-none");
}

document.getElementById("btn-registro").addEventListener("click", () => {
  window.location.href = "pages/registro.html";
});

document.getElementById("btn-logout").addEventListener("click", () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("usuario");
  window.location.href = "pages/login.html";
});

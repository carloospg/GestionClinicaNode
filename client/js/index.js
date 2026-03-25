import { initNavbar } from "./navbar.js";

const token = sessionStorage.getItem("token");
const usuario = sessionStorage.getItem("usuario");

if (!token || !usuario) {
  window.location.href = "login.html";
}

initNavbar("index");

const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMsg = document.getElementById("error-msg");

  document.getElementById("toggle-password").addEventListener("click", () => {
    const input = document.getElementById("password");
    const icono = document.getElementById("icono-ojo");
    if (input.type === "password") {
      input.type = "text";
      icono.classList.replace("bi-eye", "bi-eye-slash");
    } else {
      input.type = "password";
      icono.classList.replace("bi-eye-slash", "bi-eye");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.ok) {
        errorMsg.textContent = data.msg;
        errorMsg.classList.remove("d-none");
        return;
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("usuario", JSON.stringify(data.usuario));

      window.location.href = "index.html";
    } catch (err) {
      errorMsg.textContent = "Error al conectar con el servidor";
      errorMsg.classList.remove("d-none");
    }
  });
});

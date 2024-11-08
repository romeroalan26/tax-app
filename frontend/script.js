// script.js

// Función para redirigir a WhatsApp
function contactarWhatsApp() {
  const telefono = "8094039726"; // Reemplaza esto con tu número real, incluyendo el código de país sin el "+"
  const mensaje =
    "Hola, me gustaría recibir asistencia para la preparación de mis impuestos.";
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

// Función para consultar el estado del proceso
let lastCodigo = ""; // Variable para almacenar el último código consultado

async function consultarEstado() {
  const codigo = document.getElementById("codigoConfirmacion").value;
  const estadoResultado = document.getElementById("estadoResultado");
  const consultaButton = document.querySelector(".consulta button");

  if (!codigo) {
    estadoResultado.textContent =
      "Por favor, ingresa un código de confirmación.";
    return;
  }

  // Evita llamadas si el código es el mismo que el anterior
  if (codigo === lastCodigo) {
    return;
  }

  lastCodigo = codigo; // Actualiza el último código consultado

  // Desactiva el botón temporalmente
  consultaButton.disabled = true;
  consultaButton.textContent = "Consultando...";

  try {
    // Realiza la solicitud a la API
    const respuesta = await fetch(
      `http://localhost:3000/api/clients/${codigo}`
    );
    const data = await respuesta.json();

    if (respuesta.ok) {
      estadoResultado.textContent = `Estado: ${data.estado}`;
    } else {
      estadoResultado.textContent = data.mensaje || "Código no encontrado";
    }
  } catch (error) {
    estadoResultado.textContent =
      "Error al consultar el estado. Inténtalo de nuevo más tarde.";
    console.error(error);
  } finally {
    // Reactiva el botón después de la consulta
    consultaButton.disabled = false;
    consultaButton.textContent = "Consultar Estado";
  }
}

// Añadir el evento de "Enter" al campo de entrada
document
  .getElementById("codigoConfirmacion")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      // Detecta la tecla Enter
      consultarEstado(); // Ejecuta la consulta
    }
  });

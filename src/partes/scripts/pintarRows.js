//Script para poder pintar un row si y un row no
//Cargamos la pagina
document.addEventListener("DOMContentLoaded", function () {
  // Supongamos que tienes una lista de divs
  const divs = document.querySelectorAll(".rowTable");
  // Función para aplicar estilos dinámicamente
  function aplicarEstilos() {
    divs.forEach((div, index) => {
      if (index % 2 === 0) {
        div.style.backgroundColor = "green"; // Resalta los divs pares
      } else {
        div.style.backgroundColor = "red"; // Resalta los divs impares
      }
    });
  }
  aplicarEstilos(); // Aplica estilos cuando se carga el contenido del DOM
});

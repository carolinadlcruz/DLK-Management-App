import React from "react";
import "../styles/PrioridadComponent.css";

export const PrioridadComponent = ({
  nivelPrioridad,
  cambioEstadoPrioridad,
  isUsed,
  onSeleccion,
}) => {
  const cambiarNivelPrioridad = () => {
    if (onSeleccion) {
      onSeleccion(nivelPrioridad); // actualiza el estado real
    }
    console.log(nivelPrioridad);

    // Muestra el modal manualmente (después de actualizar el estado)
    setTimeout(() => {
      const modal = new bootstrap.Modal(
        document.getElementById("modalPrioridadesConfirmacion")
      );
      modal.show();
    }, 0);
  };

  const renderPriorityCard = () => {
    const label =
      nivelPrioridad === 0 ? "Quitar prioridad" : `Prioridad ${nivelPrioridad}`;

    return (
      <div
        className="priorityCard p-2 d-flex justify-content-center align-items-center flex-column col-md-3 m-1"
        onClick={cambiarNivelPrioridad}
      >
        <p className="m-2 text-center fw-bold">{label}</p>
      </div>
    );
  };

  const renderNotAvailableCard = () => (
    <div className="notAvailableCard p-2 d-flex justify-content-center align-items-center flex-column col-md-3 m-1 disabled">
      <p className="m-2">
        <span className="fw-bold">Nivel de prioridad</span> {nivelPrioridad}
      </p>
    </div>
  );

  return renderPriorityCard();
};

import React from "react";
import { ServicioComponent } from "./ServicioComponent";
export const ServiciosContainer = ({
  servicios = [],
  servicioSeleccionado,
}) => {
  const obtenerServicioSeleccionado = (servicio) => {
    servicioSeleccionado(servicio);
  };
  return (
    <div style={{ maxHeight: "500px" }}>
      {servicios.map((servicio) => (
        <ServicioComponent
          key={servicio.idService}
          service={servicio}
          servicioSeleccionado={obtenerServicioSeleccionado}
        />
      ))}
    </div>
  );
};

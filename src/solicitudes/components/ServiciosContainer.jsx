import React from "react";
import { ServicioARealizar } from "./ServicioARealizar";
import "../styles/ServiciosContainer.css";
export const ServiciosContainer = ({ servicios = [] }) => {
  return (
    <div className="row d-flex justify-content-around align-items-center">
      {servicios.map((servicio, index) => (
        <ServicioARealizar
          servicio={servicio}
          num={index + 1}
          modalId={`modal-${index}`}
          key={index}
        />
      ))}
    </div>
  );
};

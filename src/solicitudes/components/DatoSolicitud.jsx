import React from "react";
//importamos estilos
import '../styles/DatoSolicitud.css'
export const DatoSolicitud = ({ title, valor }) => {
  return (
    <div className="mx-1">
      <div className="titleContainer d-flex">
        <p className="mx-1 title"> {title}</p>
        <p className="mx-1" valor> {valor}</p>
      </div>
    </div>
  );
};


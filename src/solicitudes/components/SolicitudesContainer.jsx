import React from "react";
import { SolicitudComponent } from "./SolicitudComponent";
import "../styles/SolicitudesContainer.css";
import notFoundImage from "../../assets/clouds.png";

export const SolicitudesContainer = ({ solicitudes = [], onIniciarCorte }) => {
  return (
    <div className="solicitudesContainer">
      {solicitudes.length > 0 ? (
        solicitudes.map((solicitud, index) => (
          <SolicitudComponent
            key={solicitud.id || index}
            solicitud={solicitud}
            onIniciarCorte={onIniciarCorte}
          />
        ))
      ) : (
        <div className="d-flex justify-content-center align-items-center flex-column">
          <br />
          <img src={notFoundImage} alt="" className="w-25 h-25" />
          <br />
          <h3 className="d-flex justify-content-center align-items-center text-secondary">
            No hay solicitudes para mostrar
          </h3>
        </div>
      )}
    </div>
  );
};

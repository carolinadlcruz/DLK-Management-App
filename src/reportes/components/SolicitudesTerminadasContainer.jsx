import React from "react";
import { SolicitudTerminadaComponent } from "./SolicitudTerminadaComponent";

export const SolicitudesTerminadasContainer = ({
  solicitudes,
  currentPage,
}) => {
  return (
    <div className="solicitudesTerminadasContainer">
      {solicitudes.length > 0 ? (
        solicitudes.map((solicitud) => (
          <SolicitudTerminadaComponent
            key={`${solicitud.requestId}-page-${currentPage}`}
            solicitud={solicitud}
            currentPage={currentPage}
          />
        ))
      ) : (
        <div className="no-solicitudes text-center py-4">
          <p>No hay solicitudes para mostrar.</p>
        </div>
      )}
    </div>
  );
};

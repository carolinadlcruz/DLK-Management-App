import React from "react";
import { ParteComponent } from "./ParteComponent";
export const PartesContainer = ({ partes = [], parteSeleccionada }) => {
  const obtenerParteSeleccionada = (parte) => {
    parteSeleccionada(parte);
  };

  return (
    <div>
      {partes.map((parte) => (
        <ParteComponent
          key={parte.idPartNumber}
          parte={parte}
          parteSeleccionada={obtenerParteSeleccionada}
        />
      ))}
    </div>
  );
};

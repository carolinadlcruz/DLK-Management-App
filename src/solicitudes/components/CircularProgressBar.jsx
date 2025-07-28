import React, { useEffect } from "react";
import { updateChart } from "../logica/logicaGraficas";
export const CircularProgressBar = ({ requestId, porcentaje }) => {
  //Hooks

  useEffect(() => {
    //Cargamos la funcion , dependiendo de la request y el porcentaje
    //Verificamos si es un numero valido
    if (isNaN(porcentaje)) {
      //Si no es un numero, regresamos 0
      porcentaje = 0;
    }
    updateChart(porcentaje, requestId);
  }, []);
  useEffect(() => {
    //Cargamos la funcion , dependiendo de la request y el porcentaje
    if (isNaN(porcentaje)) {
      //Si no es un número, regresamos 0
      porcentaje = 0;
    }
    updateChart(porcentaje, requestId);
  }, [porcentaje]);
  return (
    <div className="progress-container">
      <svg className={` ${"progress-ring"} mt-2`} width="120" height="120">
        <circle
          className={`progress-ring-circle-` + requestId}
          stroke="#5CB85C"
          fill="transparent"
          r="25"
          cx="60"
          cy="60"
        />
      </svg>
      <div
        className={` ${"percentage"} d-flex justify-content-center align-items-center`}
        id={`percentage-` + requestId}
      >
        0%
      </div>
    </div>
  );
};

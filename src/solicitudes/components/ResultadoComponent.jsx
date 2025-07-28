import React, { useEffect } from "react";
import "../styles/ResultadoComponent.css";
import { CiCircleCheck } from "react-icons/ci";
import { LuBadgeX } from "react-icons/lu";

export const ResultadoComponent = ({
  alert,
  valor,
  cambioBackgroundColor,
  id,
}) => {
  useEffect(() => {
    // Limpiar el localStorage cuando se desmonta el componente
    return () => {
      localStorage.removeItem("selected");
    };
  }, []);

  // Selección con click, mandar al localStorage
  const onResultSelect = () => {
    //Guardar en el localstorage
    localStorage.setItem("resultado", "conforme");
    const opcion = document.getElementById(id);
    const previousSelectedId = localStorage.getItem("selected");

    if (previousSelectedId) {
      const previousElement = document.getElementById(previousSelectedId);
      if (previousElement) {
        previousElement.style.background = ""; // Quitamos el color del seleccionado anterior
      }
    }

    if (previousSelectedId === id) {
      // Si se hace clic en el mismo elemento, deseleccionarlo
      localStorage.removeItem("selected");
    } else {
      // Seleccionamos el nuevo elemento
      localStorage.setItem("selected", id);
      if (id === 1) {
        opcion.style.background = "#4AB563"; // Color verde para id 1
        localStorage.setItem("resultado", "Conforme");
      } else if (id === 2) {
        opcion.style.background = "#BB2D3B"; // Color rojo para id 2
        localStorage.setItem("resultado", "No Conforme");
      }
    }
  };

  return (
    <div
      id={id}
      style={{
        borderRadius: 5,
      }}
      className={
        "col-md-3 resultadoDiv alert " + alert + " " + cambioBackgroundColor
      }
      onClick={onResultSelect}
    >
      <p>{valor}</p>

      {cambioBackgroundColor === "conforme" ? (
        <CiCircleCheck fontSize={"25px"} fontWeight={"bold"} />
      ) : (
        <LuBadgeX fontSize={"25px"} />
      )}
    </div>
  );
};

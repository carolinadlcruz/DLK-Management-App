import React, { useState, useEffect } from "react";
import { FaGears } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import "../styles/ParteComponent.css";
import { NavLink } from "react-router-dom";
import { ComboboxLines } from "./ComboboxLines";
export const ParteComponent = ({ parte, parteSeleccionada }) => {
  //Hooks

  //Metodos
  const guardarParteSeleccionada = () => {
    parteSeleccionada(parte);
  };
  //New
  const hola = 2;
  //Método para básicamente eliminar un número de parte
  const eliminarPartNumber = async () => {
    try {
      // Datos del servicio a eliminar
      const servicioAEliminar = {
        idService: servicioSeleccionado.idService, // Reemplaza con el valor real
      };

      // Realizar la petición DELETE para eliminar el servicio
      const response = await fetch(
        "http://10.239.10.175:3000/deleteService/" + service.idService,
        {
          method: "DELETE", // Cambiar el método a DELETE
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Verificar si la petición fue exitosa (código de estado 200)
      if (response.ok) {
        // Mostrar mensaje de éxito
        console.log("Servicio eliminado exitosamente");
      } else {
        // En caso de un código de estado no exitoso, manejar el error
        throw new Error(
          `Error al eliminar el servicio: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error al eliminar el servicio:", error.message);
      // Mostrar mensaje de error
      console.error("Error al eliminar el servicio:", error.message);
      const mensajeError = document.querySelector(".mensajeError");
      mensajeError.textContent =
        "Error al eliminar el servicio: " + error.message;
    }
  };
  //Useeffect

  return (
    <>
      <div className="containerServicio row d-flex justify-content-around">
        <div className="containerItem col-3 d-flex justify-content-center align-items-center">
          <h6>{parte.partNumber}</h6>
        </div>
        <div className="containerItem col-3 d-flex justify-content-center align-items-center">
          <h6>{parte.line}</h6>
        </div>

        <div className="containerDelete col-3 d-flex justify-content-center align-items-center">
          <button
            className="btnEditar ml-auto"
            data-bs-toggle="modal"
            data-bs-target="#exampleModalEdit"
            onClick={guardarParteSeleccionada}
          >
            <FaEdit />
          </button>
        </div>
        <div className="containerDelete col-3 d-flex justify-content-center align-items-center">
          <button
            className="btnEliminar ml-auto"
            data-bs-toggle="modal"
            data-bs-target="#exampleModalEliminar"
            onClick={guardarParteSeleccionada}
          >
            <RiDeleteBin5Fill />
          </button>
        </div>
      </div>
    </>
  );
};

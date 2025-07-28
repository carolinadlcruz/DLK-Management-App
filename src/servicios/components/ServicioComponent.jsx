import React, { useState, useEffect } from "react";
import { FaGears } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import "../styles/ServicioComponent.css";
import { FaEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

import { RiDeleteBin5Fill } from "react-icons/ri";

export const ServicioComponent = ({ service, servicioSeleccionado }) => {
  //Hook

  //Methods
  const guardarServicioSeleccionado = () => {
    servicioSeleccionado(service);
  };
  //TODO: Metodo imporatnte para eliminar servicio seleccionado
  const eliminarServicio = async () => {
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
        //Mostramos mensaje de confirmación
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
  //Handlers
  //UseEffect
  return (
    <>
      {/*XD */}
      {/*--------------------------INICIO MODAL EXITO */}
      <div
        className="modal fade"
        id="modalEliminacionExito"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                Éxito
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-between align-items-center flex-column">
              <FaCheckCircle className="w-25 h-25" color="green" />
              <br />
              <p className="text-dark text-center messageExitoModal">
                Servicio eliminado con éxito!
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-success"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
                data-bs-dismiss="modal"
                //Volvemos a cargar los servicios
                //Agregamos función para
                //Poder actualizar  nuevos. //Volver a hacer la petición
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*------------------FIN MODAL EXITO */}
      <div className="containerServicio row d-flex justify-content-around">
        <div className="containerItem col-8 d-flex justify-content-start align-items-start ">
          <h6 className="text-start">{service.name}</h6>
        </div>
        <div className="containerDelete col-1 d-flex justify-content-center align-items-center">
          <button
            className="btnEditar ml-auto"
            data-bs-toggle="modal"
            data-bs-target="#exampleModalEdit"
            onClick={guardarServicioSeleccionado}
          >
            <FaEdit />
          </button>
        </div>
        <div className="containerDelete col-1 d-flex justify-content-center align-items-center">
          <button
            className="btnEliminar ml-auto"
            data-bs-toggle="modal"
            data-bs-target={"#modalEliminacion"}
            onClick={() => {
              //Mandamos la localstorage
              localStorage.setItem("idServicioAEliminar", service.idService);
            }}
          >
            {/*Boto para eliinar el servicio, se llama al metodo de eliminar servicio. */}
            <RiDeleteBin5Fill />
          </button>
        </div>
      </div>
    </>
  );
};

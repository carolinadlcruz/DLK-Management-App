import React, { useEffect, useState, Suspense, lazy } from "react";
import { AiTwotoneAppstore } from "react-icons/ai";
import { Header } from "../../globalComponents/Header";
import { AddButton } from "../components/AddButton";
import { ServiciosContainer } from "../components/ServiciosContainer";
import { Loading } from "../../globalComponents/Loading";
import "../styles/ServiciosPage.css";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";

const Combobox = lazy(() =>
  import("../../globalComponents/Combobox").then((module) => ({
    default: module.Combobox,
  }))
);
export const ServiciosPage = () => {
  const [loading, setLoading] = useState(true);
  const [servicios, setServicios] = useState();
  const [laboratorioSeleccionado, setLaboratorioSeleccionado] = useState(1);
  const [laboratorioSeleccionadoAgregar, setLaboratorioSeleccionadoAgregar] =
    useState(1);
  const [nombreCaracteristica, setNombreCaracteristica] = useState("");
  const [contadorServicios, setContadorServicios] = useState(0);
  const [busqueda, setBusqueda] = useState();
  const [datosBusqueda, setDatosBusqueda] = useState();
  const [servicioSeleccionado, setSeleccionado] = useState({});
  const [nuevoNombreServicio, setNuevoNombreServicio] = useState();
  const [servicioAEliminar, setServicioAEliminar] = useState(0);
  //Paginacion
  // En ServiciosPage.js
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleLaboratoryChange = (selectedLab) => {
    setLaboratorioSeleccionado(selectedLab);
    consultarServiciosPorLaboratorio(selectedLab);
  };

  const handleLaboratoryAgregarChange = (selectedLab) => {
    setLaboratorioSeleccionadoAgregar(selectedLab);
    consultarServiciosPorLaboratorio(laboratorioSeleccionado);
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = datosBusqueda.filter((elemento) => {
      if (
        elemento.name
          .toString()
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setServicios(resultadosBusqueda);
  };

  const obtenerServicioSeleccionado = (service) => {
    setSeleccionado(service);
    console.log("SE SELECCIONO : " + service);
  };

  const modificarNombreServicio = async () => {
    const cajaTexto = document.getElementById("inputEditarServicio");
    //Hacemos la petición
    try {
      // Datos del nuevo servicio
      const nuevoServicio = {
        idService: servicioSeleccionado.idService, // Reemplaza con el valor real
        newName: nuevoNombreServicio, // Reemplaza con el valor real
      };
      if (cajaTexto.value != "") {
        // Realizar la petición POST para agregar el nuevo servicio
        const response = await fetch("http://10.239.10.175:3000/editService", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoServicio),
        });
        // Verificar si la petición fue exitosa (código de estado 200 o 201)
        if (response.ok) {
          mostrarMensajeModal("Servicio actualizado con éxito ", true);
        } else {
          // En caso de un código de estado no exitoso, manejar el error
          mostrarMensajeModal(
            "Error interno del servidor, intenta de nuevo",
            false
          );
        }
      } else {
        mostrarMensajeModal(
          "No se aceptan campos vacios, intenta de nuevo",
          false
        );
      }
    } catch (error) {
      mostrarMensajeModal(
        "Error intento de servidor, intenta de nuevo ",
        false
      );
    }
    //Limpiamos la caja
    cajaTexto.value = "";
    setNuevoNombreServicio();
  };
  const consultarServiciosPorLaboratorio = async (
    idLab,
    page = 2,
    pageSize = 5
  ) => {
    try {
      const response = await fetch(
        `http://10.239.10.175:3000/getServicesByLab/${idLab}`
      );
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }
      const servicios = await response.json();
      setServicios(servicios);
      setDatosBusqueda(servicios);
      setContadorServicios(servicios.length);
      console.log("Service structure:", servicios[0]); // Check the structure
    } catch (error) {
      console.error("Error al consultar servicios:", error);
    }
  };

  //Controlador de paginas
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    consultarServiciosPorLaboratorio(
      laboratorioSeleccionado,
      newPage,
      pageSize
    );
  };
  const onHandleNuevoNombreServicio = (e) => {
    setNuevoNombreServicio(e.target.value);
  };
  //Agregar nuevo servicio
  const agregarNuevoServicio = async () => {
    const cajaTexto = document.getElementById("inputNuevoServicio");
    console.log(cajaTexto.value);
    try {
      // Datos del nuevo servicio
      const nuevoServicio = {
        idLaboratorio: laboratorioSeleccionadoAgregar, // Reemplaza con el valor real
        nombreServicio: nombreCaracteristica, // Reemplaza con el valor real
      };
      //Validamos que no este vacio el campo
      if (cajaTexto.value != "") {
        // Realizar la petición POST para agregar el nuevo servicio
        const response = await fetch(
          "http://10.239.10.175:3000/addServiceByLab",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoServicio),
          }
        );
        // Verificar si la petición fue exitosa (código de estado 200 o 201)
        if (response.ok) {
          //Mostramos mensaje de exito
          mostrarMensajeModal("¡ Servicio agregado con éxito !", true);
        } else {
          // En caso de un código de estado no exitoso, manejar el error
          mostrarMensajeModal(
            "Error al agregar servicio, intenta de nuevo",
            false
          );
          throw new Error(
            `Error al agregar el servicio: ${response.statusText}`
          );
        }
      } else {
        //Mensaje de no dejar campos vacios
        mostrarMensajeModal(
          "No se aceptan campos vacios, intenta de nuevo",
          false
        );
      }
    } catch (error) {
      console.error("Error al agregar el servicio:", error.message);
      mostrarMensajeModal(
        "Error interno del servidor, intenta de nuevo",
        false
      );
      // Mostrar mensaje de error en el modal
    }
    //Independientemente de lo que pase, limpiamos las cajas
    cajaTexto.value = "";
    setNombreCaracteristica("");
  };

  const mostrarMensajeModal = (mensaje, wasSuccessed) => {
    // Obtener el elemento del mensaje en el modal
    const mensajeModal = document.getElementById("modalRecogidoMessage");
    mensajeModal.innerText = "";
    mensajeModal.style.color = "black";
    if (wasSuccessed) {
      //Mostramos el icono de exito
      const exitoIcon = document.getElementById(
        "successfulDivIconRecogerPieza"
      );
      const errorIcon = document.getElementById("errorfulDivIconRecogerPieza");
      //Eliminamos el icono de error
      errorIcon.style.display = "none";
      exitoIcon.style.display = "block";
      //Agregamos el icono
    } else {
      //Mostramos el icono de exito
      const exitoIcon = document.getElementById(
        "successfulDivIconRecogerPieza"
      );
      const errorIcon = document.getElementById("errorfulDivIconRecogerPieza");
      //Eliminamos el icono de error
      exitoIcon.style.display = "none";
      errorIcon.style.display = "block";
      //Agregamos el icono
    }
    // Modificar el contenido y la clase del mensaje
    mensajeModal.innerText = mensaje;
    // Cerrar el modal después de 5 segundos y restaurar el contenido original
  };

  //Handlers
  const onHandleBusqueda = (e) => {
    setBusqueda(e.target.value);
    filtrar(e.target.value);
  };
  const onHandleNombreCaracteristica = (e) => {
    setNombreCaracteristica(e.target.value);
  };

  const eliminarServicio = async (idService) => {
    try {
      console.log(idService);
      // Hacemos la petición DELETE para eliminar el número de parte
      const response = await fetch(
        `http://10.239.10.175:3000/deleteService/${idService}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        //Mandamos  a llamar el error de fallo
        mostrarMensajeModal(
          " Error al eliminar servicio, intenta de nuevo",
          false
        );
        throw new Error(
          `Error al eliminar el servicio: ${response.statusText}`
        );
      }
      //Si todo va bien , llamamos al modal de exito al crear
      mostrarMensajeModal("¡ Servicio eliminado con éxito !", true);
    } catch (error) {
      mostrarMensajeModal(
        "¡ Error interno del servidor al eliminar el servicio, vuelve a intentarlo !",
        false
      );

      console.error("Error al eliminar el servicio:", error);
    }
  };

  useEffect(() => {
    // Al cargar, primero conseguimos el laboratorio seleccionado
    const laboratorioPorDefecto = 1;
    // Actualizamos el estado y consultamos los servicios
    consultarServiciosPorLaboratorio(laboratorioPorDefecto);
    //Quitamos el icono de cargando
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    // Al cargar, primero conseguimos el laboratorio seleccionado
    const laboratorioPorDefecto = 1;
    // Actualizamos el estado y consultamos los servicios
    setLaboratorioSeleccionado(laboratorioSeleccionado);
    //consultarServiciosPorLaboratorio(laboratorioSeleccionado);
    //Quitamos el icono de cargando
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [servicios]);

  return loading ? (
    <>
      <Loading />
    </>
  ) : (
    <>
      {/*Modal de eliminar */}
      {/*-----------------------------------------------INICIO MODAL */}
      <div
        className="modal fade"
        id={"modalEliminacion"}
        tabIndex="-1"
        aria-labelledby="XD"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-dark">Eliminación de servicio</h5>
              <button
                type="button"
                className="btn-close "
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="text-dark">
                ¿Estás seguro que quieres eliminar el servicio <b> </b>
              </p>
              <p className="text-dark">
                Toma en cuenta que se eliminará de todos los laboratorios en los
                que es dado
              </p>
              <p className="text-dark">
                Además, todas las solicitudes creadas o activas que tengan
                asociado este servicio serán eliminadas.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => eliminarServicio(servicioSeleccionado.idService)}
                data-bs-toggle="modal"
                data-bs-target="#modalExitoSalidaPieza"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*------------------------------------------------FIN MODAL */}
      {/* 
      <div
        className="modal fade  p-4 "
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered p-4 ">
          <div className="modal-content modalServicio">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Agregar nuevo servicio.
              </h5>
              <button
                type="button"
                className="btn-close  btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-center align-items-start flex-column">
              <div id="mensajeModal" className="mx-2"></div>

              <label className="mx-2">Laboratorio: </label>
              <Combobox
                title={"Laboratorios"}
                onLaboratoryChange={handleLaboratoryAgregarChange}
              />
              <label className="mx-2 mt-4">
                Nombre de la característica :{" "}
              </label>
              <input
                id="inputNuevoServicio"
                type="text"
                className="form-control mx-2 inputModal"
                placeholder="Escribe el nombre del servicio"
                onChange={(e) => onHandleNombreCaracteristica(e)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-light"
                onClick={agregarNuevoServicio}
                //--Agregamos la direccion al modal de mensaje de exito
                data-bs-toggle="modal"
                data-bs-target="#modalExitoSalidaPieza"
                //--------------------------------------------------
              >
                Crear nuevo
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/*-----------------------------INICIO MODAL EDITAR*/}

      <div
        className="modal fade  p-4"
        id="exampleModalEdit"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered p-4 ">
          <div className="modal-content ">
            <div className="modal-header">
              <h5 className="modal-title text-dark" id="exampleModalLabel">
                Modificación de servicio
              </h5>
              <button
                type="button"
                className="btn-close  btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-center align-items-start flex-column">
              <div id="mensajeModal" className="mx-2"></div>

              <label className="mx-2 mt-4 text-dark">
                Nombre actual del servicio :{" "}
              </label>
              <input
                type="text"
                className="form-control mx-2  "
                disabled
                value={servicioSeleccionado.name}
              />

              <label className="mx-2 mt-4 text-dark">
                Nuevo nombre del servicio :{" "}
              </label>
              <input
                id="inputEditarServicio"
                type="text"
                className="form-control mx-2 "
                placeholder="Escribe el nuevo nombre"
                onChange={(e) => onHandleNuevoNombreServicio(e)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success btnModificarServicio"
                onClick={modificarNombreServicio}
                data-bs-toggle="modal"
                data-bs-target="#modalExitoSalidaPieza"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*----------------------------FIN MODAL EDITAR*/}

      {/*------------------------------------------INICIO MODAL AGREGAR */}
      <div
        className="modal fade  p-4"
        id="modalAgregar"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered p-4 ">
          <div className="modal-content modalServicio">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Agregar nuevo servicio.
              </h5>
              <button
                type="button"
                className="btn-close  btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-center align-items-start flex-column">
              <div id="mensajeModal" className="mx-2"></div>
              <label className="mx-2">Laboratorio : </label>
              <Combobox
                title={"Laboratorios"}
                onLaboratoryChange={handleLaboratoryAgregarChange}
              />
              <label className="mx-2 mt-4">Nombre del servicio : </label>
              <input
                id="inputNuevoServicio"
                type="text"
                className="form-control mx-2 inputModal"
                placeholder="Escribe el servicio"
                onChange={(e) => onHandleNombreCaracteristica(e)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={agregarNuevoServicio}
                //--Agregamos la direccion al modal de mensaje de exito
                data-bs-toggle="modal"
                data-bs-target="#modalExitoSalidaPieza"
                //--------------------------------------------------
              >
                Crear nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*-----------------------------------FIN MODAL */}

      {/*--------------------------INICIO MODAL EXITO */}
      <div
        className="modal fade"
        id="modalExitoSalidaPieza"
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
            <div
              className="modal-body d-flex justify-content-between align-items-center flex-column"
              id="modalBodySalidaPiezas"
            >
              {/* <FaCheckCircle className="w-25 h-25" color="green" /> */}
              <br />
              <div
                id="successfulDivIconRecogerPieza"
                style={{ display: "none" }}
                className="w-100 h-100 text-center"
              >
                <FaCheckCircle color="green" className="w-25 h-25" />
              </div>
              <div
                id="errorfulDivIconRecogerPieza"
                style={{ display: "none" }}
                className="w-100 h-100 text-center"
              >
                <MdOutlineError color="red" className="w-25 h-25" />
              </div>
              <br />
              <br />
              <p
                className="text-dark text-center"
                id="modalRecogidoMessage"
              ></p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
                //Actualizamos la lista
                onClick={() => handleLaboratoryChange(laboratorioSeleccionado)}
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*------------------FIN MODAL EXITO */}

      <div className="animate__animated  animate__fadeInRight">
        <div className=""></div>
        <div className="mx-4 p-5 h-100 divContainerServicios">
          <div className="header d-flex align-items-center">
            <AiTwotoneAppstore className="mt-2 iconHeader" />
            <Header title="Servicios" />
          </div>
          <hr className="border border-primary" />

          {/* Busqueda y escaneo */}
          <div className="searchBar ">
            <input
              placeholder="Buscar servicio"
              className="form__field2 mt-4"
              onChange={(e) => onHandleBusqueda(e)}
            />
            <i className="search-icon fa-solid fa-magnifying-glass"></i>
          </div>
          <br />

          {/* Contenedor para los combobox */}
          <div className="comboboxContainer row">
            <Suspense fallback={<h1>Cargando</h1>}>
              <Combobox
                title={"Laboratorios"}
                onLaboratoryChange={handleLaboratoryChange}
              />
            </Suspense>
          </div>

          {/* Espacio para el total de servicios y el add button */}
          <div className="addContainer row mt-3">
            <div className="totalServiciosContainer col-md-9 ">
              <p className="serviciosTotales">
                Servicios totales :{" "}
                <span className="text-light">{contadorServicios}</span>{" "}
              </p>
            </div>
            <div className="btnAddContainer col-md-3">
              <AddButton />
            </div>
          </div>

          {/* Espacio para la tabla de servicios */}
          <div
            className="tableContainer mt-5"
            style={{
              maxHeight: "800px",
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "thin",
              scrollbarColor:
                "rgba(155, 155, 155, 0.5) rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Agrega aquí el componente que mostrará los servicios */}
            <ServiciosContainer
              servicios={servicios}
              servicioSeleccionado={obtenerServicioSeleccionado}
            />
          </div>
        </div>
      </div>
    </>
  );
};

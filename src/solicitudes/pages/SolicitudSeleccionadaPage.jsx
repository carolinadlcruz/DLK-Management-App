import React, { useEffect, useState } from "react";
import { Header } from "../../globalComponents/Header";
import { LiaNewspaper } from "react-icons/lia";
import "../styles/SolicitudSeleccionadaPage.css";
import { DatoSolicitud } from "../components/DatoSolicitud";
import { ServicioARealizar } from "../components/ServicioARealizar";
import { Sidebar } from "../../globalComponents/Sidebar";
import { ServiciosContainer } from "../components/ServiciosContainer";
import { RegistrarSalidaButton } from "../components/RegistrarSalidaButton";
import { CiViewList } from "react-icons/ci";
import { MdFactory } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { GrStatusCriticalSmall } from "react-icons/gr";
import { ImLab } from "react-icons/im";
import { GrUserWorker } from "react-icons/gr";
import { AiOutlineNumber } from "react-icons/ai";
import { FaCalendarAlt } from "react-icons/fa";
import { FaBarcode } from "react-icons/fa6";
import { IoIosWarning } from "react-icons/io";
import { BiSolidComponent } from "react-icons/bi";
import { TiSortNumericallyOutline } from "react-icons/ti";
import { FaCheckCircle } from "react-icons/fa";
import { RxLapTimer } from "react-icons/rx";
import { MdOutlineError } from "react-icons/md";
import planReaccion from "../../assets/planReaccion.png";
import { ResultadoComponent } from "../components/ResultadoComponent";
import { json } from "react-router-dom";
export const SolicitudSeleccionadaPage = () => {
  //Obtenemos la solicitud
  let info = JSON.parse(localStorage.getItem("solicitudSeleccionada"));
  const idSolicitud = info.requestId;
  const [solicitud, setSolicitud] = useState([]);

  //Hooks
  const [servicios, setServicios] = useState([]);
  const [estadoResultado, setEstadoResultado] = useState("No conforme");
  const [
    estanTodosLosServiciosFinalizados,
    setEstanTodosLosServiciosFinalizados,
  ] = useState(false);
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const hour = date.getUTCHours(); // Usamos UTC para mantener la hora original
    let displayHour = hour;
    const ampm = hour >= 12 ? "PM" : "AM";

    // Convertir a formato 12 horas
    if (hour > 12) {
      displayHour = hour - 12;
    } else if (hour === 0) {
      displayHour = 12;
    }

    // Formatear los componentes usando UTC
    const formattedDate = `${date.getUTCFullYear()}-${String(
      date.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")} ${String(
      displayHour
    ).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(
      2,
      "0"
    )} ${ampm}`;

    return formattedDate;
  };
  //Metodos
  const terminarTiempoServicio = async () => {
    try {
      const idUnionValue = localStorage.getItem("servicioFin");
      console.log("idUnion:", idUnionValue);
      const idUnion = {
        idUnion: idUnionValue,
      };
      const response = await fetch(
        "http://10.239.10.175:3000/endRequestServiceTime",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(idUnion),
        }
      );
      if (response.ok) {
        mostrarMensajeModal("Servicio finalizado con éxito", true);
      } else {
        const errorText = await response.text();
        console.error("Error al finalizar el servicio:", errorText);
        mostrarMensajeModal(
          "Error al finalizar el servicio, intenta de nuevo",
          false
        );
      }
    } catch (error) {
      console.error("Error al finalizar el servicio:", error);
      mostrarMensajeModal(
        "Error al finalizar el servicio, intenta de nuevo",
        false
      );
    }
    window.location.reload();
  };

  //Mandar la hora en que se envio el servicio
  const iniciarTiempoDeServicio = async () => {
    try {
      const idUnion = {
        idUnion: parseInt(localStorage.getItem("servicioInicio")),
      };
      console.log("id union: " + idUnion);
      const response = await fetch(
        "http://10.239.10.175:3000/changeRequestServiceTime",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(idUnion),
        }
      );
      if (response.ok) {
        mostrarMensajeModal("Servicio iniciado con éxito", true);
      } else {
        mostrarMensajeModal(
          "Error al inicar el servicio, intenta de nuevo",
          false
        );
      }
    } catch (error) {
      mostrarMensajeModal(
        "Error al iniciar el  servicio, intenta de nuevo",
        false
      );
    }
    window.location.reload();
  };

  const obtenerServiciosDeSolicitud = async (idRequest) => {
    //Vamos a obtener todos los servicios de la solicitud par despues mandarlos al componente
    try {
      //Hacemos la peticion de las solicitdes
      const response = await fetch(
        `http://10.239.10.175:3000/requestsServices/${idRequest}`
      );

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }

      const servicios = await response.json();
      setServicios(servicios);
      console.log(servicios);
      console.log(servicios);

      //Cargamos la cantidad de solicitudes al hook
      //setContadorSolicitudes(servicios.length);
    } catch (error) {
      console.error("Error al consultar servicios:", error);
    }
  };

  const obtenerinfoDeSolicitud = async (idRequest) => {
    //Vamos a obtener todos los servicios de la solicitud par despues mandarlos al componente
    try {
      //Hacemos la peticion de las solicitdes
      const response = await fetch(
        `http://10.239.10.175:3000/getRequestbyID/${idRequest}`
      );

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }

      const solicitud = await response.json();
      setSolicitud(solicitud);
      console.log(solicitud);
      console.log(solicitud);
      if (
        (solicitud.status === "Nuevo" || solicitud.status === "Corte") &&
        solicitud.idStatus !== "En progreso"
      ) {
        onSolicitudChangeStatus();
        onSolicitudChangeStartDate();
      }

      //Cargamos la cantidad de solicitudes al hook
      //setContadorSolicitudes(servicios.length);
    } catch (error) {
      console.error("Error al consultar solicitud:", error);
    }
  };
  //Cambiar estado de la solicitud
  const onSolicitudChangeStatus = async () => {
    //TODO: Hacemos la petición a la API
    //Hacemos la petición
    try {
      // Datos del nuevo servicio
      const cambioDeEstado = {
        requestId: info.requestId, // Reemplaza con el valor real
        //Estatus 5 : En proceso
        idStatus: 5, // Reemplaza con el valor real
      };

      // Realizar la petición POST para agregar el nuevo servicio
      const response = await fetch(
        "http://10.239.10.175:3000/updateRequestStatus",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cambioDeEstado),
        }
      );

      // Verificar si la petición fue exitosa (código de estado 200 o 201)
      if (response.ok) {
        console.log("See cambio a status en proceso");
        //Aqui mostramos el mensaje de modal de exito
      } else {
        //Aqui va el mensaje de modal de error
        throw new Error(`Error al agregar el servicio: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al agregar el servicio:", error.message);
    }
    //
  };

  const onSolicitudChangeStatusPorRecoger = async () => {
    //TODO: Hacemos la petición a la API
    //Hacemos la petición
    try {
      // Datos del nuevo servicio
      const cambioDeEstado = {
        requestId: info.requestId, // Reemplaza con el valor real
        //Estatus 5 : En proceso
        idStatus: 6, // Reemplaza con el valor real
      };

      // Realizar la petición POST para agregar el nuevo servicio
      const response = await fetch(
        "http://10.239.10.175:3000/updateRequestStatus",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cambioDeEstado),
        }
      );

      // Verificar si la petición fue exitosa (código de estado 200 o 201)
      if (response.ok) {
        //Aqui mostramos el mensaje de modal de exito
      } else {
        //Aqui va el mensaje de modal de error
        throw new Error(`Error al agregar el servicio: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al agregar el servicio:", error.message);
    }
    //
  };

  const onSolicitudChangeStartDate = async () => {
    //TODO: Hacemos la petición a la API
    //Hacemos la petición
    try {
      // Datos del nuevo servicio
      const cambioDeEstado = {
        requestId: info.requestId, // Reemplaza con el valor real
      };

      // Realizar la petición POST para agregar el nuevo servicio
      const response = await fetch(
        "http://10.239.10.175:3000/changeStartDate",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cambioDeEstado),
        }
      );

      // Verificar si la petición fue exitosa (código de estado 200 o 201)
      if (response.ok) {
        console.log("See cambio la hora de empezar los servicios");
      } else {
        //Aqui va el mensaje de modal de error
        throw new Error(`Error al agregar el servicio: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al agregar el servicio:", error.message);
    }
    //
  };

  //Handlers
  //Dependiendo la respuesta, editamos el mensaje
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

  //Metodo para registrar el resultado de una solicitud (Ok o not ok)
  const registrarResultado = async () => {
    const idRequest = JSON.parse(
      localStorage.getItem("solicitudSeleccionada")
    ).requestId;
    const resultado = localStorage.getItem("resultado");
    const idUser = JSON.parse(localStorage.getItem("user")).idUser;

    const nuevoResultado = {
      requestId: idRequest,
      resultado: resultado,
      idUser: idUser,
    };

    try {
      const response = await fetch(
        "http://10.239.10.175:3000/registrarResultadoSolicitudOkOrNotOk",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoResultado),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        mostrarMensajeModal(
          "Error al registrar el resultado, por favor intenta de nuevo",
          false
        );
        throw new Error(
          `Error al actualizar el resultado de la solicitud, datos: ${errorText}`
        );
      } else {
        // Close current modal and show success modal
        onSolicitudChangeStatusPorRecoger();
        console.log("See cambio a status por recoger");
        const currentModal = bootstrap.Modal.getInstance(
          document.getElementById("modalIngresarResultado")
        );
        if (currentModal) {
          currentModal.hide();
        }
        mostrarMensajeModal("Resultado registrado con exito", true);

        // Optional: Reload the page or update the UI after successful registration
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error completo:", error);
    }
  };
  //UseEffect
  useEffect(() => {
    info = JSON.parse(localStorage.getItem("solicitudSeleccionada"));
    //Obtenemos los servicios de la solicitud
    obtenerServiciosDeSolicitud(info.requestId);
    obtenerinfoDeSolicitud(info.requestId);
    console.log("STATUS " + solicitud.status);
    //Comparamos si la solicitud tiene un estado de Nueva
  }, []);
  //Use effect de servicios
  useEffect(() => {
    //Recorremos todos los servicios
    let estanTerminadosLosServicios = false;
    servicios.forEach((servicio) => {
      //Por cada servicios verificamos si los tiempos estan completos o no
      if (servicio.startDate && servicio.endDate) {
        //Significa que ya estan terminados todos, habilitamos el boton
        setEstanTodosLosServiciosFinalizados(true);
      } else {
        //No estan terminados, ocultamos el boton

        setEstanTodosLosServiciosFinalizados(false);
      }
    });
  }, [servicios]);

  return (
    <>
      {/*--------------------------INICIO MODAL EXITO */}
      <div
        className="modal fade"
        id="modalExitoSalidaPieza5"
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
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*------------------FIN MODAL EXITO */}
      {/*-----------------------------------INICIO MODAL CONFIRMAR fin de tiempo de tiempo*/}
      <div
        className="modal fade"
        id={"modalConfirmarFinTiempo"}
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title text-dark"
                id="exampleModalToggleLabel2"
              >
                Confirmación
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
              id=""
            >
              <RxLapTimer className="w-25 h-25" color="red" />
              <br />
              <div
                id="body"
                className="w-100 h-100 text-center row d-flex justify-content-start align-items-start flex-columnb"
              >
                {/*Mensaje de confirmacion para las prioridades */}
                <h5 className="text-dark fw-bold text-left">
                  ¿ Estás seguro que quieres terminar el servicio ?
                </h5>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Cancelar
              </button>
              <button
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#modalExitoSalidaPieza5"
                onClick={terminarTiempoServicio}
              >
                Aceptar
              </button>

              {/*
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
              >
                ¡Entendido!
              </button>
                */}
            </div>
          </div>
        </div>
      </div>
      {/*----------------------------------- FIN MODAL CONFIRMAR fin de tiempo */}
      {/*-----------------------------------INICIO MODAL CONFIRMAR inicio de tiempo*/}
      <div
        className="modal fade"
        id={"modalConfirmarInicioTiempo"}
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title text-dark"
                id="exampleModalToggleLabel2"
              >
                Confirmación
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
              id=""
            >
              <RxLapTimer className="w-25 h-25" color="green" />
              <br />
              <div
                id="body"
                className="w-100 h-100 text-center row d-flex justify-content-start align-items-start flex-columnb"
              >
                {/*Mensaje de confirmacion para las prioridades */}
                <h5 className="text-dark fw-bold text-left">
                  ¿ Estás seguro que quieres empezar el servicio ?
                </h5>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Cancelar
              </button>
              <button
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#modalExitoSalidaPieza"
                onClick={iniciarTiempoDeServicio}
              >
                Aceptar
              </button>

              {/*
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
              >
                ¡Entendido!
              </button>
                */}
            </div>
          </div>
        </div>
      </div>
      {/*----------------------------------- FIN MODAL CONFIRMAR */}
      {/*Modal confirmacion */}
      <div
        className="modal fade  "
        id="modalIngresarResultado"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg ">
          <div className="modal-content ">
            <div className="modal-header">
              <h5 className="modal-title text-dark" id="exampleModalLabel">
                Confirmación de terminación
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-center align-items-center flex-column   ">
              <h6 className="text-dark text-center mt-4">
                Selecciona un resultado para la solicitud
              </h6>
              <br />
              <div className="">
                <img
                  src={planReaccion}
                  className="w-100 h-75 col-md-3 imgPlanAccion"
                />
                <div className="row d-flex justify-content-center align-items-center mt-4 mb-4 col-md-5 my-4 w-100">
                  <ResultadoComponent
                    valor={"Con Conformidad. "}
                    alert={"alert-success"}
                    cambioBackgroundColor={"conforme"}
                    id={1}
                  />
                  <div className="col-md-2"></div>
                  <ResultadoComponent
                    valor={"No Conforme."}
                    alert={"alert-danger"}
                    cambioBackgroundColor={"noConforme"}
                    id={2}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  registrarResultado();
                  // Use Bootstrap's Modal API to show the success modal
                  const successModal = new bootstrap.Modal(
                    document.getElementById("modalExitoSalidaPieza5")
                  );
                  successModal.show();
                }}
                data-bs-dismiss="modal"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*-------------FIN DEL MODAL DE REGISTRO DE RESULTADOS */}

      {/*Información de la solicitud */}
      <div className="row animate__animated  animate__fadeInRight ">
        {/*Espacio divisor entre el el sidebar */}
        <div className="col-1"> </div>
        {/*Este el contenedor principal del contenido de la pagina */}
        <div className="col-10 p-4 contendorSolicitudPagina  mx-4 ">
          <div className="headerSolicitudInfo p-3 row d-flex justify-content-center align-items-center">
            <h3 className=" blueTitle">Información de la solicitud</h3>

            <div className="col d-flex justify-content-center align-items-start flex-column">
              <br />
              <br />
              <p>
                {" "}
                Folio <CiViewList /> :{" "}
                <span className="text-secondary fw-bold">
                  <br />
                  {solicitud.requestId}
                </span>
              </p>
              <p className=" fw-bold">
                Línea <MdFactory /> :
                <span className="text-secondary fw-bold">
                  <br />
                  {solicitud.lineName}
                </span>{" "}
              </p>
              <p className=" fw-bold">
                Número de parte <FaGear /> :{" "}
                <span className="text-secondary fw-bold">
                  <br />
                  {solicitud.partNumber}
                </span>
              </p>
              <p className=" fw-bold">
                Estado <GrStatusCriticalSmall /> :{" "}
                <span className="text-secondary fw-bold">
                  <br />
                  {solicitud.status}
                </span>
              </p>

              <br />
            </div>
            <div className="col d-flex justify-content-center align-items-left flex-column ">
              <br />
              <p className=" fw-bold">
                Laboratorio <ImLab /> :{" "}
                <span className="text-secondary">
                  {" "}
                  <br />
                  {solicitud.laboratoryName}{" "}
                </span>
              </p>
              <p>
                Solicitante <GrUserWorker /> :{" "}
                <span className="text-secondary fw-bold">
                  <br />
                  {solicitud.requester
                    ? solicitud.requester
                    : "Sin nombre para mostrar"}
                </span>
              </p>
              <p className=" fw-bold">
                Fecha creación <FaCalendarAlt /> :{" "}
                <span className="text-secondary  fw-bold">
                  <br />
                  {formatDate(solicitud.date)}
                </span>
              </p>
              <p className=" fw-bold">
                Componente <BiSolidComponent /> :{" "}
                <span className="text-secondary  fw-bold">
                  <br />
                  {solicitud.component}
                </span>
              </p>
              <br />
            </div>
            <div className="col d-flex justify-content-center align-items-left flex-column">
              <br />
              <p>
                Cantidad de piezas <AiOutlineNumber /> :{" "}
                <span className="text-secondary  fw-bold">
                  <br />
                  {solicitud.numberPieces}
                </span>
              </p>
              <p>
                C <FaBarcode /> :{" "}
                <span className="text-secondary  fw-bold">
                  <br />
                  {solicitud.code}
                </span>
              </p>
              <p>
                Prioridad <IoIosWarning /> :{" "}
                <span
                  style={{
                    color: solicitud.priority != 0 ? "red" : "gray",
                    fontWeight: "bold",
                  }}
                >
                  <br />
                  {solicitud.priority != 0
                    ? "Prioridad " + solicitud.priority
                    : "Sin prioridad"}
                </span>
              </p>
              <p className="fw-bold">
                Lote <TiSortNumericallyOutline /> :{" "}
                <span className="text-secondary  fw-bold">
                  <br />
                  {solicitud.lot}
                </span>
              </p>
              <p>
                {solicitud.result ? (
                  <>
                    Resultado : <br />
                    <span
                      style={{
                        color:
                          solicitud.result === "Conforme" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {solicitud.result}
                    </span>
                  </>
                ) : null}
              </p>
              <br />
            </div>
          </div>
          <div className="p-3">
            <span className="fw-bold">Comentarios:</span>
            <p className="text-secondary">
              {solicitud.comments
                ? solicitud.comments
                : "No existe un comentario"}
            </p>
          </div>
          <h3 className="blueTitle">Tracking : </h3>
          <br />
          <br />
          <br />
          <div className="trackingContainer h-50  d-flex justify-content-center align-items-center">
            {/**
             *Tracking part
             */}
            <div className={`track  w-100`}>
              <div
                className={`completedLine ${
                  solicitud.status === "Por recoger" ? "threeLines" : "twoLines"
                }`}
              ></div>
              <div className="line"></div>
              <div className={"step recibido" + solicitud.requestId}>
                <span className="icon completed">
                  <i className="fa fa-check"></i>
                </span>
                <span className="text fw-bold text-light ">Recibido</span>
              </div>
              <div className={"step en-progreso" + solicitud.requestId}>
                <span className="icon working">
                  <i className="fa fa-list"></i>
                </span>
                <span className="text">Realizando servicios</span>
              </div>
              <div className={"step recoger" + solicitud.requestId}>
                <span
                  className={`icon ${
                    solicitud.status === "Por recoger" ? "completed" : ""
                  }`}
                >
                  <i className="fa fa-hand"></i>
                </span>
                <span className="text">Listo para recoger</span>
              </div>
              <div className={"step Terminado" + solicitud.requestId}>
                <span className="icon">
                  <i className="fa fa-box"></i>
                </span>
                <span className="text">Recogido</span>
              </div>
            </div>
            {/**End tracking part */}
          </div>
          <br />
          <br />
          <h5 className="titleServices mx-5">Servicios a realizar : </h5>
          <br />
          <br />
          {/*Parte de los servicios. */}
          {/*Header */}
          <div className="serviciosHeader  row d-flex flex-row justify-content-left align-items-center ">
            <div className="col-md-2">
              <p>Servicio</p>
            </div>
            <div className="col-md-2">
              <p>Inicio</p>
            </div>
            <div className="col-md-2">
              <p>Fin</p>
            </div>
            <div className="col-md-4 text-center">
              <p>Opciones</p>
            </div>
            <div className="col-md-1 text-center">
              <p>Resultado / Archivos </p>
            </div>
          </div>
          {/*Body */}
          <div className="contenidoDatosSolicitudContainer row ">
            {/*Seccion para los servicios (Esto es dinamico y viene desde la bdd, se carga el componente al cargar la pagina) */}
            <ServiciosContainer servicios={servicios} />
          </div>

          {/*Boton de registro (Unicamente metalurgia no entra en este caso, metalurgia tiene una matriz de resultados) */}
          <div className="contenedorBotonRegistroResultados d-flex row">
            <div className="col-md-9"></div>

            {solicitud.laboratoryName != "Nada" ? (
              <button
                className={`btn ${
                  estanTodosLosServiciosFinalizados && !solicitud.result
                    ? "btn-success"
                    : "disabled"
                } col-md-2 mx-4`}
                //Abre el modal
                data-bs-toggle="modal"
                data-bs-target={"#modalIngresarResultado"}
              >
                {solicitud.result
                  ? "Se registró : " + solicitud.result
                  : estanTodosLosServiciosFinalizados
                  ? "¡Registrar resultado!"
                  : "Aún quedan servicios pendientes"}
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div></div>
      </div>
    </>
  );
};

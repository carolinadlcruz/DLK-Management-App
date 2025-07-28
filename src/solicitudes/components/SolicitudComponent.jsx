import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "../styles/SolicitudComponent.css";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { RegistrarSalidaButton } from "./RegistrarSalidaButton";
import iconoSalida from "../../assets/exit.gif";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineError, MdPriorityHigh } from "react-icons/md";
import { ServiceTime } from "./ServiceTime";
import { MdTimer } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { IoAppsSharp } from "react-icons/io5";
import { FcTodoList } from "react-icons/fc";
import { FaCheck } from "react-icons/fa";
import { MdOutlinePending } from "react-icons/md";
import { FaTools } from "react-icons/fa";
import { FaHammer } from "react-icons/fa6";
//Llamamos a la funcion del porcentaje
import { updateChart } from "../logica/logicaGraficas";
import { CircularProgressBar } from "./CircularProgressBar";
import { FcHighPriority } from "react-icons/fc";
import { MdNotificationImportant } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";
import { RiContactsBookLine } from "react-icons/ri";
import { MdDesignServices } from "react-icons/md";

export const SolicitudComponent = ({ solicitud, onIniciarCorte }) => {
  // Hooks
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [servicios, setServicios] = useState([]);
  const [estadoServicio, setEstadoServicio] = useState("Pendiente");
  const [porcentaje, setPorcentaje] = useState(0);
  const [cantidadServicios, setCantidadServicios] = useState(0);
  const [serviciosTerminados, setServiciosTerminados] = useState(0);
  const [cantidadPrioridades, setCantidadPrioridades] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleViewClick = (e) => {
    if (solicitud.status === "Nuevo") {
      e.preventDefault(); // don't navigate yet
      setShowConfirm(true);
    } else {
      proceedToView();
    }
  };

  const proceedToView = () => {
    localStorage.setItem("solicitudSeleccionada", JSON.stringify(solicitud));
    navigate("/solicitudes/solicitudSeleccionada");
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    const icon = document.querySelector(".dropIcon" + solicitud.requestId);
    icon.classList.toggle("rotate180");
    const miDiv = document.querySelector(".mainDiv-" + solicitud.requestId);
    miDiv.classList.toggle("seleccionada");
  };
  //Funcion para convertir los tiempos
  function formatElapsedTime(startDateStr, endDateStr) {
    // Convert dateTime strings to Date objects
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    // Check if start or end date is invalid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return "Error: Invalid start or end date";
    }
    // Calculate time difference in milliseconds
    const timeDiff = endDate.getTime() - startDate.getTime();
    // Convert milliseconds to human-readable time format
    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    // Format the time string
    let formattedTime = "";
    if (days > 0) {
      formattedTime += `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      formattedTime += `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      formattedTime += `${minutes}m ${seconds}s`;
    } else {
      formattedTime += `${seconds}s`;
    }
    return formattedTime;
  }
  // Función para calcular los minutos transcurridos
  // Función para calcular el tiempo transcurrido
  const calcularTiempoTranscurrido = (horaInicial) => {
    const inicio = new Date(horaInicial);
    const ahora = new Date();
    const diferencia = ahora - inicio;
    const segundos = Math.floor((diferencia / 1000) % 60);
    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const tiempoFormateado = `${horas < 10 ? "0" + horas : horas}:${
      minutos < 10 ? "0" + minutos : minutos
    }:${segundos < 10 ? "0" + segundos : segundos}`;
    return tiempoFormateado;
  };
  //Guardar en el localstorage
  const guardarSolicitudEnLocalStorage = () => {
    const objetoSolicitud = JSON.stringify(solicitud);
    localStorage.setItem("request", objetoSolicitud);
  };
  //Consultar los servicios de cada solicitud
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
      //Cargamos la cantidad de solicitudes al hook
    } catch (error) {
      console.error("Error al consultar servicios:", error);
    }
  };
  const registrarSalidaPieza = async () => {
    //Hacemos la petición
    try {
      // Datos del nuevo servicio
      const cambioDeEstado = {
        requestId: solicitud.requestId, // Reemplaza con el valor real
      };
      // Realizar la petición POST para agregar el nuevo servicio
      const response = await fetch(
        "http://10.239.10.175:3000/registrarSalidaPieza",
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
        //Mostramos el modal de exito
        mostrarMensajeModal(
          "Se registró la salida de la pieza con éxito ",
          true
        );
      } else {
        //Mostramos el modal de error
        mostrarMensajeModal(
          "Error al realizar la operación, intenta de nuevo",
          false
        );
      }
    } catch (error) {
      mostrarMensajeModal(
        "Error interno del servidor, comprueba la conexión.",
        false
      );
    }
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
  // Al cargar el componente, le asignamos el tiempo transcurrido
  useEffect(() => {
    if (solicitud.date) {
      const horaInicial = new Date(solicitud.startHour); // Convertir la cadena de texto en un objeto Date
      const tiempo = calcularTiempoTranscurrido(horaInicial);
      setTiempoTranscurrido(tiempo);
    }
  }, [solicitud]); // Dependencia añadida
  // Actualizar el tiempo cada segundo
  useEffect(() => {
    /*
    const interval = setInterval(() => {
      if (solicitud.date && solicitud.status === "En progreso") {
        const horaInicial = new Date(solicitud.startHour); // Convertir la cadena de texto en un objeto Date
        const tiempo = calcularTiempoTranscurrido(horaInicial);
        setTiempoTranscurrido(tiempo);
      }
    }, 1000); // 1000 milisegundos = 1 segundo
    return () => clearInterval(interval);
    */
    obtenerServiciosDeSolicitud(solicitud.requestId);
  }, [solicitud.requestId]);

  useEffect(() => {
    setCantidadServicios(servicios.length);
    let contadorServiciosTerminados = 0;
    let contadorPrioridades = 0;
    servicios.forEach((servicio) => {
      //Si no es diferente a nulo , entonces ya se completo
      if (servicio.endDate != null && servicio.startDate != null) {
        //En caso de que se completo agregamos al contador
        contadorServiciosTerminados++;
      }
      if (servicio.priority > 5) {
        contadorPrioridades++;
      }
    });
    setServiciosTerminados(contadorServiciosTerminados);
    setCantidadPrioridades(contadorPrioridades);
  }, [servicios]);

  useEffect(() => {
    // Calcular el porcentaje aquí
    const porcentajeCompletado =
      (serviciosTerminados / cantidadServicios) * 100;
    setPorcentaje(porcentajeCompletado);
  }, [serviciosTerminados]);
  return (
    <>
      <div className="containerSolicitud  ">
        <div className="row   ">
          <div className={`col  ${"mainDiv-" + solicitud.requestId}`}>
            <div className="filaTable row d-flex flex-wrap align-items-center justify-content-center contenedorSolicitudes py-2 rounded">
              <div className="nivelPrioridad">
                {solicitud.priority != 1 ? (
                  <div className="d-flex  justify-content-end  align-items-center divPrioridad">
                    {" "}
                    {
                      //Esto es el simbolo de warning que sale arriba del ojito en las solicitudes
                      /*<div className="btn btn-danger btnPrioridad d-flex justify-content-around align-items-center">
                        {" "}
                        {solicitud.priority} <IoIosWarning color="white" />{" "}
                      </div>{" "}*/
                    }
                  </div>
                ) : (
                  <></>
                )}
              </div>

              {/* Contenido principal */}
              <div className="itemTabla col-md d-flex align-items-center justify-content-center">
                <button
                  className="btn text-light btnDropDown"
                  onClick={toggleDetails}
                >
                  <FaChevronDown
                    className={"dropIcon dropIcon" + solicitud.requestId}
                  />
                </button>
              </div>

              <div className="itemTabla col-md d-flex align-items-center justify-content-center mt-3">
                <p>{solicitud.code}</p>
              </div>

              <div className="itemTabla col-md d-flex align-items-center justify-content-center text-center">
                <div className="position-relative mt-3">
                  <p className="mb-0 pe-3">{solicitud.requestId}</p>

                  {solicitud.priority !== 0 && (
                    <span className="priority-badge" title="Prioridad alta">
                      {solicitud.priority}
                    </span>
                  )}
                </div>
              </div>

              <div className="itemTabla col-md d-flex align-items-center justify-content-center mt-3">
                <p className="d-flex align-items-center justify-content-center">
                  {solicitud.partNumber}
                </p>
              </div>

              <div className="itemTabla col-md d-flex align-items-center justify-content-center mt-3">
                <p>{solicitud.numberPieces}</p>
              </div>

              <div className="itemTabla col-md d-flex align-items-center justify-content-center mt-3">
                <p>{solicitud.line}</p>
              </div>

              <div className="itemTabla col-md d-flex align-items-center justify-content-center mt-3">
                <p>{solicitud.date.split("T")[0]}</p>
              </div>

              <div className="itemTabla col-md d-flex align-items-center justify-content-center mt-3">
                <p>{solicitud.date.split("T")[1].substring(0, 5)}</p>
              </div>

              {solicitud.status != "Terminado" ? (
                <div
                  className={`itemTabla col-md d-flex flex-row align-items-center justify-content-center progressDiv text-center ${
                    solicitud.status === "Nuevo"
                      ? "nuevo"
                      : solicitud.status === "En progreso"
                      ? "inProgress"
                      : solicitud.status === "Por recoger"
                      ? "porRecoger"
                      : solicitud.status === "Terminado"
                      ? "text-success"
                      : solicitud.status === "Corte"
                      ? "corte"
                      : ""
                  }`}
                >
                  {solicitud.status}
                </div>
              ) : (
                <> </>
              )}

              {solicitud.status === "Por recoger" ? (
                <div
                  className="col-md"
                  data-bs-toggle="modal"
                  data-bs-target={`#modalConfirmacionSalidaDePieza`}
                  onClick={() => {
                    //Guardamos el id en el local storage
                    localStorage.setItem(
                      "solicitudSalidaPieza",
                      solicitud.requestId
                    );
                  }}
                >
                  <RegistrarSalidaButton />
                </div>
              ) : (
                <></>
              )}
              {/* 
              
               {parseInt(porcentaje) != 0 || isNaN(porcentaje) ? (
                <CircularProgressBar
                  porcentaje={parseInt(porcentaje)}
                  requestId={solicitud.requestId}
                />
              ) : (
                <></>
              )}
              */}

              {/* Botón para desplegar detalles */}
              <div className="itemTabla col-md d-flex align-items-center justify-content-center position-relative">
                <button
                  className="btnView btnIniciarAnalisis d-flex align-items-center gap-2 small"
                  onClick={handleViewClick}
                >
                  {solicitud.status === "Nuevo" || solicitud.status === "Corte"
                    ? "Iniciar Análisis"
                    : "Análisis"}

                  <FaSearch />
                </button>

                {showConfirm && (
                  <div
                    className="position-absolute bg-white border rounded shadow p-2 z-3"
                    style={{
                      top: "-90%",
                      transform: "translateX(-50%)",
                      minWidth: "220px",
                    }}
                  >
                    <p className="small m-0 mb-2 warning-text">
                      Esta solicitud aún no ha pasado por el proceso de corte.
                      ¿Deseas continuar?
                    </p>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setShowConfirm(false)}
                      >
                        Cancelar
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={proceedToView}
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Detalles desplegables, osea donde vienen el boton de prioridad */}
            {showDetails && (
              <div
                className={`desplegable row d-flex align-items-center justify-content-center   w-100 ${
                  "divDropDown" + solicitud.requestId
                } ${showDetails ? "active" : ""}`}
              >
                <div className="prioridadesContainer m-2 d-flex justify-content-end align-items-center">
                  {/* Botón de Iniciar Corte */}
                  {solicitud.status === "Nuevo" && (
                    <button
                      className="btn btn-outline-primary btnIniciarCorte"
                      data-bs-toggle="modal"
                      data-bs-target="#modalCorteConfirmacion"
                      onClick={() => {
                        localStorage.setItem(
                          "idRequestCorte",
                          solicitud.requestId
                        );
                        if (onIniciarCorte) {
                          onIniciarCorte(solicitud.requestId);
                        }
                        console.log("Iniciar corte para", solicitud.requestId);
                      }}
                    >
                      <FaTools className="me-2" />
                      Iniciar Corte
                    </button>
                  )}

                  {/*Icono de prioridades, tambien sirve como botón */}
                  <button
                    className="btn btn-outline-danger btnAsignarPrioridad"
                    data-bs-toggle="modal"
                    data-bs-target="#modalPrioridades"
                    onClick={() => {
                      // Guardamos el id de la solicitud en el localstorage
                      localStorage.setItem(
                        "idRequestPriority",
                        solicitud.requestId
                      );
                      console.log("Hola");
                      // Ya lo podemos leer desde el modal
                    }}
                  >
                    <MdNotificationImportant color="red" className="me-2" />
                    Prioridad
                  </button>
                </div>

                <div className="itemTabla  col w-100 p-4">
                  {/* Aquí va el contenido adicional, es decir se muestran los servicios, el timepo transcurrido y el estado*/}
                  <br />
                  <div className="adicionalHeader  w-100 d-flex justify-content-between align-items-center ">
                    <h6 className="">
                      Servicios <FcTodoList />
                    </h6>
                    <h6 className="">
                      Transcurrido <MdTimer />
                    </h6>
                    <h6 className="">
                      Estado <GrStatusGood />{" "}
                    </h6>
                  </div>
                  <hr />

                  <div className="row adicionalBody w-100 cuerpoServicio">
                    <div className="col d-flex justify-content-around align-items-start flex-column ">
                      {servicios.map((servicio, i) => (
                        <div key={servicio.name}>
                          <p>{servicio.name}</p>
                        </div>
                      ))}
                    </div>

                    <div className="col d-flex justify-content-around align-items-center  flex-column ">
                      {servicios.map((servicio, i) => (
                        <ServiceTime key={i} servicio={servicio} />
                      ))}
                    </div>

                    <div className="col d-flex justify-content-center align-items-end flex-column my-3">
                      {servicios.map((servicio) => (
                        <div key={servicio.name}>
                          <p
                            className={`${
                              //Hacemos las comparaciones
                              servicio.startDate === null
                                ? // Si startDate es null
                                  "servicioNoEmpezado"
                                : // Si startDate no es null
                                servicio.endDate === null
                                ? // Si endDate es null
                                  "servicioEnproceso"
                                : // Si endDate no es null
                                  "servicioFinalizado"
                            }
                          }`}
                          >
                            {servicio.startDate === null ? (
                              // Si startDate es null
                              <>
                                Pendiente <MdOutlinePending />
                              </>
                            ) : // Si startDate no es null
                            servicio.endDate === null ? (
                              // Si endDate es null
                              <>
                                Realizando <FaHammer />
                              </>
                            ) : (
                              // Si endDate no es null
                              <>
                                Finalizado <FaCheck />
                              </>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                    <hr />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};

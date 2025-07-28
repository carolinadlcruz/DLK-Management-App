import React, { useContext, useState, useEffect, useCallback } from "react";
import { Combobox } from "../../globalComponents/Combobox";
import { Header } from "../../globalComponents/Header";
import { Searchbox } from "../../globalComponents/Searchbox";
import { ButtonFilter } from "../../globalComponents/ButtonFilter";
import { Pagination } from "../../globalComponents/Pagination";
import { LiaNewspaper } from "react-icons/lia";
import { Sidebar } from "../../globalComponents/Sidebar";
import { AuthContext } from "../../auth/context/AuthContext";
import { SolicitudesContainer } from "../components/SolicitudesContainer";
import { TabsGroup } from "../components/TabsGroup";
import { TableSolicitudes } from "../../globalComponents/TableSolicitudes";
import { Loading } from "../../globalComponents/Loading";
import io from "socket.io-client";
import "../styles/SolicitudesPage.scss";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";
import { MdNotificationImportant } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import iconoSalida from "../../assets/exit.gif";

import { PrioridadComponent } from "../components/PrioridadComponent";
//Comunicarnos con el backend
const socket = io("http://10.239.10.175:3001", {
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server!");
});

export const SolicitudesPage = () => {
  //Context
  const { user } = useContext(AuthContext);
  //Hooks
  const [loading, setLoading] = useState(true);
  const [laboratoriosDisponibles, setLaboratoriosDisponibles] = useState();
  const [solicitudes, setSolicitudes] = useState([]);
  //Este hook sirve para las solicitudes mo
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState([]);

  const [contadorSolicitudes, setContadorSolicitudes] = useState(0);
  const [laboratorioSeleccionado, setLaboratorioSeleccionado] = useState(1);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(0);
  //Busqueda y filtrado
  const [busqueda, setBusqueda] = useState();
  const [datosBusqueda, setDatosBusqueda] = useState();
  const [messages, setMessages] = useState([]);
  //Inicialmente la prioridad seleccionada es 1
  const [prioridadSeleccionada, setPrioridadSeleccionada] = useState(null);
  const [idRequestSeleccionada, setIdRequestSeleccionada] = useState(null);
  const [idRequestCorte, setIdRequestCorte] = useState(null);

  //Lista de prioridades utilizadas
  const [prioritiesUsed, setPrioritiesUsed] = useState([]);
  const [prioridades, setPrioridades] = useState([0, 1, 2, 3, 4, 5]);

  //Metodos
  const cargarSolicitudesSegunLaboratorio = useCallback(
    async (idLab, idStatus) => {
      try {
        let response;
        console.log(idLab);
        console.log("IDSTATUS" + idStatus);
        if (idStatus === 0) {
          response = await fetch(
            `http://10.239.10.175:3000/requestsByLab/${idLab}`
          );
        } else if (idStatus === 8) {
          response = await fetch(
            `http://10.239.10.175:3000/getRequestByLabAndPriority/${idLab}`
          );
        } else if (idStatus === 7) {
          response = await fetch(
            `http://10.239.10.175:3000/getRequestsByLabTerminadas/${idLab}`
          );
        } else {
          console.log("IDSTATUS" + idStatus);
          response = await fetch(
            `http://10.239.10.175:3000/requestByStatusAndLab/${idLab}/${idStatus}`
          );
        }
        if (!response.ok) {
          throw new Error(`Error al obtener datos: ${response.statusText}`);
        }
        const solicitudes = await response.json();
        setSolicitudes(solicitudes);
        setDatosBusqueda(solicitudes);
        setContadorSolicitudes(solicitudes.length);
        console.log(solicitudes);
        console.log("Contador:", solicitudes.length);
      } catch (error) {
        console.error("Error al consultar servicios:", error);
      }
    },
    []
  );
  //Cambio de la lista de solicitudes
  const onChangeListaSolicitudes = () => {
    //Este metodo va a ser llamado cada que se haga un cambio de solicitudes o se actualizen.
    //Actualizamos las solicitudes
  };
  //-------------METODO PARA CAMBIAR LA PRIORIDAD D ELA SOILICTUID
  //Terminar el tiempo de los servicios
  const cambiarPrioridadDeSolicitud = async () => {
    //Hacemos la petición
    try {
      console.log(
        "Actualizando " +
          idRequestSeleccionada +
          " con prioridad " +
          prioridadSeleccionada
      );
      // Datos del nuevo servicio
      const idUnion = {
        requestId: localStorage.getItem("idRequestPriority"), //Obtenemos el valor del localStorage
        priority: prioridadSeleccionada, //Obtenemos el valor de la prioridad para el cambio
      };
      // Realizar la petición POST para agregar el nuevo servicio
      const response = await fetch(
        "http://10.239.10.175:3000/changeRequestsPriority",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(idUnion),
        }
      );

      // Verificar si la petición fue exitosa (código de estado 200 o 201)
      if (response.ok) {
        //Mostramos el modal de exito
        mostrarMensajeModal("Prioridad cambiada con éxito", true);
      } else {
        //Mostramos el modal de error
        mostrarMensajeModal(
          "Error al cambiar la prioridad, intenta de nuevo",
          false
        );
      }
    } catch (error) {}
  };

  const cambiarStatusDeSolicitudCorte = async () => {
    //Hacemos la petición
    try {
      console.log(
        "Actualizando " +
          localStorage.getItem("idRequestCorte") +
          " con status corte"
      );
      // Datos del nuevo servicio
      const idUnion = {
        requestId: localStorage.getItem("idRequestCorte"), //Obtenemos el valor del localStorage
        idStatus: 8, //Estatus corte
      };
      const response = await fetch(
        "http://10.239.10.175:3000/updateRequestStatus",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(idUnion),
        }
      );

      // Verificar si la petición fue exitosa (código de estado 200 o 201)
      if (response.ok) {
        //Mostramos el modal de exito
        mostrarMensajeModal("Estatus iniciado con éxito", true);
      } else {
        //Mostramos el modal de error
        mostrarMensajeModal(
          "Error al cambiar el estado de la solicitud, intenta de nuevo",
          false
        );
      }
    } catch (error) {}

    try {
      // Datos del nuevo servicio
      const idUnion = {
        requestId: localStorage.getItem("idRequestCorte"), //Obtenemos el valor del localStorage
        idStatus: 8, //Estatus corte
      };
      const response = await fetch(
        "http://10.239.10.175:3000/changeStartCutDate",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(idUnion),
        }
      );

      // Verificar si la petición fue exitosa (código de estado 200 o 201)
      if (response.ok) {
        //Mostramos el modal de exito
        mostrarMensajeModal("Tiempo de corte iniciado con éxito", true);
      } else {
        //Mostramos el modal de error
        mostrarMensajeModal(
          "Error al cambiar el tiempo de la solicitud, intenta de nuevo",
          false
        );
      }
    } catch (error) {}
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = datosBusqueda.filter((elemento) => {
      if (
        elemento.requestId
          .toString()
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setSolicitudes(resultadosBusqueda);
  };

  //Handlers
  //Cada que se cambie de laboratorio o estado, se mandan a llamar los siguientes eventos
  const handleLaboratoryChange = async (selectedLab) => {
    setLaboratorioSeleccionado(parseInt(selectedLab));
    await cargarSolicitudesSegunLaboratorio(selectedLab, estadoSeleccionado);
  };

  const handleStatusChange = async (selectedStatus) => {
    setEstadoSeleccionado(selectedStatus);
    await cargarSolicitudesSegunLaboratorio(
      laboratorioSeleccionado,
      selectedStatus
    );
  };
  const onHandleBusqueda = (e) => {
    setBusqueda(e.target.value);
    filtrar(e.target.value);
    socket.emit("message", busqueda);
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

  //UseEffect
  useEffect(() => {
    const interval = setInterval(() => {
      cargarSolicitudesSegunLaboratorio(
        laboratorioSeleccionado,
        estadoSeleccionado
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [laboratorioSeleccionado, estadoSeleccionado]);

  useEffect(() => {
    // Al cargar la página, hacemos la petición para traer las solicitudes
    const laboratorioPorDefecto = 1;
    const statusPorDefecto = 0; // STATUS 4: Nuevo
    // Asegúrate de que estadoSeleccionado sea un número válido

    const initialLaboratorioSeleccionado = laboratorioPorDefecto;
    const initialEstadoSeleccionado = statusPorDefecto;

    cargarSolicitudesSegunLaboratorio(
      initialLaboratorioSeleccionado,
      initialEstadoSeleccionado
    );
    // Pantalla de carga.
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    // Extraer todas las prioridades de las solicitudes
    const newPriorities = solicitudes.flatMap(
      (solicitud) => solicitud.priority
    );
    // Actualizar el estado con las prioridades extraídas
    setPrioritiesUsed(newPriorities);
    //Cada que haya un cambio en las solicitudes, vamos a hacer algo.
    //En este caso lo que vamos a hacer es acutalizar el estado de TabsGroup (Con nuevas solicitudes de prioridad)
  }, [solicitudes]);

  //Useeffect para cuando cambien las solicitudes filtrHADAS (Nueva, en progreso, por recoger)
  useEffect(() => {
    //Cada que cambie, vamos a
  }, [solicitudesFiltradas]);

  return loading ? (
    <>
      <Loading />
    </>
  ) : (
    <>
      {/* --------------------------------------------------------------------Este modal nos sirve para registrar la salida de las piezas*/}
      <div
        className="modal fade"
        id={"modalConfirmacionSalidaDePieza"}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered p-4 ">
          <div className="modal-content ">
            <div className="modal-header d-flex justify-content-center align-items-center">
              <h5 className="  text-dark " id="exampleModalLabel">
                Registro de salida de pieza
              </h5>
              <button
                type="button"
                className="btn-close  btn-close-danger"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div
              id="mensajeModal"
              className="mx-2 d-flex justify-content-center align-items-center flex-column"
            >
              <h6 className="text-dark">
                ¿Estás seguro que quieres registrar la salida de esta solicitud?
              </h6>
              <br />
              <div className="d-flex justify-content-center align-items-center flex-column w-75 row">
                <img src={iconoSalida} alt="" className="w-50 h-50" />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#modalExitoSalidaPieza"
                onClick={async () => {
                  //Obtenemos el id del localstorage
                  const idSolicitud = localStorage.getItem(
                    "solicitudSalidaPieza"
                  );
                  //Lo mandamos en la peticion
                  //Hacemos la petición
                  try {
                    // Datos del nuevo servicio
                    const cambioDeEstado = {
                      requestId: idSolicitud, // Reemplaza con el valor real
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
                  //
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*--------------------------------------------------------------FIN MODAL */}

      {/*-----------------------------------INICIO MODAL PRIORIDADES  */}
      <div
        className="modal fade "
        id="modalPrioridades"
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
                Por favor, Selecciona una prioridad
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
                id="modalBodySeleccionPrioridad"
                className="w-100 h-100 text-center row d-flex justify-content-center align-items-center flex-columnb"
              >
                {prioridades.map((prioridad) => (
                  // Por cada prioridad, vamos a pintar un elemento, pintamos todas las prioridades.

                  <PrioridadComponent
                    key={prioridad}
                    nivelPrioridad={prioridad}
                    onSeleccion={(nivel) => {
                      setPrioridadSeleccionada(nivel);
                      setIdRequestSeleccionada(
                        localStorage.getItem("idRequestPriority")
                      );
                    }}
                    isUsed={prioritiesUsed.includes(prioridad)}
                  />
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
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
      {/*----------------------------------- FIN MODAL PRIORIDADES */}
      {/*-----------------------------------INICIO MODAL ACEPTAR PRIORIDADES */}
      <div
        className="modal fade"
        id="modalPrioridadesConfirmacion"
        aria-hidden="true"
        aria-labelledby="labelConfirmacionPrioridad"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title text-dark"
                id="labelConfirmacionPrioridad"
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
              id="modalBodySalidaPiezas"
            >
              <br />
              <div className="w-100 h-100 text-center row d-flex justify-content-start align-items-start flex-column">
                {/* Mensaje dinámico */}
                <h5 className="text-dark fw-bold text-left">
                  {prioridadSeleccionada === 0 ? (
                    <>
                      ¿Estás seguro que quieres{" "}
                      <span className="text-danger">quitar la prioridad</span>{" "}
                      de la solicitud <br />#{idRequestSeleccionada}?
                    </>
                  ) : (
                    <>
                      ¿Estás seguro que quieres asignar la prioridad de{" "}
                      <span className="text-danger">
                        {prioridadSeleccionada}
                      </span>{" "}
                      a la solicitud <br />#{idRequestSeleccionada}?
                    </>
                  )}
                </h5>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#modalExitoSalidaPieza"
                onClick={cambiarPrioridadDeSolicitud}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*----------------------------------- FIN MODAL ACEPTAR PRIORIDADES */}
      {/*-----------------------------------INICIO MODAL ACEPTAR corte */}
      <div
        className="modal fade"
        id="modalCorteConfirmacion"
        aria-hidden="true"
        aria-labelledby="labelConfirmacionPrioridad"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title text-dark"
                id="labelConfirmacionPrioridad"
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
              id="modalBodySalidaPiezas"
            >
              <br />
              <div className="w-100 h-100 text-center row d-flex justify-content-start align-items-start flex-column">
                {/* Mensaje dinámico */}
                <h5 className="text-dark fw-bold text-left">
                  ¿Estás seguro que quieres iniciar el corte de la solicitud{" "}
                  <br />#{idRequestCorte}?
                </h5>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#modalExitoSalidaPieza"
                onClick={cambiarStatusDeSolicitudCorte}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*----------------------------------- FIN MODAL ACEPTAR PRIORIDADES */}

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
                data-bs-toggle="modal"
                data-bs-dismiss="modal"
                //Actualizamos la lista
                onClick={() =>
                  cargarSolicitudesSegunLaboratorio(
                    laboratorioSeleccionado,
                    estadoSeleccionado
                  )
                }
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*------------------FIN MODAL EXITO */}
      <div className="animate__animated  animate__fadeInRight">
        {/* Espacio divisor entre el sidebar */}
        <div className=""></div>
        {/* Este es el contenedor principal del contenido de la pagina */}
        <div className="p-5 divMainSolicitudes h-100">
          <div className="header d-flex align-items-center">
            <LiaNewspaper className=" iconHeader" />
            <Header title="Solicitudes" />
          </div>
          <hr className="border border-primary" />
          {/* Busqueda y escaneo */}
          <div className="searchBar d-flex ">
            <input
              type=""
              className="form__field2 mt-4"
              placeholder="Introduce un folio"
              name="busqueda"
              id="busqueda"
              required
              onChange={(e) => onHandleBusqueda(e)}
            />
            <i className="search-icon fa-solid fa-magnifying-glass"></i>
          </div>
          <br />
          {/* Contenedor para los combobox */}
          <div className="comboboxContainer row">
            <Combobox
              className=""
              title={"Laboratorios"}
              onLaboratoryChange={handleLaboratoryChange}
            />
          </div>

          <div className="d-flex justify-content-start align-items-center mt-2 mb-3">
            <span className="ps-2 fs-6">
              Mostrando {contadorSolicitudes} solicitud
              {contadorSolicitudes === 1 ? "" : "es"}
            </span>
          </div>
          <br />
          {/*
          <div className="row w-100 d-flex justify-content-center align-items-center h-25">
            <div className="col-3 bg-danger d-flex justify-content-center align-items-center row h-50 divGraficas">
              <div className="col-3  d-flex justify-content-center align-items-center">
              <LiaNewspaper style={{ width: '100%', height: '100%' }} />
              </div>
              <div className="col-8">
                <h3 className="headerCard">12</h3>
                <h6 className="text-secondary">Solitcitudes totales</h6>
              </div>
            </div>
            <div className="col-1"></div>
            <div className="col-3 bg-danger d-flex justify-content-center align-items-center h-50 divGraficas">2</div>
            <div className="col-1"></div>
            <div className="col-3 bg-danger d-flex justify-content-center align-items-center h-50 divGraficas">3</div>
          </div>
          */}

          {/* Contenedor para los tabs */}
          <div className="tabsContainer">
            <TabsGroup
              onStatusChange={handleStatusChange}
              listaSolicitudes={solicitudes}
              onListaSolicitudesChange={cargarSolicitudesSegunLaboratorio}
            />
          </div>
          {/* Espacio para la tabla de solicitudes */}
          <div
            className="tableContainer mt-5"
            style={{
              maxHeight: "525px",
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "thin",
              scrollbarColor:
                "rgba(155, 155, 155, 0.5) rgba(255, 255, 255, 0.1)",
            }}
          >
            <TableSolicitudes />
            <SolicitudesContainer
              solicitudes={solicitudes}
              onIniciarCorte={setIdRequestCorte}
            />
          </div>
          {/* Espacio para la paginacion */}
        </div>
      </div>
    </>
  );
};

export default SolicitudesPage;

import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { NavLink, isRouteErrorResponse } from "react-router-dom";
import "../styles/ServicioARealizar.css";
import "../styles/ModalRegistrarResultado.css";
import { leerArchivo2 } from "../logica/procesarArchivos";
import { RiTimer2Fill } from "react-icons/ri";
import "../styles/TablaArchivoStyles.css";
import metalurgiaCard from "../../assets/metalurgiaCard.jpg";
import { MdOutlineStart } from "react-icons/md";
import whiteIcon from "../../assets/zfwhiteicon.png";
import { FaListUl } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { DateTime } from "luxon";

export const ServicioARealizar = ({
  servicio,
  num,
  registrarResultado,
  modalId,
  cambiarEstado,
}) => {
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

  // Test
  const testDate = "2025-01-13T13:08:40.553Z";
  console.log(formatDate(testDate));
  // Output: "01/13/2025, 1:08:40 PM"

  const [showModal, setShowModal] = useState(false);
  const [resultado, setResultado] = useState();
  const [comentarios, setComentarios] = useState("");
  const [solicitud, setSolicitud] = useState({});
  const [resultadoBDD, setResultadoBDD] = useState([]);
  const [horaInicio, setHoraInicio] = useState(
    formatDate(servicio.startDate) || ""
  );
  const [horaFinal, setHoraFinal] = useState(
    formatDate(servicio.endDate) || ""
  );
  const [iniciarDisabled, setIniciarDisabled] = useState(!!servicio.startDate);
  const [terminarDisabled, setTerminarDisabled] = useState(!!servicio.endDate);

  const manejarEstado = () => {
    cambiarEstado;
  };
  const iniciarTiempoDeServicio = async () => {
    try {
      const idUnion = {
        idUnion: servicio.idUnion,
      };
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
        const ahora = new Date();
        const formattedDate = formatDate(ahora);
        setHoraInicio(formattedDate);
        setIniciarDisabled(true);
      } else {
        throw new Error("Error al iniciar el tiempo del servicio.");
      }
    } catch (error) {
      console.error("Error al iniciar el tiempo del servicio:", error.message);
    }
  };

  const terminarTiempoServicio = async () => {
    try {
      const idUnion = {
        idUnion: servicio.idUnion,
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
        const ahora = new Date();
        const formattedDate = formatDate(ahora);
        setHoraFinal(formattedDate);
        setTerminarDisabled(true);
      } else {
        throw new Error("Error al terminar el tiempo del servicio.");
      }
    } catch (error) {
      console.error("Error al terminar el tiempo del servicio:", error.message);
    }
  };

  const handlePdfClick = async () => {
    try {
      const response = await fetch(
        `http://10.239.10.175:3000/obtenerArchivoPDF/${servicio.idUnion}`
      );

      if (!response.ok) {
        throw new Error("No se pudo descargar el archivo");
      }

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);

      // Abrir en una nueva pestaña
      window.open(fileUrl, "_blank");

      // Liberar memoria después de un tiempo
      setTimeout(() => URL.revokeObjectURL(fileUrl), 10000);
    } catch (error) {
      console.error("Error al abrir el PDF:", error.message);
    }
  };

  const onHandleResultado = (e) => {
    setResultado(e.target.value);
  };

  const onHandleComentarios = (e) => {
    setComentarios(e.target.value);
  };

  useEffect(() => {
    const solicitud = JSON.parse(localStorage.getItem("request"));
    setSolicitud(solicitud);
  }, []);

  useEffect(() => {
    console.log("Servicio : ", servicio);
    setHoraInicio(formatDate(servicio.startDate));
    localStorage.setItem("servicioInicioHora", horaInicio);
    localStorage.setItem("servicioFinHora", horaFinal);
    setHoraFinal(formatDate(servicio.endDate));
    if (servicio.startDate) {
      setIniciarDisabled(true);
    }
    if (servicio.endDate) {
      setTerminarDisabled(true);
    }
  }, [servicio]);
  const LocalTime = new Date(Date.now());
  const AmericanTime = LocalTime.toLocaleString("en-US", {
    timeZone: "America/New_York",
  });

  useEffect(() => {
    console.log("AMERICAN TIME " + AmericanTime);
    console.log("Se actualizo a : " + horaInicio);
    console.log("Se actualizo a : " + horaFinal);
  }, [horaInicio, horaFinal]);

  return (
    <>
      {/*--------------- INICIO MODAL */}

      <div className="details-container">
        <img src={whiteIcon} alt="" className="circle" />
        <div className="details flex-grow-1  row d-flex justify-content-left align-items-center">
          <h3 className="service-name col-md-2">{servicio.name}</h3>

          {horaInicio ? (
            <span className="text-light mx-2 col-md-2">{horaInicio}</span>
          ) : (
            <span className=" col-md-2 text-secondary text-decoration-line-through">
              No empezado...
            </span>
          )}

          {horaFinal ? (
            <span className="text-light mx-2 col-md-2">{horaFinal}</span>
          ) : (
            <span className="mx-2 col-md-2 text-secondary text-decoration-line-through">
              No terminado...
            </span>
          )}
          <div className="d-flex col-md-4 flex-row row justify-content-center align-items-center">
            <div className="col-md-1"></div>
            <button
              onClick={() => {
                //Aqui vamos a cambiar el localstorage
                localStorage.setItem("servicioInicio", servicio.idUnion);
              }}
              className={`btn col-md-3 ${
                iniciarDisabled
                  ? "disabled btn-outline-secondary m-1"
                  : "btn-outline-primary m-1"
              }`}
              data-bs-toggle="modal"
              data-bs-target={"#modalConfirmarInicioTiempo"}
              disabled={iniciarDisabled}
            >
              <span className="d-flex align-items-center justify-content-center">
                Iniciar{" "}
                <MdOutlineStart
                  color={`${iniciarDisabled ? "gray" : "blue"}`}
                  className="ms-1"
                />
              </span>
            </button>

            {solicitud.name == "Metalurgia" ? (
              <NavLink
                to={`matriz`}
                state={{ idUnion: servicio.idUnion, recargar: true }}
                className={"btn btn-outline-warning m-1 col-md-3"}
              >
                <span className="d-flex align-items-center justify-content-center">
                  Results
                </span>
              </NavLink>
            ) : (
              <></>
            )}

            <button
              data-bs-toggle="modal"
              data-bs-target={"#modalConfirmarFinTiempo"}
              className={`btn col-md-3 ${
                terminarDisabled
                  ? "disabled btn-outline-secondary m-1"
                  : "btn-outline-danger m-1"
              }`}
              onClick={() => {
                localStorage.setItem("servicioFin", servicio.idUnion);
              }}
            >
              <span className="d-flex align-items-center justify-content-center">
                Fin{" "}
                <RiTimer2Fill
                  color={`${terminarDisabled ? "gray" : "red"}`}
                  className="ms-1"
                />
              </span>
            </button>
          </div>

          <div className="d-flex col-md-2 row  justify-content-left align-items-center  ">
            {/*Archivo para el pdf */}
            {servicio.file ? (
              <FaFilePdf
                color="red"
                size={20}
                className="iconoMostrarArchivo"
                onClick={handlePdfClick}
              />
            ) : (
              <></>
            )}
          </div>
          <hr />
        </div>
      </div>
    </>
  );
};

import React, { useEffect, useState } from "react";
import { Sidebar } from "../../globalComponents/Sidebar";
import "../styles/FormatoResultados.css";
import "../logica/procesarArchivos.js";
import { leerArchivo2 } from "../logica/procesarArchivos.js";
import { ResultadoComponent } from "../components/ResultadoComponent.jsx";
import animacionConfiramcion from "../../assets/confirmar.gif";
import Pagination from "../components/Pagination.jsx";
import planReaccion from "../../assets/planReaccionHD.png";

export const FormatoResultados = () => {
  const [idComponente, setIdComponente] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datosComponente, setDatosComponente] = useState([]);
  const [sections, setSections] = useState([]);
  const [solicitud, setSolicitud] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [inputValidations, setInputValidations] = useState({});
  const [alert, setAlert] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [areInputsValidated, setAreInputsValidated] = useState([]);
  const [ultimos10ResultadosDeComponent, setUltimos10ResultadosDeComponent] =
    useState([]);
  const [resultadosSolicitudes, setResultadosSolicitudes] = useState([]);

  const handleLeerArchivo = (e) => {
    leerArchivo2(e);
  };

  const obtenerUltimos10Resultados = async (idComponente, page = 1) => {
    //Limpiamos
    //setUltimos10ResultadosDeComponent([]);
    try {
      const response = await fetch(
        `http://10.239.10.175:3000/getLastTenRequestsByComponents/${idComponente}?page=${page}&pageSize=10`
      );
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }
      const data = await response.json();
      setUltimos10ResultadosDeComponent(data.data);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  const resultadoSolicitudes = async (requestId) => {
    try {
      const response = await fetch(
        `http://10.239.10.175:3000/getResultsByRequest/${requestId}`
      );
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }
      const data = await response.json();
      setResultadosSolicitudes((prevResultados) => [
        ...prevResultados,
        ...data,
      ]);
      console.log("Data sobre resultados de las características:", data);
    } catch (error) {
      console.error("Error al obtener el resultado de las solicitudes:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerDatosDelComponente = async (idComponent) => {
    try {
      console.log("idComponent", idComponent);
      const response = await fetch(
        `http://10.239.10.175:3000/getAllSectionsAndCaracteristicasByComponent/${idComponent}`
      );
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }
      const data = await response.json();
      setDatosComponente(data);
      filtrarLasSectionsDeLosResultado(data);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener secciones y características:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //Filtramos las secciones de los resultados
  const filtrarLasSectionsDeLosResultado = (data) => {
    const sectionsMap = data.reduce((acc, item) => {
      const {
        idSection,
        section,
        idCaracteristica,
        caracteristica,
        lowerLimit,
        upperLimit,
        unit,
      } = item;
      if (!acc[idSection]) {
        acc[idSection] = {
          idSection,
          section,
          caracteristicas: [],
        };
      }
      acc[idSection].caracteristicas.push({
        idCaracteristica,
        caracteristica,
        lowerLimit,
        upperLimit,
        unit,
      });
      return acc;
    }, {});
    const sectionsFiltradas = Object.values(sectionsMap);
    setSections(sectionsFiltradas);
    console.log(sectionsFiltradas);
  };

  const registrarResultado = async () => {
    setLoading(true);
    const promises = [];

    // Check if all inputs are valid
    const allInputsValid = Object.entries(inputValidations).every(
      ([_, isValid]) => isValid === true
    );

    if (allInputsValid) {
      sections.forEach((seccion) => {
        seccion.caracteristicas.forEach((caracteristica) => {
          const idCaracteristica = caracteristica.idCaracteristica;
          const requestId = JSON.parse(
            localStorage.getItem("request")
          ).requestId;
          const value = inputValues[idCaracteristica];
          const resultado = "Conforme";

          if (!value) {
            setError("Todos los campos son requeridos");
            setLoading(false);
            return;
          }

          promises.push(
            (async () => {
              try {
                const response = await fetch(
                  `http://10.239.10.175:3000/setCaracteristicaResult`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      idCaracteristica,
                      value,
                      requestId,
                      resultado,
                    }),
                  }
                );

                if (!response.ok) {
                  throw new Error(
                    `Error al obtener datos: ${response.statusText}`
                  );
                }

                const data = await response.json();
                console.log(data);
              } catch (error) {
                console.error(
                  "Error al obtener secciones y características:",
                  error
                );
                setError(error.message);
              }
            })()
          );
        });
      });

      try {
        await Promise.all(promises);
        alert("Resultados registrados correctamente.");
        setLoading(false);
      } catch (error) {
        alert(`Error al registrar resultados: ${error.message}`);
      }
    } else {
      alert(
        "Por favor, verifique que todos los valores estén dentro de los rangos permitidos"
      );
    }

    setLoading(false);
  };

  const handleChange = (idCaracteristica, lowerLimit, upperLimit, e) => {
    const { value } = e.target;
    if (!isNaN(value) && parseFloat(value) == value) {
      setInputValues((prev) => ({
        ...prev,
        [idCaracteristica]: value,
      }));
      //Validar que este en el rango
      const isValid = value >= lowerLimit && value <= upperLimit;
      // Agregamos a las validaciones
      setInputValidations((prev) => ({
        ...prev,
        [idCaracteristica]: isValid,
      }));
      setAlert(null);
    } else {
      setAlert(`El valor ingresado no es un número válido.`);
    }
  };

  useEffect(() => {
    console.log("Inputs : ", inputValues);
  }, [inputValues]);

  useEffect(() => {
    const id = localStorage.getItem("idComponenteSeleccionado");
    setIdComponente(parseInt(id));
    const solicitudString = localStorage.getItem("request");
    if (solicitudString) {
      const solicitud = JSON.parse(solicitudString);
      setSolicitud(solicitud);
    }
  }, []);

  useEffect(() => {
    obtenerUltimos10Resultados(idComponente, currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  //Hasta qui sale el error Encountered two children with the same key, `2`.
  useEffect(() => {
    if (idComponente) {
      obtenerDatosDelComponente(idComponente);
      //Parece ser que aqui empieza el error Encountered two children with the same key, `2`.
      obtenerUltimos10Resultados(idComponente, 1);
    }
  }, [idComponente]);

  useEffect(() => {
    ultimos10ResultadosDeComponent.map((solicitud) => {
      console.log("Solicitud N: " + solicitud.requestId);
      resultadoSolicitudes(solicitud.requestId);
    });
  }, [ultimos10ResultadosDeComponent]);

  useEffect(() => {
    console.log("RESULTADOS OBTENIDOS :", resultadosSolicitudes);
  }, [resultadosSolicitudes]);

  useEffect(() => {
    console.log("Solicitud: " + solicitud);
  }, [solicitud]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <>
      {/*Modal confirmacion */}
      <div
        class="modal fade  "
        id="modalIngresarResultado"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg ">
          <div class="modal-content ">
            <div class="modal-header">
              <h5 class="modal-title text-dark" id="exampleModalLabel">
                Confirmación de terminación
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body d-flex justify-content-center align-items-center flex-column   ">
              <h6 class="text-dark text-center mt-4">
                Selecciona un resultado para la solicitud
              </h6>
              <br />
              <div className="">
                <img
                  src={planReaccion}
                  className="w-100 h-75 col-md-3 imgPlanAccion"
                />
                <div class="row d-flex justify-content-center align-items-center mt-4 mb-4 col-md-5 my-4 w-100">
                  <ResultadoComponent
                    valor={"Conforme"}
                    alert={"alert-success"}
                    cambioBackgroundColor={"conforme"}
                    id={1}
                  />
                  <div class="col-md-2"></div>
                  <ResultadoComponent
                    valor={"No Conforme"}
                    alert={"alert-danger"}
                    cambioBackgroundColor={"noConforme"}
                    id={2}
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                class="btn btn-success"
                onClick={registrarResultado}
                data-bs-dismiss="modal"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*Tabla de resultados*/}
      {error && <p>Error: {error}</p>}
      {!loading ? (
        <div class="p-4 animate__animated  animate__fadeInRight">
          <div class="col-10 p-4 contenedorFormato h-100 w-100 ">
            <div class="tableDivContainer   ">
              <div class="table-responsive">
                <table class="table table-dark table-bordered   mt-4 text-center">
                  <thead class="headerTable">
                    <tr>
                      <th scope="col" class="w-5">
                        #Folio
                      </th>
                      <th scope="col" class="w-5">
                        Turno
                      </th>
                      <th scope="col" class="w-10">
                        Fecha
                      </th>
                      <th scope="col" class="w-10">
                        Línea
                      </th>
                      <th scope="col" class="w-10">
                        Número parte
                      </th>
                      <th scope="col" class="w-10">
                        Técnico
                      </th>
                      <th scope="col" class="w-10">
                        Hora
                      </th>
                      <th scope="col" class="w-10">
                        Lote
                      </th>
                      <th scope="col" class="w-10">
                        Laboratorio
                      </th>
                      <th scope="col" class="w-10">
                        Solicitante
                      </th>
                      {sections.map((section) => (
                        <th
                          scope="colgroup"
                          colSpan={section.caracteristicas.length}
                          key={section.idSection}
                          class="w-10 text-truncate"
                        >
                          {section.section === null ? "" : `${section.section}`}
                        </th>
                      ))}
                      <th scope="col" class="w-10">
                        Resultado
                      </th>
                    </tr>
                    <tr class="text-align: center">
                      <th class="d-none d-md-table-cell"></th>
                      <th class="d-none d-md-table-cell"></th>
                      <th class="d-none d-md-table-cell"></th>
                      <th class="d-none d-md-table-cell"></th>
                      <th class="d-none d-md-table-cell"></th>
                      <th class="d-none d-md-table-cell"></th>
                      <th class="d-none d-md-table-cell"></th>
                      <th class="d-none d-md-table-cell"></th>

                      <th class="d-none d-md-table-cell"></th>
                      <th class="d-none d-md-table-cell"></th>
                      {sections &&
                        sections.map((section) =>
                          section.caracteristicas.map((caracteristica) => (
                            <th
                              key={caracteristica.idCaracteristica}
                              className="text-truncate align-top"
                            >
                              {caracteristica.caracteristica}
                              <br />
                              {caracteristica.upperLimit === null
                                ? `${caracteristica.lowerLimit} ${caracteristica.unit}`
                                : `${caracteristica.lowerLimit}-${caracteristica.upperLimit}`}
                              <br />
                              {caracteristica.upperLimit === null
                                ? `Min`
                                : `${caracteristica.unit}`}
                            </th>
                          ))
                        )}
                      <th class="d-none d-md-table-cell"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="solicitudActualTabla">
                      <td>{solicitud.requestId}</td>
                      <td>{solicitud.turn} °</td>
                      <td>{formatDate(solicitud.date)}</td>
                      <td>{solicitud.line}</td>
                      <td>{solicitud.partNumber}</td>
                      <td>Luis Olivares</td>
                      <td>{formatDate(solicitud.startHour)}</td>
                      <td>{solicitud.lot}</td>
                      <td>{solicitud.name}</td>
                      <td>
                        {solicitud.requester ? solicitud.requester : " N / A"}
                      </td>
                      {datosComponente.map((dato, index) => (
                        <td key={index}>
                          <input
                            type="number"
                            id={"input-" + index}
                            className={`inputresultado  w-100 ${
                              inputValidations[dato.idCaracteristica] === false
                                ? "bg-danger"
                                : inputValidations[dato.idCaracteristica] ===
                                  true
                                ? "bg-success"
                                : ""
                            }`}
                            value={inputValues[dato.idCaracteristica] || ""}
                            onChange={(e) =>
                              handleChange(
                                dato.idCaracteristica,
                                dato.lowerLimit,
                                dato.upperLimit,
                                e
                              )
                            }
                          />
                        </td>
                      ))}
                      <td>
                        <button
                          class="btn btn-success"
                          onClick={registrarResultado}
                          data-bs-toggle="modal"
                          data-bs-target={`#modalIngresarResultado`}
                        >
                          Guardar
                        </button>
                      </td>
                    </tr>
                    {ultimos10ResultadosDeComponent.map((request) => {
                      const resultadosParaRequest =
                        resultadosSolicitudes.filter(
                          (resultado) =>
                            resultado.requestId === request.requestId
                        );
                      return (
                        <tr key={request.requestId}>
                          <td>{request.requestId}</td>
                          <td>{request.turn}</td>
                          <td>{request.date}</td>
                          <td>{request.line}</td>
                          <td>{request.partnumber}</td>
                          <td>Example</td>
                          <td>{request.date}</td>
                          <td>{request.lot}</td>
                          <td>{request.name}</td>
                          <td>
                            {request.requester ? request.requester : "N / A"}
                          </td>
                          {sections.flatMap((section) =>
                            section.caracteristicas.map(
                              (caracteristica, index) => {
                                const resultado = resultadosParaRequest.find(
                                  (resultado) =>
                                    resultado.requestId === request.requestId
                                );
                                return (
                                  //Este td contenia key={index}
                                  <td>
                                    {resultado ? resultado.result : "N / A"}
                                  </td>
                                );
                              }
                            )
                          )}
                          <td>{request.result}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ------Aqui va la paginacion */}
            <div className="pagination w-100 d-flex justify-content-center align-items-center">
              {/*Hay que hacer el calculo de total de paginas y un handle de la pagina actual */}
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>

            {/*
            
            <div class="resultadosContainer h-50 ">
            {alert && (
              <div class="alert alert-danger" role="alert">
                {alert}
              </div>
            )}
            <input
              type="file"
              onChange={handleLeerArchivo}
              accept=".txt, .pdf, .csv"
            />
            <button
              onClick={() =>
                document.querySelector('input[type="file"]').click()
              }
            >
              Seleccionar Archivos
            </button>
          </div>
            */}
          </div>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </>
  );
};

import React, { useState, useEffect, useRef } from "react";
import { FaFilePdf } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportePDF } from "./ReportePDF";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const SolicitudTerminadaComponent = ({ solicitud, currentPage }) => {
  // Other hooks remain the same
  const [servicios, setServicios] = useState([]);
  const [porcentaje, setPorcentaje] = useState(0);
  const [cantidadServicios, setCantidadServicios] = useState(0);
  const [serviciosTerminados, setServiciosTerminados] = useState(0);
  const [cantidadPrioridades, setCantidadPrioridades] = useState(0);

  // Use a ref to track if this component is mounted
  const isMounted = useRef(true);

  // Generate a unique key for each PDF instance based on solicitud and page
  const pdfKey = `pdf-${solicitud.requestId}-${currentPage}`;

  // Add animation style
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      isMounted.current = false;
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Function to fetch services for the solicitud
  const obtenerServiciosDeSolicitud = async (idRequest) => {
    try {
      const response = await fetch(
        `http://10.239.10.175:3000/requestsServices/${idRequest}`
      );

      if (!response.ok)
        throw new Error(`Error al obtener datos: ${response.statusText}`);

      const data = await response.json();

      // Only update state if the component is still mounted
      if (isMounted.current) {
        setServicios(data);
      }
    } catch (error) {
      console.error("Error al consultar servicios:", error);
    }
  };

  // Handle PDF view in a new window
  const handleViewPDF = (blob) => {
    if (blob) {
      // Create a new URL for this specific blob
      const pdfUrl = URL.createObjectURL(blob);

      // Open in new window
      const newWindow = window.open(pdfUrl, "_blank");

      // Clean up the URL object when the window closes
      if (newWindow) {
        newWindow.addEventListener("beforeunload", () => {
          URL.revokeObjectURL(pdfUrl);
        });
      }
    }
  };

  // Update services when solicitud changes
  useEffect(() => {
    if (solicitud?.requestId) {
      obtenerServiciosDeSolicitud(solicitud.requestId);
    }

    // Clean up function
    return () => {
      // Potential cleanup for any ongoing operations
    };
  }, [solicitud.requestId]);

  // Calculate statistics based on services
  useEffect(() => {
    if (!isMounted.current) return;

    setCantidadServicios(servicios.length);
    let contadorServiciosTerminados = 0;
    let contadorPrioridades = 0;

    servicios.forEach((servicio) => {
      if (servicio.endDate && servicio.startDate) contadorServiciosTerminados++;
      if (servicio.priority > 5) contadorPrioridades++;
    });

    setServiciosTerminados(contadorServiciosTerminados);
    setCantidadPrioridades(contadorPrioridades);

    // Calculate percentage when services change
    if (servicios.length > 0) {
      setPorcentaje((contadorServiciosTerminados / servicios.length) * 100);
    }
  }, [servicios]);

  return (
    <>
      <div className="containerSolicitud">
        <div className="row">
          <div className={`col ${"mainDiv-" + solicitud.requestId}`}>
            <div className="filaTable row d-flex align-items-center justify-content-center contenedorSolicitudes py-2 rounded">
              {/* Content columns remain the same */}
              <div className="itemTabla col-md d-flex align-items-center justify-content-center mt-3">
                <p className="d-flex align-items-center justify-content-center">
                  {solicitud.code}
                </p>
              </div>
              <div className="itemTabla col-md d-flex align-items-center justify-content-center text-center">
                <p className="d-flex align-items-center justify-content-center text-center mt-3">
                  {solicitud.requestId}
                </p>
              </div>
              {/* Other content columns */}
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
              <div className="itemTabla col-md d-flex align-items-center justify-content-center mt-3">
                <p className="d-flex align-items-center justify-content-center">
                  {solicitud.status}
                </p>
              </div>

              {/* Improved PDF handling */}
              <div className="itemTabla col-md d-flex align-items-center justify-content-center">
                <PDFDownloadLink
                  document={
                    <ReportePDF solicitud={solicitud} servicios={servicios} />
                  }
                  fileName={`F-${solicitud.requestId}-${solicitud.name}.pdf`}
                  key={pdfKey}
                >
                  {({ blob, url, loading, error }) => {
                    if (loading) {
                      return (
                        <AiOutlineLoading3Quarters
                          style={{
                            animation: "spin 2s linear infinite",
                          }}
                        />
                      );
                    }

                    if (error) {
                      return <span className="text-danger">Error</span>;
                    }

                    return (
                      <div
                        className="pdf-icon"
                        onClick={(e) => {
                          e.preventDefault();
                          handleViewPDF(blob);
                        }}
                      >
                        <FaFilePdf />
                      </div>
                    );
                  }}
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </>
  );
};

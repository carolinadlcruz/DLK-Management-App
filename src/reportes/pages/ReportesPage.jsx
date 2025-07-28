import React, { useEffect, useState, useCallback } from "react";
import { LiaNewspaper } from "react-icons/lia";
import { Combobox } from "../../globalComponents/Combobox";
import Pagination from "../components/Pagination";
import { Header } from "../../globalComponents/Header";
import { TableReportes } from "../../globalComponents/TablaReportes";
import { SolicitudesTerminadasContainer } from "../components/SolicitudesTerminadasContainer";

export const ReportesPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [laboratorioSeleccionado, setLaboratorioSeleccionado] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [folioSearch, setFolioSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Standard function to load data for a specific page
  const cargarSolicitudesSegunLaboratorio = useCallback(
    async (idLab, page = 1) => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://10.239.10.175:3000/getRequestsByLabWithPagination/${idLab}?page=${page}`
        );
        if (!response.ok) {
          throw new Error(`Error al obtener datos: ${response.statusText}`);
        }
        const result = await response.json();
        setSolicitudes(result.data);
        setFilteredSolicitudes(result.data);
        setTotalPages(result.totalPages);
        setCurrentPage(result.currentPage);
      } catch (error) {
        console.error("Error al consultar servicios:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Function to search for a folio across all pages
  const buscarFolioPorCompleto = async (idLab, folioValue) => {
    setLoading(true);
    setIsSearching(true);

    try {
      // First, try to fetch all data (if your API supports it)
      try {
        // This endpoint should return all solicitudes without pagination
        // Replace with actual endpoint if available
        const response = await fetch(
          `http://10.239.10.175:3000/getRequestsByLabTerminadas/${idLab}`
        );
        if (response.ok) {
          const allData = await response.json();
          // Filter directly from all data
          const filtered = allData.filter((solicitud) => {
            const folio = String(solicitud.requestId || "").toLowerCase();
            return folio.includes(folioValue.toLowerCase());
          });

          setFilteredSolicitudes(filtered);
          // No need to update pagination since we're showing search results
          return;
        }
      } catch (error) {
        console.log(
          "No endpoint for getting all data, falling back to page-by-page search"
        );
      }

      // Fallback: If there's no endpoint to get all data at once,
      // we'll search page by page
      let allSolicitudes = [];
      let foundMatch = false;
      let currentPageToCheck = 1;

      // Loop through all pages to find matches
      // Limit to a reasonable number to avoid infinite loops
      while (
        currentPageToCheck <= totalPages &&
        currentPageToCheck <= 10 &&
        !foundMatch
      ) {
        const response = await fetch(
          `http://10.239.10.175:3000/getRequestsByLabWithPagination/${idLab}?page=${currentPageToCheck}`
        );

        if (!response.ok) {
          break;
        }

        const result = await response.json();

        // Check if this page has any matches
        const matches = result.data.filter((solicitud) => {
          const folio = String(solicitud.requestId || "").toLowerCase();
          return folio.includes(folioValue.toLowerCase());
        });

        if (matches.length > 0) {
          // Found matches on this page
          setFilteredSolicitudes(matches);
          foundMatch = true;
          break;
        }

        currentPageToCheck++;
      }

      // If no matches found in any page, set empty array
      if (!foundMatch) {
        setFilteredSolicitudes([]);
      }
    } catch (error) {
      console.error("Error al buscar folio:", error);
      setFilteredSolicitudes([]);
    } finally {
      setLoading(false);
      setIsSearching(true); // Keep this true to indicate we're showing search results
    }
  };

  useEffect(() => {
    if (!isSearching) {
      cargarSolicitudesSegunLaboratorio(laboratorioSeleccionado, currentPage);
    }
  }, [
    cargarSolicitudesSegunLaboratorio,
    laboratorioSeleccionado,
    currentPage,
    isSearching,
  ]);

  // Handle folio search input change
  const handleFolioSearch = (e) => {
    const value = e.target.value;
    setFolioSearch(value);

    // If search is empty, revert to normal pagination mode
    if (!value.trim()) {
      setIsSearching(false);
      cargarSolicitudesSegunLaboratorio(laboratorioSeleccionado, currentPage);
      return;
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (folioSearch.trim()) {
      // Execute the global search when form is submitted
      buscarFolioPorCompleto(laboratorioSeleccionado, folioSearch);
    } else {
      // If search is empty, go back to normal pagination mode
      setIsSearching(false);
      cargarSolicitudesSegunLaboratorio(laboratorioSeleccionado, currentPage);
    }
  };

  const handlePageChange = (page) => {
    // Only change page if not in search mode
    if (!isSearching) {
      setSolicitudes([]);
      setFilteredSolicitudes([]);
      setCurrentPage(page);
    }
  };

  const handleLaboratoryChange = (selectedLab) => {
    setLaboratorioSeleccionado(parseInt(selectedLab));
    // Reset search and go back to first page
    setFolioSearch("");
    setIsSearching(false);
    setCurrentPage(1);
    cargarSolicitudesSegunLaboratorio(selectedLab, 1);
  };

  // Handle clearing the search
  const handleClearSearch = () => {
    setFolioSearch("");
    setIsSearching(false);
    cargarSolicitudesSegunLaboratorio(laboratorioSeleccionado, currentPage);
  };

  return (
    <>
      <div className="animate__animated animate__fadeInRight">
        <div className="p-5 divMainSolicitudes h-100">
          <div className="header d-flex align-items-center">
            <LiaNewspaper className="iconHeader" />
            <Header title="Reportes" />
          </div>
          <hr className="border border-primary" />

          {/* Busqueda de folio */}
          <form onSubmit={handleSearchSubmit} className="searchBar d-flex">
            <input
              type="text"
              className="form__field2 mt-4"
              placeholder="Introduce un folio"
              name="busqueda"
              id="busqueda"
              value={folioSearch}
              onChange={handleFolioSearch}
            />
            <button
              type="submit"
              className="search-icon-button"
              style={{ background: "none", border: "none" }}
            >
              <i className="search-icon fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
          <br />

          {/* Display search status */}
          {isSearching && (
            <div className="d-flex align-items-center mb-3">
              <span>Mostrando resultados para: "{folioSearch}"</span>
              <button
                className="btn btn-sm btn-outline-secondary ms-3"
                onClick={handleClearSearch}
              >
                Limpiar búsqueda
              </button>
            </div>
          )}

          {/* Contenedor para los combobox */}
          <div className="comboboxContainer row">
            <Combobox
              className=""
              title={"Laboratorios"}
              onLaboratoryChange={handleLaboratoryChange}
            />
          </div>
          <br />

          {/* Contenedor para los tabs */}
          <div className="tabsContainer"></div>

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
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : filteredSolicitudes.length === 0 && isSearching ? (
              <div className="alert alert-info">
                No se encontraron solicitudes con el folio: "{folioSearch}"
              </div>
            ) : (
              <>
                <TableReportes />
                <SolicitudesTerminadasContainer
                  solicitudes={filteredSolicitudes}
                  currentPage={isSearching ? 1 : currentPage}
                />
              </>
            )}
          </div>

          {/* Espacio para la paginacion - only show when not searching */}
          {!isSearching && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

import React, { useState, useEffect } from "react";
import { Sidebar } from "../../globalComponents/Sidebar";
import { NavLink } from "react-router-dom";
import "../styles/MatrizPage.css"; // Asegúrate de importar el archivo CSS
import { useLocation } from "react-router-dom";

export const MatrizPage = () => {
  // Hooks
  const [loading, setLoading] = useState(true);
  const [transformedInfoProveedores, setTransformedInfoProveedores] = useState(
    []
  );
  const [error, setError] = useState(null); // Agrega manejo de errores
  const [idComponenteSeleccionado, setidComponenteSeleccionado] = useState(1); // Agrega manejo de errores
  const location = useLocation();
  const { idUnion } = location.state || {}; // Obtiene el valor de idUnion del estado

  const onReadArchivo = async (evt) => {
    let file = evt.target.files[0];

    if (!file) {
      console.error("No se seleccionó ningún archivo.");
      return;
    }

    // Validate File Type
    const validFormats = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();
    if (!validFormats.includes(fileExtension)) {
      console.error("Formato de archivo no compatible");
      return;
    }

    // Create FormData to send the file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("requestId", idUnion);
    console.log("IDUNION " + idUnion);

    try {
      const response = await fetch(
        "http://10.239.10.175:3000/adjuntarArchivoPDF",
        {
          method: "PUT",
          body: formData, // Send file as FormData
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log("Archivo guardado exitosamente:", result.message);
      } else {
        console.error("Error al guardar el archivo:", result.message);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const obtenerInfoDelComponente = async (idComponent) => {
    try {
      const response = await fetch(
        `/getAllSectionsAndCaracteristicasByComponent/${idComponent}`
      );
      if (!response) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Componente:", data);
    } catch (error) {
      console.error(
        "Error al obtener la caracteristicas del componente: ",
        error
      );
      setError(error.message);
    }
  };

  const obtenerInfoProveedores = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://10.239.10.175:3000/getInfoProveedores`
      );
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Data Proveedores:", data);
      setTransformedInfoProveedores(transformInfoProveedores(data));
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleComponentChange = async (idComponenteSeleccionado) => {
    setidComponenteSeleccionado(idComponenteSeleccionado);
  };

  const imprimirID = (idComponent) => {
    console.log(idComponent);
  };

  useEffect(() => {
    obtenerInfoProveedores();
  }, []);

  useEffect(() => {
    if (location.state?.recargar) {
      obtenerInfoProveedores();
    }
  }, [location.state]);

  const transformInfoProveedores = (data) => {
    const result = [];

    data.forEach(
      ({
        providerName,
        idProvider,
        category,
        idCategory,
        component,
        idComponent,
      }) => {
        let provider = result.find((p) => p.proveedor === providerName);
        if (!provider) {
          provider = {
            proveedor: providerName,
            idProvider: idProvider,
            categorias: [],
          };
          result.push(provider);
        }

        let categoria = provider.categorias.find((c) => c.nombre === category);
        if (!categoria) {
          categoria = {
            nombre: category,
            idCategory: idCategory,
            componentes: [],
          };
          provider.categorias.push(categoria);
        }

        categoria.componentes.push({
          nombre: component,
          idComponent: idComponent,
        });
      }
    );

    console.log("transformed", result);
    return result; // Devolver el resultado
  };
  useEffect(() => {
    console.log("Received idUnion:", idUnion);
  }, []); // Empty dependency array -> runs only once when the component mounts

  return (
    <>
      {error && <p>Error: {error}</p>}
      {!loading ? (
        <div className="col mx-4 ">
          <div className="headerMatriz d-flex justify-content-between align-items-center">
            <h5 className="mt-4 mb-3">Matriz de características</h5>
            <div>
              <input
                type="file"
                onChange={onReadArchivo}
                className="invisible d-none"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
              <button
                className="btn btn-outline-warning"
                onClick={() =>
                  document.querySelector('input[type="file"]').click()
                }
              >
                Adjuntar archivo
              </button>
            </div>
          </div>
          <div className="table-responsive h-100">
            <Table
              data={
                Array.isArray(transformedInfoProveedores)
                  ? transformedInfoProveedores
                  : []
              }
            />
          </div>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </>
  );
};

const Table = ({ data }) => {
  const modificarExcel = async (idComponenteSeleccionado) => {
    const storedRequest = localStorage.getItem("request");
    const storedUser = localStorage.getItem("user");
    const parsedRequest = JSON.parse(storedRequest);
    const parsedUser = JSON.parse(storedUser);
    const requestId = parsedRequest.requestId;

    try {
      // Get the component information as you currently do
      const response = await fetch(
        `http://10.239.10.175:3000/getInfoComponent/${idComponenteSeleccionado}`
      );
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }
      const component = await response.json();

      // Create the URL parameters
      const params = new URLSearchParams({
        path: component.file_path,
        sheet: component.nombre_sheet || "",
        folio: requestId || "",
        celdaFolio: component.folio || "",
        inspector: `${parsedUser.name} ${parsedUser.lastName}` || "",
        celdaInspector: component.inspector || "",
        partNumber: parsedRequest.partNumber || "",
        celdaNumber: component.partNumber || "",
        turn: parsedRequest.turn || "",
        celdaTurn: component.turn || "",
        startHour: parsedRequest.date
          ? parsedRequest.date.split("T")[1].split(".")[0]
          : "",
        celdaStart: component.startHour || "",
        lineName: parsedRequest.lineName || "",
        celdaLine: component.line || "",
      });

      // Format the URL with the custom protocol
      const url = `excel-macro://open?${params.toString()}`;

      console.log(parsedRequest);
      // Launch the protocol handler
      window.location.href = url;

      // Optional: add a small delay and check if the app opened
      setTimeout(() => {
        // If we're still here, the protocol handler might not be installed
        const isInstalled = document.hidden;
      }, 1000);
    } catch (error) {
      console.error("Error al consultar componente:", error);
      alert("Error al abrir el archivo Excel: " + error.message);
    }
  };
  return (
    <table className="table table-dark table-bordered  mt-4">
      <thead>
        <tr>
          <th>Proveedor</th>
          <th>Categoría</th>
          <th>Componentes</th>
        </tr>
      </thead>
      <tbody>
        {data.map((proveedor, proveedorIndex) =>
          proveedor.categorias.map((categoria, categoriaIndex) => (
            <tr key={`${proveedorIndex}-${categoriaIndex}`}>
              {categoriaIndex === 0 && (
                <td rowSpan={proveedor.categorias.length}>
                  {proveedor.proveedor}
                </td>
              )}
              <td>{categoria.nombre}</td>
              <td>
                {categoria.componentes.map((componente, componenteIndex) => (
                  <div key={componenteIndex}>
                    <NavLink
                      onClick={() => {
                        localStorage.setItem(
                          "idComponenteSeleccionado",
                          componente.idComponent
                        );

                        modificarExcel(componente.idComponent);
                      }}
                    >
                      {componente.nombre}
                    </NavLink>
                  </div>
                ))}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

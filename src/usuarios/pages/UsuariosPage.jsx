import React, { useEffect, useState, Suspense, lazy } from "react";
import { Header } from "../../globalComponents/Header";
import { AiOutlineUser } from "react-icons/ai";
import { Combobox } from "../../globalComponents/Combobox";
import { AddButton } from "../../servicios/components/AddButton";
import { UsuariosContainer } from "../components/UsuariosContainer";
import { ComboboxRol } from "../components/ComboboxRol";
import { Loading } from "../../globalComponents/Loading";
import "../styles/UsuariosPage.css";

/*Importamos los estilos necesarios */
export const UsuariosPage = () => {
  //Hooks
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState();
  const [laboratorioSeleccionado, setLaboratorioSeleccionado] = useState(1);
  const [contadorUsuarios, setContadorUsuarios] = useState(0);
  const [laboratoriosSeleccionados, setLaboratoriosSeleccionados] = useState(
    []
  );

  //Hooks para la creación de usuarios
  const [numEmployee, setNumEmployee] = useState("");
  const [apellidos, setApellidos] = useState();
  const [nombreDelUsuario, setNombreDelUsuario] = useState();
  const [nombreUsuario, setNombreUsuario] = useState();
  const [contraseña, setContraseña] = useState();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);

  //Filtrado y busqueda
  const [setBusqueda] = useState();
  const [datosBusqueda, setDatosBusqueda] = useState();

  //Seleccion de roles
  const [idRoleSeleccionado, setIdRoleSeleccionado] = useState(2);

  //Excel para usuarios
  const [excelFile, setExcelFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  //Metodos
  //Metodo para consultar todos los laboratorios del checklist del modal
  const consultarTodosLosLaboratorios = async () => {
    //Hacemos la peticion para traer todos los datos
    try {
      const response = await fetch(`http://10.239.10.175:3000/getAllLabs/`);

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }

      const labs = await response.json();
      setLaboratorios(labs);
    } catch (error) {
      console.error("Error al consultar servicios:", error);
    }
  };
  //! se usa este
  //Metodo para consulatr los usuarios asignaods a un laboratorio
  const consultarUsuariosPorLaboratorio = async (
    idLab,
    page = 2,
    pageSize = 5
  ) => {
    try {
      const response = await fetch(
        `http://10.239.10.175:3000/getAllUsersByLab/${idLab}`
      );

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }

      const usuarios = await response.json();
      setUsuarios(usuarios);
      setDatosBusqueda(usuarios);
      setContadorUsuarios(usuarios.length);
    } catch (error) {
      console.error("Error al consultar los usuarios:", error);
    }
  };

  //Metodo para agregar un nuevo usuario al laboratorio
  const agregarNuevoUsuarioAlLaboratorio = async () => {
    //Vamos a hacer la petición
    try {
      // Datos del nuevo usuario
      const nuevoUsuario = {
        idRole: idRoleSeleccionado,
        name: nombreUsuario,
        lastName: apellidos,
        username: nombreDelUsuario,
        password: contraseña,
        numEmploy: numEmployee,
        laboratorios: laboratoriosSeleccionados,
        imagen: "User.png",
      };

      // Realizar la petición POST para agregar el nuevo usuario
      const response = await fetch("http://10.239.10.175:3000/addUserByLab/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoUsuario),
      });

      // Verificar si la petición fue exitosa (código de estado 200 o 201)
      if (response.ok) {
        console.log("Usuario agregado correctamente");
        mostrarMensajeModal("Usuario agregado correctamente", "text-success");

        // Recargar usuarios del laboratorio actual
        consultarUsuariosPorLaboratorio(laboratorioSeleccionado);

        const modal = new bootstrap.Modal(
          document.getElementById("modalAgregar")
        );
        modal.hide();
      } else {
        // En caso de un código de estado no exitoso, manejar el error
        throw new Error(`Error al agregar el servicio: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al agregar el usuario:", error.message);

      // Mostrar mensaje de error en el modal
      mostrarMensajeModal("Error al agregar el usuario", "text-danger");
    }
  };

  //Metodo para recargar usuarios de kiosko
  const handleExcelUpload = async () => {
    if (!excelFile) {
      setUploadMessage("Selecciona un archivo Excel antes de subir.");
      return;
    }

    setIsUploading(true);
    setUploadMessage(""); // Clear previous

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const response = await fetch("http://10.239.10.175:3000/upload-workers", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const msg = await response.json();
        setUploadMessage(msg.message);
        // Optional: refresh data here if needed
        // consultarUsuariosPorLaboratorio(laboratorioSeleccionado);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Error al subir archivo.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadMessage("Fallo al subir archivo: " + err.message);
    }

    setIsUploading(false);
  };

  const buscarUsuariosPorNombre = async (idlab, searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await fetch(
          `http://10.239.10.175:3000/searchUsersByName/${idlab}/${searchTerm}`
        );

        if (!response.ok) {
          throw new Error(`Error al obtener datos: ${response.statusText}`);
        }

        const usuariosEncontrados = await response.json();
        setUsuarios(usuariosEncontrados);
        setContadorUsuarios(usuariosEncontrados.length);
      } else {
        // Si la búsqueda está vacía, volver a cargar todos los usuarios
        consultarUsuariosPorLaboratorio(idlab);
      }
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
    }
  };

  const recargarUsuarios = () => {
    consultarUsuariosPorLaboratorio(laboratorioSeleccionado);
  };

  const mostrarMensajeModal = (mensaje, claseTexto) => {
    // Obtener el elemento del mensaje en el modal
    const mensajeModal = document.getElementById("mensajeModal");

    // Modificar el contenido y la clase del mensaje
    mensajeModal.innerText = mensaje;
    mensajeModal.className = `mx-2 ${claseTexto}`;

    // Ocultar otros elementos del modal
    const modalBody = document.querySelector(".modal-body");
    const modalFooter = document.querySelector(".modal-footer");
    modalBody.style.display = "none";
    modalFooter.style.display = "none";

    // Cerrar el modal después de 2 segundos y restaurar el contenido original
    setTimeout(() => {
      const modal = new bootstrap.Modal(
        document.getElementById("modalAgregar")
      );
      modal.hide();

      // Restaurar contenido original
      mensajeModal.innerText = "";
      mensajeModal.className = "mx-2";
      modalBody.style.display = "flex";
      modalFooter.style.display = "flex";
    }, 2000);
  };

  const handleLaboratoryChange = (selectedLab) => {
    setLaboratorioSeleccionado(selectedLab);
    consultarUsuariosPorLaboratorio(selectedLab);
  };

  //Metodo para filtrar
  /* const filtrar = (terminoBusqueda) => {
    if (!terminoBusqueda) {
      // Si el término de búsqueda está vacío, restaurar los datos originales
      setUsuarios(datosBusqueda);
      console.log(datosBusqueda);
    } else {
      // Dividir el término de búsqueda en palabras y filtrar las palabras vacías
      const palabrasBusqueda = terminoBusqueda
        .toLowerCase()
        .split(" ")
        .filter(Boolean);

      // Filtrar los resultados
      var resultadosBusqueda = datosBusqueda.filter((elemento) => {
        // Verificar si todas las palabras están presentes en el nombre
        return palabrasBusqueda.every((palabra) =>
          elemento.name.toString().toLowerCase().includes(palabra)
        );
      });

      setUsuarios(resultadosBusqueda);
    }
  };
 */
  //-----------------INIICO DE LOS HANDLER PARA LOS DATOS DE LOS USUARIOS.
  //Handlers datos creacion usuari

  const onHandleNumEmployee = (e) => {
    setNumEmployee(e.target.value);
  };

  const onHandleName = (e) => {
    setNombreUsuario(e.target.value);
  };
  const onHandleLastName = (e) => {
    setApellidos(e.target.value);
  };
  const onHandleNameUser = (e) => {
    setNombreDelUsuario(e.target.value);
  };
  const onHandlePassword = (e) => {
    setContraseña(e.target.value);
  };
  const onHandleRoleUsuario = (rolUsuario) => {
    setIdRoleSeleccionado(rolUsuario);
  };
  /* const onHandleBusqueda = (e) => {
    setBusqueda(e.target.value);
    filtrar(e.target.value);
  }; */

  const onHandleBusqueda = (e) => {
    const searchTerm = e.target.value;
    buscarUsuariosPorNombre(laboratorioSeleccionado, searchTerm);
  };
  const obtenerUsuarioSeleccionado = (user) => {
    setUsuarioSeleccionado(user);
  };
  const handleLaboratoriesChange = (event) => {
    const labId = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Si el laboratorio está marcado, lo agregamos a la lista de laboratorios seleccionados
      setLaboratoriosSeleccionados([...laboratoriosSeleccionados, labId]);
    } else {
      // Si el laboratorio está desmarcado, lo eliminamos de la lista de laboratorios seleccionados
      const nuevaLista = laboratoriosSeleccionados.filter((id) => id !== labId);
      setLaboratoriosSeleccionados(nuevaLista);
    }
  };

  //UseEffect
  useEffect(() => {
    //Hacemos la peticion al cargar la pagina
    const laboratorioPorDefecto = 1;
    // Actualizamos el estado y consultamos los servicios
    consultarUsuariosPorLaboratorio(laboratorioPorDefecto);
    // Actualizamos el estado y consultamos los servicios
    setLaboratorioSeleccionado(laboratorioSeleccionado);
    //Consultamos todos los labs
    consultarTodosLosLaboratorios();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return loading ? (
    <>
      <Loading />
    </>
  ) : (
    <>
      {/* --------------------------------------------------------------------AGREGAR MODAL*/}
      <div
        className="modal fade p-4"
        id="modalAgregar"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered p-4 ">
          <div className="modal-content modalServicio">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Agregar Nuevo Usuario:
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
              <label className="mx-2">Selecciona Los Laboratorios: </label>
              <div className="form-check ">
                <br />
                {laboratorios.map((lab, index) => (
                  <>
                    <input
                      key={lab.idLaboratory}
                      className="form-check-input"
                      type="checkbox"
                      value={lab.idLaboratory}
                      onChange={handleLaboratoriesChange}
                    />
                    <label htmlFor="">{lab.name}</label>
                    <br />
                  </>
                ))}
              </div>
              <label className="mx-2 mt-4">Numero de Empleado: </label>
              <input
                type="text"
                className="form-control mx-2 inputModal"
                placeholder="Escribe el nombre del usuario"
                onChange={(e) => onHandleNumEmployee(e)}
              />
              <label className="mx-2 mt-4">Nombre: </label>
              <input
                type="text"
                className="form-control mx-2 inputModal"
                placeholder="Escribe el nombre del usuario"
                onChange={(e) => onHandleName(e)}
              />
              <label className="mx-2 mt-4">Apellidos: </label>
              <input
                type="text"
                className="form-control mx-2 inputModal"
                placeholder="Escribe los apellidos"
                onChange={(e) => onHandleLastName(e)}
              />
              <label className="mx-2 mt-4">Nombre Del Usuario: </label>
              <input
                type="text"
                className="form-control mx-2 inputModal"
                placeholder="Escribe el nombre del usuario"
                onChange={(e) => onHandleNameUser(e)}
              />
              <label className="mx-2 mt-4">Contraseña: </label>
              <input
                type="text"
                className="form-control mx-2 inputModal"
                placeholder="Escribe la contraseña del usuario"
                onChange={(e) => onHandlePassword(e)}
              />
              <label className="mx-2 mt-4">Selecciona Un Rol</label>
              <ComboboxRol cambioRol={onHandleRoleUsuario} />
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
                onClick={agregarNuevoUsuarioAlLaboratorio}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*--------------------------------------------------------------FIN MODAL */}

      {/*----------------------------------------------------------Inicio del contenido de la pagina */}
      <div className="">
        <div className="p-4 mx-4 usuariosMainContainer h-100">
          <div className="header d-flex align-items-center">
            <AiOutlineUser className="mt-2 iconHeader" />
            <Header title="Usuarios" />
          </div>
          <hr className="border border-primary" />
          {/* Busqueda y escaneo */}
          <div className="searchBar">
            <input
              placeholder="Buscar usuario"
              className="form__field mt-4"
              onChange={onHandleBusqueda}
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

          {/* Espacio para el total de usuarios y el add button */}
          <div className="addContainer row mt-3">
            <div className="totalUsuariosiosContainer col-md-10 ">
              <p className="usuariosTotales" style={{ color: "#13B7CC" }}>
                Usuarios totales:{" "}
                <span className="text-light">{contadorUsuarios}</span>{" "}
              </p>
            </div>
            <div className="btnAddContainer col-md-2">
              <AddButton />
            </div>
          </div>
          {/* Carga de Excel para actualizar usuarios */}
          <div className="uploadExcelContainer mt-4 mb-3">
            <h5 className="d-flex align-items-center gap-2">
              Actualizar usuarios del kiosko desde Excel
              <span className="info-icon position-relative">
                ⓘ
                <div className="tooltip-image">
                  <p className="mb-2">
                    El formato del archivo debería ser el siguiente:
                  </p>
                  <img
                    src="src\assets\excel.png"
                    alt="Formato ejemplo"
                    className="img-thumbnail"
                  />
                </div>
              </span>
            </h5>

            <div className="d-flex flex-column flex-md-row align-items-start gap-2">
              <input
                type="file"
                accept=".xlsx"
                className="form-control w-auto"
                onChange={(e) => {
                  setExcelFile(e.target.files[0]);
                  setUploadMessage("");
                }}
              />
              <button
                className="btn btn-primary"
                onClick={handleExcelUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Subiendo...
                  </>
                ) : (
                  "Subir archivo"
                )}
              </button>
            </div>
            {uploadMessage && (
              <p className="mt-2 text-secondary" style={{ maxWidth: "400px" }}>
                {uploadMessage}
              </p>
            )}
          </div>

          {/* Espacio para la tabla de usuarios */}
          <div className="tableContainer mt-5 ">
            <h5>Lista de usuarios </h5>
            {/* Aqui va el componente que va lsitar a todos los usuarios*/}
            <UsuariosContainer
              usuarios={usuarios}
              usuarioEnviado={obtenerUsuarioSeleccionado}
              onRecargarUsuarios={recargarUsuarios}
            />
          </div>
          {/* Espacio para la paginacion */}
          <div className="d-flex justify-content-center align-items-center"></div>
        </div>
      </div>
    </>
  );
};

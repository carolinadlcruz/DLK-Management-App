import React, { useState, useEffect } from "react";
import { Header } from "../../globalComponents/Header";
import { Pagination } from "../../globalComponents/Pagination";
import { AddButton } from "../components/AddButton";
import { AiOutlineTool } from "react-icons/ai";
import { TablePartes } from "../components/TablePartes";
import { Loading } from "../../globalComponents/Loading";
import { PartesContainer } from "../components/PartesContainer";
import { ComboboxLines } from "../components/ComboboxLines";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";
import "../styles/PartesPage.css";

export const PartesPages = () => {
  //Hooks
  const [loading, setLoading] = useState(true);
  const [partes, setPartes] = useState();
  const [lineaSeleccionada, setLineaSeleccionada] = useState();
  const [contadorPartes, setContadorPartes] = useState();
  //Se empieza con 2 porque el id del primer registro en la bdd es 2
  const [selectedLine, setSelectedLine] = useState(2);
  const [newPartNumber, setNewPartNumber] = useState("");
  const [validatePartNumbers, setValidatePartNumbers] = useState([]);
  const [seleccionado, setSeleccionado] = useState({});
  const [datosBusqueda, setDatosBusqueda] = useState();
  const [busqueda, setBusqueda] = useState();

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = datosBusqueda.filter((elemento) => {
      if (
        elemento.partNumber
          .toString()
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setPartes(resultadosBusqueda);
  };

  //Metodos
  const consultarNumerosDePartePorLaboratorio = async (idLab) => {
    //Hacemos la peticion para traer todos los datos
    try {
      const response = await fetch(
        `http://10.239.10.175:3000/getPartNumbersByLine/${idLab}`
      );

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }

      const partes = await response.json();
      setPartes(partes);
      console.log(partes);
      setContadorPartes(partes.length);
      setDatosBusqueda(partes);
    } catch (error) {
      console.error("Error al consultar servicios:", error);
    }
  };

  const obtenerParteSeleccionada = (parte) => {
    setSeleccionado(parte);
  };

  const consultarNumerosDePartePorLaboratorioParaValidaciones = async (
    selectedLine
  ) => {
    //Hacemos la peticion para traer todos los datos
    try {
      const response = await fetch(
        `http://10.239.10.175:3000/getPartNumberByLine/${selectedLine}/${newPartNumber}`
      );

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }

      const partes = await response.json();
      setValidatePartNumbers(partes);
    } catch (error) {
      console.error("Error al consultar servicios:", error);
    }
  };
  //Handlers
  const handleLaboratoryChange = (selectedLab) => {
    setLineaSeleccionada(selectedLab);
    consultarNumerosDePartePorLaboratorio(selectedLab);
  };

  const handleLineAddPartNumber = (idLine) => {
    //Cambiamos la linea
    setSelectedLine(idLine);
  };

  //Metodo para cuando se escriba en la caja de texto de nuevo numero de parte
  const onHandleNewPartNumber = (e) => {
    setNewPartNumber(e.target.value);
  };

  const onHandleBusqueda = (e) => {
    setBusqueda(e.target.value);
    filtrar(e.target.value);
  };

  // Eliminar el número de parte
  const deletePartNumber = async (idPartNumber) => {
    try {
      // Hacemos la petición DELETE para eliminar el número de parte
      const response = await fetch(
        `http://10.239.10.175:3000/deletePartNumber/${idPartNumber}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        //Mandamos  a llamar el error de fallo
        mostrarMensajeModal(
          " Error al agregar numero de parte, intenta de nuevo",
          false
        );
        throw new Error(
          `Error al eliminar el número de parte: ${response.statusText}`
        );
      }
      //Si todo va bien , llamamos al modal de exito al crear
      mostrarMensajeModal("¡ Numero de parte eliminado con éxito !", true);
    } catch (error) {
      mostrarMensajeModal(
        "¡ Error interno del servidor al eliminar el número de parte, vuelve a intentarlo !",
        true
      );

      console.error("Error al eliminar el número de parte:", error);
    }
  };

  //Metodo para agregar un nuevo número de parte
  const addNewPartnumber = async (idLine, partNumber) => {
    //Comprueba que se haya seleccionado una linea y escrito un número de parte.
    if (newPartNumber != "") {
      //En caso de que los datos sean validos, vamos a comprobar que el número de parte no se repita en la linea
      //await consultarNumerosDePartePorLaboratorioParaValidaciones(selectedLine);
      //Llamamos a la api para crear el nuevo numero de parte
      try {
        // Datos del nuevo número de parte
        const nuevoPartNumberData = {
          idLine: selectedLine, // Reemplaza con el valor real
          partNumber: newPartNumber, // Reemplaza con el valor real
        };
        // Realizar la petición POST para agregar el nuevo número de parte
        const response = await fetch(
          "http://10.239.10.175:3000/addNewPartNumberOnLine",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoPartNumberData),
          }
        );

        // Verificar si la petición fue exitosa (código de estado 200 o 201)
        if (response.ok) {
          //alert("Agregado con exito")
          mostrarMensajeModal("¡ Numero de parte agregado con éxito !", true);
        } else {
          // En caso de un código de estado no exitoso, manejar el error
          //alert("No se pudo agregar")
          mostrarMensajeModal(
            " Error al agregar numero de parte, intenta de nuevo",
            false
          );
        }
      } catch (error) {
        mostrarMensajeModal(
          "¡ Error interno del servidor, intenta de nuevo !",
          true
        );
      }
    } else {
      // Mensaje de error
      const mensajeError = document.createElement("p");
      mensajeError.textContent = "¡Por favor, llena los campos!";
      // Aplicar estilo de color rojo al mensaje de error
      mensajeError.style.color = "red";
      // Buscar el elemento con la clase .modal-header
      const modalHeader = document.querySelector(".modal-header");
      // Insertar el mensaje de error después del elemento .modal-header
      modalHeader.insertAdjacentElement("afterend", mensajeError);
      // Eliminar el mensaje de error después de 3 segundos
      setTimeout(function () {
        mensajeError.remove();
      }, 3000); // 3000 milisegundos = 3 segundos
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

  const modificarNumeroParte = async () => {
    const cajaTexto = document.getElementById("inputEditarNumeroParte");
    //Hacemos la petición
    try {
      // Datos del nuevo servicio
      const nuevoNumeroParte = {
        idPartNumber: seleccionado.idPartNumber, // Reemplaza con el valor real
        newPartNumber: newPartNumber, // Reemplaza con el valor real
      };

      if (cajaTexto.value != "") {
        // Realizar la petición POST para agregar el nuevo servicio
        const response = await fetch(
          "http://10.239.10.175:3000/editPartNumber",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevoNumeroParte),
          }
        );

        // Verificar si la petición fue exitosa (código de estado 200 o 201)
        if (response.ok) {
          mostrarMensajeModal("Numero de parte actualizado con éxito ", true);
        } else {
          // En caso de un código de estado no exitoso, manejar el error
          mostrarMensajeModal(
            "Error al modificar el numero de parte, intenta de nuevo",
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
  };

  //UseEffect
  useEffect(() => {
    //EFecto loading
    //Hacemos la peticion al cargar la pagina
    const laboratorioPorDefecto = 2;
    // Actualizamos el estado y consultamos los servicios

    consultarNumerosDePartePorLaboratorio(laboratorioPorDefecto);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  //Useeffect para cuando se desencadena un evento para un numero de parte
  useEffect(() => {
    //Quitamos el icono de cargando
    setLineaSeleccionada(lineaSeleccionada);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [partes]);

  return loading ? (
    <>
      <Loading />
    </>
  ) : (
    <>
      {/*-----------------------------INICIO MODAL ELIMINAR*/}

      <div
        className="modal fade  p-4"
        id="exampleModalEliminar"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered p-4 ">
          <div className="modal-content ">
            <div className="modal-header">
              <h5 className="modal-title text-dark" id="exampleModalLabel">
                Eliminación de número de parte
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
              <p className="text-dark">
                ¿Estás seguro que quieres eliminar el número de parte
                seleccionado? Todas las solicitudes adjuntas se eliminarán ,
                junto a toda la información relacionada con este.
                <br />
                Número de parte a eliminar :
                <span className="fw-bold"> {seleccionado.partNumber}</span>
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
                className="btn btn-success btnModificarServicio"
                onClick={() => deletePartNumber(seleccionado.idPartNumber)}
                data-bs-toggle="modal"
                data-bs-target="#modalExitoSalidaPieza"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*----------------------------FIN MODAL ELIMINAR*/}
      {/*---------------------------INICIO MODAL EDITAR */}
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
                Modificación de numero de parte
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
                Numero de parte actual :{" "}
              </label>
              <input
                type="text"
                className="form-control mx-2  "
                disabled
                value={seleccionado.partNumber}
              />

              <label className="mx-2 mt-4 text-dark">
                Nuevo numero de parte :{" "}
              </label>
              <input
                id="inputEditarNumeroParte"
                type="text"
                className="form-control mx-2 "
                placeholder="Escribe el nuevo numero de parte"
                onChange={(e) => onHandleNewPartNumber(e)}
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
                onClick={modificarNumeroParte}
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
                //Reiniciamos la pagina
                onClick={() => {
                  //La recargamos
                  window.location.reload();
                }}
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*------------------FIN MODAL EXITO */}

      {/*------------------------------------------INICIO MODAL AGREGAR */}
      <div
        className="modal fade  p-4"
        id="exampleModalPartNumbers"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered p-4 ">
          <div className="modal-content modalServicio">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Agregar nuevo número de parte.
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
              <label className="mx-2">Línea : </label>
              <ComboboxLines
                title={"Laboratorios"}
                onLineChange={handleLineAddPartNumber}
              />
              <label className="mx-2 mt-4">Numero de parte : </label>
              <input
                type="text"
                className="form-control mx-2 inputModal"
                placeholder="Escribe el numero de parte"
                onChange={(e) => onHandleNewPartNumber(e)}
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
                onClick={addNewPartnumber}
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
      <div className="animate__animated  animate__fadeInRight">
        {/*Espacio divisor entre el el sidebar */}
        {/*Este el contenedor principal del contenido de la pagina */}
        <div className="p-5 mx-4 parteMainContainer h-100">
          <div className="header d-flex align-items-center">
            <AiOutlineTool className="mt-2 iconHeader" />
            <Header title="Partes" />
          </div>
          <hr className="border border-primary" />
          {/*Busqueda y escaneo*/}
          <div className="searchBar ">
            <input
              placeholder="Buscar numero de parte"
              className="form__field2 mt-4"
              onChange={(e) => onHandleBusqueda(e)}
            />
            <i className="search-icon fa-solid fa-magnifying-glass"></i>
          </div>
          <br />

          {/*Contenedor para los combobox */}
          <div className="comboboxContainer row">
            <ComboboxLines
              title={"Lineas"}
              onLineChange={handleLaboratoryChange}
            />
          </div>

          {/*Espacio para el total de numerosd e parte y el add button */}
          <div className="addContainer row mt-3">
            <div className="totalServiciosContainer col-md-9 ">
              <p className="serviciosTotales">
                Número de parte totales :{" "}
                <span className="text-light"> {contadorPartes} </span>{" "}
              </p>
            </div>
            <div className="btnAddContainer col-md-2">
              <AddButton />
            </div>
          </div>
          {/*Espacio para la tabla de servicios */}
          <div className="tableContainer mt-5 ">
            <TablePartes />
            <PartesContainer
              partes={partes}
              parteSeleccionada={obtenerParteSeleccionada}
            />
          </div>
          {/*Espacio para la paginacion  */}
          <div className="d-flex justify-content-center align-items-center">
            <Pagination />
          </div>
        </div>
      </div>
    </>
  );
};

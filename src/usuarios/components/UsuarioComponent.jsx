import React, { useContext, useEffect, useState } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import "../styles/UsuarioComponent.css";
import { AuthContext } from "../../auth/context/AuthContext";
import { FaEdit } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { ComboboxRol } from "../components/ComboboxRol";
//Importamos imagen de prueba
import photoPicture from "../../assets/Edgar.png";

export const UsuarioComponent = ({
  usuario,
  seleccionUsuario,
  onRecargarUsuarios,
}) => {
  //hooks
  const [usuarioCargado, setUsuarioCargado] = useState({});
  const [laboratoriosDeUsuario, setLaboratoriosDeUsuario] = useState([]);
  //Hooks para la creación de usuarios
  const [apellidos, setApellidos] = useState();
  const [nombreDelUsuario, setNombreDelUsuario] = useState();
  const [nombreUsuario, setNombreUsuario] = useState();
  const [contraseña, setContraseña] = useState();
  const [laboratorios, setLaboratorios] = useState([]);
  const [laboratoriosSeleccionados, setLaboratoriosSeleccionados] = useState(
    []
  );
  const mostrarDatos = () => {
    console.log("USUARIO : " + usuarioCargado.name);
    setUsuarioCargado(usuario);
    //Mandamos al componente padre
    onSeleccionUsuario(usuario);
  };
  const { user } = useContext(AuthContext);
  const [idRoleSeleccionado, setIdRoleSeleccionado] = useState(2);

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

  //Método para obtener los laboratorio de un usuario
  const cargarLaboratoriosDeUsuarios = async () => {
    //Vamos a hacer la petición para cargar los laboratorios de los
    console.log(usuario.idUser);
    try {
      const response = await fetch(
        `http://10.239.10.175:3000/getLaboratoriesOfuser/${usuario.idUser}`
      );

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }

      const usuarios = await response.json();
      setLaboratoriosDeUsuario(() => usuarios);
      console.log(usuarios);
    } catch (error) {
      console.error("Error al consultar los laboratorios del usuario:", error);
    }
  };

  //Metodo para eliminar usuario
  const eliminarUsuario = async () => {
    try {
      const response = await fetch(
        "http://10.239.10.175:3000/deleteUser/" + usuario.idUser,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Usuario eliminado exitosamente");

        // ✅ Llamar al padre para recargar
        onRecargarUsuarios();
      } else {
        throw new Error(`Error al eliminar el usuario: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error.message);
      const mensajeError = document.querySelector(".mensajeError");
      mensajeError.textContent =
        "Error al eliminar el usuario: " + error.message;
    }
  };

  //Método para editar un usuario en el laboratorio
  const editarUsuarioEnLaboratorio = async (idUser) => {
    try {
      // Datos del usuario a actualizar, incluyendo idUser
      const editarUsuario = {
        idUser: usuario.idUser, // Asegúrate de que idUser tenga el valor correcto
        idRole: idRoleSeleccionado,
        name: nombreUsuario,
        lastName: apellidos,
        username: nombreDelUsuario,
        password: contraseña,
        laboratorios: laboratoriosSeleccionados,
      };

      // Realizar la petición POST para actualizar el usuario
      const response = await fetch(
        "http://10.239.10.175:3000/updateUserByLab/" + usuario.idUser,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editarUsuario),
        }
      );

      // Verificar si la petición fue exitosa (código de estado 200)
      if (response.ok) {
        console.log("Usuario actualizado correctamente");
        mostrarMensajeModal(
          "Usuario actualizado correctamente",
          "text-success"
        );

        // Ocultar el modal
        const modal = new bootstrap.Modal(
          document.getElementById("exampleModal")
        );
        modal.hide();
      } else {
        throw new Error(
          `Error al actualizar el usuario: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error.message);
      mostrarMensajeModal("Error al actualizar el usuario", "text-danger");
    }
  };

  //Handlers
  const onSeleccionUsuario = (usuarioEnviado) => {
    seleccionUsuario(usuarioEnviado);
    alert("seleccionado : " + usuarioEnviado.pictureUrl);
  };
  //Handlers edicion usuario
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

  //UseEFFECT
  useEffect(() => {
    setUsuarioCargado(usuario);
    //Cargamos los laboratorios del usuario
    cargarLaboratoriosDeUsuarios();
    //Consultamos todos los labs
    consultarTodosLosLaboratorios();
  }, []);

  return (
    <>
      {/*--------------------------MODAL ELIMINACION DE USUARIO */}
      <div
        className="modal fade"
        id={"modalEliminacion" + usuario.idUser}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-dark">Eliminación de Usuario</h5>
              <button
                type="button"
                className="btn-close "
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="text-dark">
                ¿Estás seguro que quieres eliminar el Usuario <br />
                <b>{usuario.name + " " + usuario.lastName}</b>
              </p>
              <p className="text-dark">
                Toma en cuenta que se eliminará de todos los laboratorios en los
                que está asociado.
              </p>
              <p className="text-dark">
                Además, si participó en la realización de alguna solicitud, se
                eliminará su participación en esta.
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
                className="btn btn-danger"
                onClick={eliminarUsuario}
                data-bs-toggle="modal"
                data-bs-target="#modalEliminacionExito"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*--------------------------FIN MODAL ELIMINACIÓN DE USUARIO */}

      {/*-------------------------------MODAL EXITO AL ELIMINAR */}
      <div
        className="modal fade"
        id="modalEliminacionExito"
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
            <div className="modal-body d-flex justify-content-between align-items-center flex-column">
              <FaCheckCircle className="w-25 h-25" color="green" />
              <br />
              <p className="text-dark text-center messageExitoModal">
                Usuario eliminado con éxito!
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-success"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
                data-bs-dismiss="modal"
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*---------------------------FIN DE MODAL EXITO AL ELIMINAR */}

      {/* --------------------------------------------------------------------EDITAR MODAL*/}
      <div
        className="modal fade p-4"
        id={"modalEditar" + usuario.idUser}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered p-4 ">
          <div className="modal-content modalServicio">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Editar Usuario:
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
              <label className="mx-2">Selecciona Los Laboratorios : </label>
              <div className="form-check ">
                <br />
                {laboratorios.map((lab) => (
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
              <label className="mx-2 mt-4">Nombre: </label>
              <input
                type="text"
                className="form-control mx-2 inputModal"
                placeholder="Escribe el nombre del usuario"
                value={usuario.name}
                onChange={(e) => onHandleName(e)}
              />
              <label className="mx-2 mt-4">Apellidos: </label>
              <input
                type="text"
                className="form-control mx-2 inputModal"
                placeholder="Escribe los apellidos"
                value={usuario.lastName}
                onChange={(e) => onHandleLastName(e)}
              />
              <label className="mx-2 mt-4">Nombre Del Usuario: </label>
              <input
                type="text"
                className="form-control mx-2 inputModal"
                placeholder="Escribe el nombre del usuario"
                value={usuario.username}
                onChange={(e) => onHandleNameUser(e)}
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
                onClick={editarUsuarioEnLaboratorio}
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*--------------------------------------------------------------FIN MODAL EDITAR*/}

      <div className="containerUsuario row d-flex justify-content-center align-items-center">
        <div className="containerIcon col-1 d-flex justify-content-center align-items-center">
          <img
            src={"src\\assets\\" + usuario.pictureUrl + ""}
            alt="Imagen de usuario"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="containerItem col-4 align-items-center">
          <h6 className="m-0">
            {usuario.name} {usuario.lastName}{" "}
            {user.idUser == usuario.idUser ? " (Tú) " : ""}
          </h6>
        </div>

        <div className="containerItem col-4 align-items-center">
          <h6 style={{ color: "#13B7CC" }}>Laboratorios:</h6>
          {usuario.laboratories.map((laboratorio, index) => (
            <span key={index}>
              {laboratorio.name}
              {index === laboratoriosDeUsuario.length - 1 ? "." : ", "}
            </span>
          ))}
        </div>

        <div className="containerDelete col-1 d-flex justify-content-around align-items-center ">
          {/*---------------------------Boton Editar Usuario */}
          <button
            className="navbar-toggler ml-auto"
            type="button"
            data-bs-toggle="modal"
            data-bs-target={"#modalEditar" + usuario.idUser}
            onClick={mostrarDatos}
          >
            <FaEdit color="yellow" />
          </button>
          {/*---------------------------Boton Eliminar Usuario */}
          {user.idUser != usuario.idUser ? (
            <button
              className="btnEliminar ml-auto"
              data-bs-toggle="modal"
              data-bs-target={"#modalEliminacion" + usuario.idUser}
            >
              <RiDeleteBin5Fill />
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

import React, { useContext, useState } from "react";
import loginImage from "../../assets/zflogin.jpg";
import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import { ParticlesBackground } from "../../globalComponents/ParticlesBackground";
import imagenLogin from "../../assets/loginImage.jpg";
import loginNew from "../../assets/loginNew.jpg";
export const LoginPage = () => {
  const { login } = useContext(AuthContext);
  //Hooks
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [usuario, setUsuario] = useState();
  //Handles
  const onHandleUsername = (e) => {
    setUsername(e.target.value);
  };
  const onHandlePass = (e) => {
    setPassword(e.target.value);
  };
  //Metodos
  const onLogin = async () => {
    //TODO: VALIDAR
    //Hacemos la peticion
    //Hacemos la peticion para traer todos los datos
    //Metemos todo en un try catch para el manejador de errores

    try {
      const response = await fetch(
        `http://10.239.10.175:3000/loginUser/${username}/${password}`
      );

      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);

        //TODO: Alertar
        //Cambiar de página.
      } else {
        //En caso de que la respuesta sea positiva
        const usuario = await response.json();
        setUsuario(usuario);
        //Navegamos
        await login(usuario[0]);
        navigate("/solicitudes");
      }
    } catch (error) {
      // TODO: Alertar al usuario que no se pudo acceder
      var nombreInput = document.getElementById("passInput");
      var nombre = nombreInput.value;

      // Crear el elemento <p> para el mensaje de error
      var mensajeError = document.createElement("p");
      mensajeError.innerHTML = "Usuario o contraseña no válidos.";
      mensajeError.style.color = "red"; // Puedes personalizar el estilo según tus necesidades

      // Insertar el mensaje de error después del input
      nombreInput.parentNode.insertBefore(
        mensajeError,
        nombreInput.nextSibling
      );
      //Deshabilitamos el botón
      document.querySelector(".btnLogin").disabled = true;
      // Eliminar el mensaje de error después de 3 segundos
      setTimeout(function () {
        mensajeError.remove();
        // Habilitamos el botón
        document.querySelector(".btnLogin").disabled = false;
      }, 3000); // 3000 milisegundos = 3 segundos
    }
  };
  //UseEffect

  return (
    <div className="container-fluid ps-md-0 bg-light loginPage">
      <div className="row g-0">
        <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
        <div className="col-md-8 col-lg-6 bg-light formDiv">
          <div className="login d-flex align-items-center py-5">
            <div className="container">
              <div className="row">
                <div className="col-md-9 col-lg-8 mx-auto">
                  <h2 className="login-heading mb-4 text-dark fw-bold">
                    Bienvenido de vuelta!
                  </h2>

                  <form>
                    <div className="form-floating mb-3 text-dark">
                      <p className="fw-bold">Usuario</p>
                      <input
                        type="text"
                        className=" loginInput"
                        id="floatingInput"
                        placeholder="Usuario"
                        onChange={onHandleUsername}
                      />
                    </div>
                    <div className="form-floating mb-3 text-dark">
                      <p className="fw-bold">Contraseña</p>
                      <input
                        type="password"
                        className=" loginInput"
                        id="floatingPassword"
                        placeholder="Contraseña"
                        onChange={onHandlePass}
                      />
                    </div>

                    <div className="d-grid">
                      <button
                        className="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2"
                        type="button"
                        onClick={onLogin}
                      >
                        Iniciar sesión
                      </button>
                      <div className="text-center">
                        <a className="small" href="#">
                          Forgot password?
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

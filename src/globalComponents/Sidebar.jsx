import zfwhiteicon from "../assets/zf-logo_white.png";
import photo from "../assets/User.png";
import { NavLink, useNavigate } from "react-router-dom";
import { FaRegQuestionCircle } from "react-icons/fa";
import { IoIosPaper } from "react-icons/io";
import { HiBellAlert } from "react-icons/hi2";
import { IoAppsSharp } from "react-icons/io5";
import { FaGears } from "react-icons/fa6";
import { BsPersonFillGear } from "react-icons/bs";
import { useContext } from "react";
import { AuthContext } from "../auth/context/AuthContext";
import { ImExit } from "react-icons/im";
import sidebarIcon from "../assets/loginSidebar.png";
import { FaFilePdf } from "react-icons/fa6";
import { AiFillAlert } from "react-icons/ai";

import "../globalStyles/Sidebar.css";
import { GrDashboard } from "react-icons/gr";
export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const onLogout = () => {
    logout();
    navigate("/auth/login", {
      replace: true,
    });
  };
  return user.idRole == 1 ? (
    <>
      <div className="h-100 col-3" style={{ width: "280px" }}></div>
      <div
        className="d-flex flex-column flex-shrink-0 p-3  bg-dark h-100 Sidebar"
        style={{ width: "240px" }}
      >
        <a
          href="/"
          className=" d-flex align-items-center justify-content-center text-white text-decoration-none "
        >
          <img src={sidebarIcon} alt="" className=" w-100 h-100" />
        </a>
        <hr className="salto" />
        <ul className="nav nav-pills h-100 d-flex flex-column justify-content-between align-items-start">
          <li className="nav-item w-100 d-flex justify-content-center align-items-center flex-column">
            <NavLink
              to={"/usuarios"}
              //Solicitudes
              className=" d-flex align-items-center justify-content-center "
            >
              <div className="text-white d-flex justify-content-center align-items-center flex-column imageDiv w-100">
                <div className="background"></div>
                <img
                  src={"src\\assets\\" + user.pictureUrl + ""}
                  alt=""
                  className="profileImage w-75 h-75 d-flex align-items-center justify-content-center  "
                />
              </div>
            </NavLink>
            <p className="nameTitle text-center text-light">
              {" "}
              {user?.name} {user?.lastName} <br /> (
              {user.idRole == 2 ? "Técnico" : "Admin"})
            </p>
          </li>

          <li className="nav-item w-100">
            <NavLink to={"/solicitudes"} className="nav-link">
              <div className="text-white d-flex justify-content-start align-items-center">
                <svg className="bi me-2" width="16" height="16">
                  <IoIosPaper />
                </svg>
                Solicitudes
              </div>
            </NavLink>
          </li>
          <li className="nav-item w-100">
            <NavLink to={"/reportes"} className="nav-link">
              <div className="text-white">
                <svg className="bi me-2" width="16" height="16">
                  <FaFilePdf />
                </svg>
                Reportes
              </div>
            </NavLink>
          </li>

          <li className="nav-item w-100">
            <NavLink to={"/servicios"} className="nav-link">
              <div className="text-white d-flex justify-content-start align-items-center">
                <svg className="bi me-2" width="16" height="16">
                  <IoAppsSharp />
                </svg>
                Servicios
              </div>
            </NavLink>
          </li>
          <li className="nav-item w-100">
            <NavLink to={"/partes"} className="nav-link">
              <div className="text-white d-flex justify-content-start align-items-center">
                <svg className="bi me-2" width="16" height="16">
                  <FaGears />
                </svg>
                Números de parte
              </div>
            </NavLink>
          </li>
          <li className="nav-item w-100">
            <NavLink to={"/prioridades"} className="nav-link">
              <div className="text-white d-flex justify-content-start align-items-center">
                <svg className="bi me-2" width="16" height="16">
                  <AiFillAlert />
                </svg>
                Prioridades
              </div>
            </NavLink>
          </li>
          <li className="nav-item w-100">
            <NavLink to={"/usuarios"} className="nav-link">
              <div className="text-white">
                <svg className="bi me-2" width="16" height="16">
                  <BsPersonFillGear />
                </svg>
                Usuarios
              </div>
            </NavLink>
          </li>
          <div className="h-25 bg-danger"></div>
        </ul>
        <div className="mt-auto w-100">
          <button
            onClick={onLogout}
            className="btn btn-link text-danger w-100 d-flex align-items-center"
            style={{ textDecoration: "none" }}
          >
            <ImExit className="me-2" />
            Cerrar sesión
          </button>
        </div>

        {/* 
      <div className="dropdown">
        <a
          href="#"
          className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          id="dropdownUser1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            alt=""
            width="32"
            height="32"
            className="rounded-circle me-2"
            src={photo}
          />
          <strong>
            {user?.name} {user?.lastName} (
            {user.idRole == 2 ? "Técnico" : "Admin"})
          </strong>
        </a>
        <ul
          className="dropdown-menu dropdown-menu-dark text-small shadow"
          aria-labelledby="dropdownUser1"
        >
          <li>
            <a className="dropdown-item" href="#">
              Opciones
            </a>
          </li>

          <li>
            <hr className="dropdown-divider" />
          </li>
          <li onClick={onLogout}>
            <button className="dropdown-item">Cerrar sesión</button>
          </li>
        </ul>
      </div>*/}
      </div>
    </>
  ) : (
    <>
      <div
        className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark h-100"
        style={{ width: "280px" }}
      >
        <a
          href="/"
          className="text-white d-flex justify-content-center align-items-center flex-column imageDiv w-100"
        >
          <img
            src={zfwhiteicon}
            alt=""
            className="w-75 h-75 d-flex align-items-center justify-content-center  "
          />
        </a>
        <hr />
        <div className="text-white d-flex justify-content-center align-items-center flex-column imageDiv w-100">
          <div className="background"></div>
          <img
            src={"src\\assets\\" + user.pictureUrl + ""}
            alt=""
            className="profileImage w-75 h-75 d-flex align-items-center justify-content-center  "
          />
        </div>

        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <strong>
              {user?.name} {user?.lastName}
            </strong>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-dark text-small shadow"
            aria-labelledby="dropdownUser1"
          >
            {/*   <li>
              <a className="dropdown-item" href="#">
                Opciones
              </a>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li> */}
            <li>
              <button className="dropdown-item" onClick={onLogout}>
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
        <hr />

        <ul className="nav nav-pills h-100 d-flex flex-column justify-content-around align-items-start">
          <li className="nav-item w-100">
            <NavLink to={"/solicitudes"} className="nav-link">
              <div className="text-white d-flex justify-content-start align-items-center">
                <svg className="bi me-2" width="16" height="16">
                  <IoIosPaper />
                </svg>
                Solicitudes
              </div>
            </NavLink>
          </li>
          <li className="nav-item w-100">
            <NavLink to={"/reportes"} className="nav-link">
              <div className="text-white">
                <svg className="bi me-2" width="16" height="16">
                  <FaFilePdf />
                </svg>
                Reportes
              </div>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

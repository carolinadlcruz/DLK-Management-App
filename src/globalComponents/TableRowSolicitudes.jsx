import React from "react";
import { FaEye } from "react-icons/fa";
import "./TableRowSolicitudes.css";
import { NavLink } from "react-router-dom";

export const TableRowSolicitudes = ({
  folio,
  numParte,
  parte,
  cantidad,
  departamento,
  servicios,
  hora,
  codigo,
  estado,
}) => {
  return (
    <div
      className="filaTable row  d-flex align-items-center 
justify-content-center"
    >
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{folio}</p>
      </div>
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{numParte}</p>
      </div>
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{parte}</p>
      </div>
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{cantidad}</p>
      </div>
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{departamento}</p>
      </div>
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{servicios}</p>
      </div>
      {/*Fecha */}
      
      {/*Hora */}
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{hora}</p>
      </div>
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{codigo}</p>
      </div>
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{estado}</p>
      </div>
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <NavLink to={"solicitudSeleccionada"}>
          <button className="btnView ">
            <FaEye />
          </button>
        </NavLink>
      </div>
    </div>
  );
};

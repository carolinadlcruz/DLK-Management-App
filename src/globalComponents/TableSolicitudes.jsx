import React from "react";
import "../globalStyles/TableSolicitudes.scss";
import { FaEye } from "react-icons/fa";
//Componentes importados
import { TableRowSolicitudes } from "./TableRowSolicitudes";

export const TableSolicitudes = () => {
  return (
    <div className="tableContainer p-1">
      <div className="tableHeader row">
        {/*Encabezados de la tabla */}
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center"></div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
          <p>Código</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
          <p>Folio</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
          <p>Parte</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
          <p>Cantidad</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
          <p>Línea</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
          <p>Fecha</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
          <p>Hora</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
          <p>Estado</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
          <p>Ver</p>
        </div>
      </div>
      <hr
        style={{ backgroundColor: "#13B7CC", height: "2px", border: "none" }}
      />
    </div>
  );
};

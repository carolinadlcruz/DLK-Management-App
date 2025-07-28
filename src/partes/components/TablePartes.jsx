import React, { useEffect } from "react";
import { FaFilePdf } from "react-icons/fa6";
import "../styles/TablePartes.scss";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Fill } from "react-icons/ri";
//Importamos las row de las tablas
import { RowTablePartes } from "./RowTablePartes";
//Siguientes importaciones
import "../styles/TablePartes.scss";
// Importa tu archivo pintarRows.js aquí
import "../scripts/pintarRows.js";
export const TablePartes = () => {
  return (
    <div className="tableContainer">
      <div className="tableHeader row">
        {/*Encabezados de la tabla */}
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
          <p>Número parte</p>
        </div>

        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
          <p>Línea</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
          <p>Editar</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
          <p>Eliminar</p>
        </div>
      </div>
      <div className="tableBody ">
        {/**
         
         <RowTablePartes className="rowTabla text-light" numParte={"20051223"} parte={"Bomba"} modelo={"XYZ-123"} departamento={"Línea 7"} operacion={"20"} />
         <RowTablePartes className="rowTabla" numParte={"20051223"} parte={"Bomba"} modelo={"XYZ-123"} departamento={"Línea 7"} operacion={"20"} />
         <RowTablePartes className="rowTabla" numParte={"20051223"} parte={"Bomba"} modelo={"XYZ-123"} departamento={"Línea 7"} operacion={"20"} />
         <RowTablePartes className="rowTabla" numParte={"20051223"} parte={"Bomba"} modelo={"XYZ-123"} departamento={"Línea 7"} operacion={"20"} />
         <RowTablePartes className="rowTabla" numParte={"20051223"} parte={"Bomba"} modelo={"XYZ-123"} departamento={"Línea 7"} operacion={"20"} />
         <RowTablePartes className="rowTabla" numParte={"20051223"} parte={"Bomba"} modelo={"XYZ-123"} departamento={"Línea 7"} operacion={"20"} />
         <RowTablePartes className="rowTabla" numParte={"20051223"} parte={"Bomba"} modelo={"XYZ-123"} departamento={"Línea 7"} operacion={"20"} />
         <RowTablePartes className="rowTabla" numParte={"20051223"} parte={"Bomba"} modelo={"XYZ-123"} departamento={"Línea 7"} operacion={"20"} />
         <RowTablePartes className="rowTabla" numParte={"20051223"} parte={"Bomba"} modelo={"XYZ-123"} departamento={"Línea 7"} operacion={"20"} />
         <RowTablePartes className="rowTabla" numParte={"20051223"} parte={"Bomba"} modelo={"XYZ-123"} departamento={"Línea 7"} operacion={"20"} />
         <RowTablePartes className="rowTabla" numParte={"20051223"} parte={"Bomba"} modelo={"XYZ-123"} departamento={"Línea 7"} operacion={"20"} />
         <RowTablePartes className="rowTabla" numParte={"20051223"} parte={"Bomba"} modelo={"XYZ-123"} departamento={"Línea 7"} operacion={"20"} />
         <RowTablePartes className="rowTabla" numParte={"20051223"} parte={"Bomba"} modelo={"XYZ-123"} departamento={"Línea 7"} operacion={"20"} />

         */}
      </div>
    </div>
  );
};

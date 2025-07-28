import React from 'react'
import { FaFilePdf } from "react-icons/fa6";
import '../styles/ReportesTable.scss'
export const ReportesTable = () => {
  return (
    <div className="tableContainer">
    <div className="tableHeader row">
        {/*Encabezados de la tabla */}
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
            <p>Folio</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
            <p>Número parte</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
            <p>Parte</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
            <p>Cantidad</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
            <p>Departamento</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
            <p>Servicios</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
            <p>Hora</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
            <p>Técnico (s)</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
            <p>Solicitante</p>
        </div>
        <div className="encabezadoTablaItem col-md  d-flex align-items-center justify-content-center">
            <p>Archivo</p>
        </div>
    </div>
    <div className="tableBody">
        <div className="filaTable row  d-flex align-items-center
        justify-content-center">
            <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
                <p>200512</p>
            </div>
            <div className="itemTabla col-md  d-flex align-items-center justify-content-center" >
                <p>709123</p>
            </div>
            <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
                <p>Bomba xD</p>
            </div>
            <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
                <p>2</p>
            </div>
            <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
                <p>Línea 7</p>
            </div>
            <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
                <p>3</p>
            </div>
            <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
                <p>10:20</p>
            </div>
            <div className="itemTabla col-md  d-flex align-items-center justify-content-center" >
                <p>Antonio Aquino</p>
            </div>
            <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
                <p>Alan Alberto</p>
            </div>
            <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
               <button className="btnView ">
                <FaFilePdf/>
               </button>
            </div>
        </div>
        <div className="filaTable row d-flex align-items-center justify-content-center">
            <div className="itemTabla col-md d-flex align-items-center justify-content-center">
                <p>200512</p>
            </div>
            <div className="itemTabla col-md d-flex align-items-center justify-content-center">
                <p>709123</p>
            </div>
            <div className="itemTabla col-md d-flex align-items-center justify-content-center" >
                <p>Bomba xD</p>
            </div>
            <div className="itemTabla col-md d-flex align-items-center justify-content-center">
                <p>2</p>
            </div>
            <div className="itemTabla col-md d-flex align-items-center justify-content-center">
                <p>Línea 7</p>
            </div>
            <div className="itemTabla col-md d-flex align-items-center justify-content-center">
                <p>3</p>
            </div>
            <div className="itemTabla col-md d-flex align-items-center justify-content-center">
                <p>10:20</p>
            </div>
            <div className="itemTabla col-md d-flex align-items-center justify-content-center">
                <p>Antonio Aquino</p>
            </div>
            <div className="itemTabla col-md d-flex align-items-center justify-content-center">
                <p>Alan Alberto</p>
            </div>
            <div className="itemTabla col-md d-flex align-items-center justify-content-center">
               <button className="btnView ">
                <FaFilePdf/>
               </button>
            </div>
        </div>
    </div>
</div>
  )
}

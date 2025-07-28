import React from "react";
import "../styles/TablePartes.scss";
import { CiEdit } from "react-icons/ci";
import "../styles/RowTable.css";
import { RiDeleteBin6Fill } from "react-icons/ri";
export const RowTablePartes = ({
  numParte,
  parte,
  modelo,
  departamento,
  operacion,
}) => {
  {
    /*Componente que funciona como row del componente TablePartes */
  }
  return (
    <div
      className="filaTable row  d-flex align-items-center
  justify-content-center"
    >
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{numParte}</p>
      </div>
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{parte}</p>
      </div>
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{modelo}</p>
      </div>
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{departamento}</p>
      </div>
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <p>{operacion}</p>
      </div>

      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <button className="btnEdit ">
          <CiEdit className="editIcon" />
        </button>
      </div>
      <div className="itemTabla col-md  d-flex align-items-center justify-content-center">
        <button className="btnDelete ">
          <RiDeleteBin6Fill className="deleteIcon" />
        </button>
      </div>
    </div>
  );
};

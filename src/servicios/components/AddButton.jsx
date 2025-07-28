import React from "react";
import "../styles/AddButton.css";
import { IoIosAddCircleOutline } from "react-icons/io";

export const AddButton = () => {
  return (
    <div className="col-2">
      <button
        className="addButton w-100 d-flex justify-content-center align-items-center"
        data-bs-toggle="modal"
        data-bs-target="#modalAgregar"
      >
        <span className="me-2">Agregar</span>
        <IoIosAddCircleOutline size={20} />
      </button>
    </div>
  );
};

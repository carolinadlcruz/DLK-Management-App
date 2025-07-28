import React from "react";
import { AiOutlineBarcode } from "react-icons/ai";
import "../styles/AddButton.css";
import { FaSearch } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
export const AddButton = () => {
  return (
    <div className="col-2">
      <button
        className="addButton d-flex justify-content-center align-items-center"
        data-bs-toggle="modal"
        data-bs-target="#exampleModalPartNumbers"
      >
        <div>
          <div className="p-1 d-flex justify-content-around align-items-center">
            <i className="mx-4">Agregar </i>
            <IoIosAddCircleOutline />
          </div>
        </div>
      </button>
    </div>
  );
};

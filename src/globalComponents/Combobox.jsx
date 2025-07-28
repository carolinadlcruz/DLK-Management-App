import React, { useState, useEffect, useContext } from "react";
import "../globalStyles/Combobox.css";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../auth/context/AuthContext";

export const Combobox = ({ title, items, onLaboratoryChange }) => {
  const { user } = useContext(AuthContext);
  const [laboratorios, setLaboratorios] = useState([]);

  const consultarLaboratorios = async () => {
    try {
      const response = await fetch(
        "http://10.239.10.175:3000/getLabsByUser/" + user.idUser
      );
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }

      const labs = await response.json();
      setLaboratorios(labs);
    } catch (error) {
      console.error("Error al consultar laboratorios:", error);
    }
  };

  useEffect(() => {
    consultarLaboratorios();
  }, []);

  const onLocalLaboratoryChange = (e) => {
    const selectedValue = e.target.value;
    onLaboratoryChange(selectedValue);
  };

  return (
    <div className="select col-md-3 m-1">
      <select onChange={onLocalLaboratoryChange} className="dropDownCombobox">
        {laboratorios.map((laboratorio) => (
          <option
            key={laboratorio.idLaboratory}
            value={laboratorio.idLaboratory}
          >
            {laboratorio.name}
          </option>
        ))}
      </select>
    </div>
  );
};

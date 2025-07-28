import React, { useState, useEffect, useContext } from "react";
import "../../globalStyles/Combobox.css";

export const ComboboxLines = ({ title, items, onLineChange }) => {
  const [lines, setLines] = useState([]);

  const consultarLineas = async () => {
    try {
      const response = await fetch("http://10.239.10.175:3000/getAllLines");
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }

      const labs = await response.json();
      setLines(labs);
    } catch (error) {
      console.error("Error al consultar laboratorios:", error);
    }
  };

  useEffect(() => {
    consultarLineas();
  }, []);

  const onLocalLaboratoryChange = (e) => {
    const selectedValue = e.target.value;
    onLineChange(selectedValue);
  };

  return (
    <div className="select col-md-3 m-1">
      <select onChange={onLocalLaboratoryChange}>
        {lines.map((line) => (
          <option key={line.idLine} value={line.idLine}>
            {line.line}
          </option>
        ))}
      </select>
    </div>
  );
};

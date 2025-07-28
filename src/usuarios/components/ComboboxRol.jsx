import React, { useState, useEffect } from "react";
import "../styles/Combobox.css";
import { useSearchParams } from "react-router-dom";

export const ComboboxRol = ({ title, items, cambioRol }) => {
  const [roles, setRoles] = useState([
    {
      idRole: 2,
      Rol: "Técnico",
    },
    {
      idRole: 1,
      Rol: "Administrador",
    },
  ]);
  
  const onRoleChange = (e) => {
    const selectedValue = e.target.value;
    cambioRol(selectedValue);
  };

  return (
    <div className="select col-md-3 m-1">
      <select onChange={onRoleChange}>
        {roles.map((rol) => (
          <option key={rol.idRole} value={rol.idRole}>
            {rol.Rol}
          </option>
        ))}
      </select>
    </div>
  );
};

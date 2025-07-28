import React from "react";
import { FaFilter } from "react-icons/fa";
import '../globalStyles/ButtonFilter.css'
export const ButtonFilter = () => {
  return (
    <div className="col-2">
      <button className="btnFilter">
        <div className="inline-flex items-center space-x-2">
          <div>
            {" "}
            <FaFilter /> 
          </div>
        </div>
      </button>
    </div>
  );
};

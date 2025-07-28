import React from 'react'
import '../styles/SearchButton.css'
import { FaSearch } from "react-icons/fa";
export const SearchButton = () => {
  return (
    <div className="col-2">
    <button className="btnSearch">
      <div className="d-flex justify-content-center align-items-center">
        <div >
          <FaSearch />
          <i>Buscar</i>
        </div>
      </div>
    </button>
  </div>
  )
}

import React from "react";
import { SearchButton } from "./SearchButton";
export const Searchbox = ({ placeholder }) => {
  return (
    <>
      <div className="d-flex row">
        <input
          className="searchbox col-2"
          type="search"
          placeholder={placeholder}
          aria-label="Search"
        />
        <SearchButton />
      </div>
    </>
  );
};

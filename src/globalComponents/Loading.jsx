import React from "react";
import zfLogo from "../assets/ZFRGB.png";
import "../globalStyles/Loading.css";
export const Loading = () => {
  return (
    <div className="container">
      <div className="d-flex  justify-content-center align-items-center flex-column min-vh-100">
        <img src={zfLogo} alt="" className="h-25 w-25   " />
        <hr />
        <h3>
          <span>C</span>
          <span>a</span>
          <span>r</span>
          <span>g</span>
          <span>a</span>
          <span>n</span>
          <span>d</span>
          <span>o</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </h3>
      </div>
    </div>
  );
};

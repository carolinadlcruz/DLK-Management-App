import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";

//Code
import { App } from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  //Use effect se pueden ejecutar 2 veces por el modo estricto
  <HashRouter>
    <App />
  </HashRouter>
);

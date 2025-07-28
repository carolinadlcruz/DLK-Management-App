import React, { Suspense, lazy, useState } from "react";
//React router dom imports
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../home/HomePage";
import { SolicitudesPage } from "../solicitudes/pages/SolicitudesPage";
import { ReportesPage } from "../reportes/pages/ReportesPage";
import { PartesPages } from "../partes/pages/PartesPages";
import { UsuariosPage } from "../usuarios/pages/UsuariosPage";
import { SolicitudSeleccionadaPage } from "../solicitudes/pages/SolicitudSeleccionadaPage";
import { Loading } from "../globalComponents/Loading";
import { ParteSeleccionadaPage } from "../partes/pages/ParteSeleccionadaPage";
import { MatrizPage } from "../solicitudes/pages/MatrizPage";
import { LoginPage } from "../auth/pages/LoginPage";
import { FormatoResultados } from "../solicitudes/pages/FormatoResultados";
import { DashboardPage } from "../home/pages/DashboardPage";
import { LayoutDefault } from "../layout/Layout";
//const ServiciosPage = lazy(() => import("../servicios/pages/ServiciosPage"));
const ServiciosPage = lazy(() =>
  import("../servicios/pages/ServiciosPage").then((module) => ({
    default: module.ServiciosPage,
  }))
);

export const AppRouter = () => {
  return (
    <>
      <Routes>
        {/* Ruta principal*/}
        <Route path="/auth/login" element={<LoginPage />}></Route>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="" element={<LayoutDefault />}>
          <Route path="/prioridades" element={<HomePage />}></Route>
          {/*Rutas padres */}
          <Route path={"/solicitudes"} element={<SolicitudesPage />}></Route>
          <Route path="/reportes" element={<ReportesPage />}></Route>
          <Route
            path="/servicios"
            element={
              <Suspense fallback={<Loading />}>
                <ServiciosPage />
              </Suspense>
            }
          ></Route>
          <Route path="/partes" element={<PartesPages />}></Route>
          <Route path="/dashboard" element={<DashboardPage />}></Route>

          <Route path="/usuarios" element={<UsuariosPage />}></Route>
          <Route
            path="/solicitudes/solicitudSeleccionada"
            element={<SolicitudSeleccionadaPage />}
          ></Route>
          <Route
            path="/solicitudes/solicitudSeleccionada/matriz"
            element={<MatrizPage />}
          ></Route>
          <Route
            path="/solicitudes/solicitudSeleccionada/matriz/formato"
            element={<FormatoResultados />}
          ></Route>
          <Route path="/loading" element={<Loading />}></Route>
          <Route
            path="/partes/parteSeleccionada"
            element={<ParteSeleccionadaPage />}
          ></Route>

          {/*Ruta comodin en caso de que no se encuentre ninguna */}
          {/*
            <Route path="/" element={<Navigate to="/auth/login" />}></Route>
            */}
        </Route>
      </Routes>
    </>
  );
};

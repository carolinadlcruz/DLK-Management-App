import React, {  Suspense, lazy } from "react";
//React router dom imports
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";

export const AuthRouter = () => {
  return (
    <>
      <Routes>
        {/* Ruta principal*/}
        <Route path="/auth/login" element={<LoginPage />}></Route>
        {
          /**
        <Route path="/" element={<Navigate to="/auth/login" />}></Route>
           * 
           * */        }
      </Routes>
    </>
  );
};

import React from "react";
import { Sidebar } from "../../globalComponents/Sidebar";
import { BarListHero } from "../components/BarListHero";
import { Card } from "@tremor/react";
export const DashboardPage = () => {
  return (
    <>
      <Sidebar />
      <div className="col-10 p-5 animate__animated  animate__fadeInRight">
        <div className=""></div>
        {/* Este es el contenedor principal del contenido de la pagina */}
        <div className="p-5 divMainSolicitudes h-100">
          <Card
            className="mx-auto max-w-15 "
            decoration={"top"}
            decorationColor="indigo"
          >
            <p>XD</p>
          </Card>
        </div>
      </div>
    </>
  );
};

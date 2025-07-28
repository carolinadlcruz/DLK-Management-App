import React, { useEffect, useState } from "react";
import "../../globalStyles/TabsGroup.css";
import "../../scripts/tabsGroup.js";
import { IoIosWarning } from "react-icons/io";

export const TabsGroup = ({
  onStatusChange,
  priorityNumber,
  listaSolicitudes,
  onListaSolicitudesChange,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [priorityCount, setPriorityCount] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const solicitudesConPrioridad = listaSolicitudes.filter(
      (solicitud) => solicitud.priority > 0 && solicitud.status !== "Terminado"
    );
    const nuevaCantidad = solicitudesConPrioridad.length;

    if (nuevaCantidad !== priorityCount) {
      setPriorityCount(nuevaCantidad);

      // Trigger animation
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);

      // Play sound only when increasing
      if (nuevaCantidad > priorityCount) {
        const audio = new Audio("src\\alert.mp3");
        audio.play().catch((err) => console.log("Sound play failed:", err));
      }
    }
  }, [listaSolicitudes]);

  useEffect(() => {
    onStatusChange(selectedStatus);
  }, [selectedStatus]);

  return (
    <div className="containerTabs">
      <nav className="tabs-wrapper ">
        <div
          className="tab"
          id="4"
          onClick={() => setSelectedStatus(0)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Todas
        </div>
        {/* <div className="tab" id="4" onClick={() => setSelectedStatus(4)}>
          Nuevas
        </div>
        <div className="tab" id="5" onClick={() => setSelectedStatus(5)}>
          En proceso
        </div> */}
        <div
          className="tab"
          id="7"
          onClick={() => setSelectedStatus(7)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Terminadas
        </div>
        <div
          className="tab tabPrioridad"
          id="8"
          onClick={() => setSelectedStatus(8)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Prioridad
          {priorityCount > 0 && (
            <p className={`iconoPrioridad ${animate ? "counter-animate" : ""}`}>
              {priorityCount}
            </p>
          )}
        </div>
      </nav>
    </div>
  );
};

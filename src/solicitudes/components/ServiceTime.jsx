//Hacemos las imporratciones
import React, { useState, useEffect } from "react";

export const ServiceTime = ({ servicio }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setNow(new Date());
  }, []);

  function formatElapsedTime(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = endDateStr ? new Date(endDateStr) : now;

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return "Error: Fecha de inicio o fin inválida";
    }

    const timeDiff = endDate.getTime() - startDate.getTime();
    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let formattedTime = "";
    if (days > 0) {
      formattedTime += `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      formattedTime += `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      formattedTime += `${minutes}m ${seconds}s`;
    } else {
      formattedTime += `${seconds}s`;
    }

    return formattedTime;
  }

  return (
    <p>
      {servicio.startDate
        ? servicio.endDate
          ? formatElapsedTime(servicio.startDate, servicio.endDate)
          : formatElapsedTime(servicio.startDate)
        : "Sin comenzar."}
    </p>
  );
};

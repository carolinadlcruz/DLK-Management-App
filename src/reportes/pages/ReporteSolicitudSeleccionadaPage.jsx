import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportePDF } from "../components/ReportePDF";
export const ReporteSolicitudSeleccionadaPage = () => {
  return (
    <div>
      {/*Aqui va el link de descarga */}
      <PDFDownloadLink document={ReportePDF}>
      </PDFDownloadLink>
    </div>
  );
};

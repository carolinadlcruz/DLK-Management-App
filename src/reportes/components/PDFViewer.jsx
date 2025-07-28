import React from 'react'
import { FaCircle, FaEye, FaFilePdf } from "react-icons/fa";
import { PDFViewer, Document, Page } from '@react-pdf/renderer';
export const PDFViewerLink = () => {
    //Metodo
    const handleClick = () => {
        const pdfWindow = window.open('', '_blank');
        pdfWindow.document.write('<html><head><title>PDF</title></head><body>');
        pdfWindow.document.write('<iframe src="' + URL.createObjectURL(document) + '" width="100%" height="100%" style="border:none;"></iframe>');
        pdfWindow.document.write('</body></html>');
      };

  return (
    <div className="itemTabla col-md d-flex align-items-center justify-content-center" onClick={handleClick}>
    <FaFilePdf />
  </div>
  )
}


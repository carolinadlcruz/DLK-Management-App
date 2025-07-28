import React from "react";
import * as XLSX from "xlsx";

const ExcelUploader = ({ sections, setInputValues, setInputValidations }) => {
  const processExcelFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length > 0) {
          const firstRow = jsonData[0];
          const newInputValues = {};
          const newInputValidations = {};

          // Iterate through sections and characteristics to map Excel columns to inputs
          sections.forEach((section) => {
            section.caracteristicas.forEach((caracteristica) => {
              const {
                idCaracteristica,
                caracteristica: nombre,
                lowerLimit,
                upperLimit,
              } = caracteristica;

              // Try to find matching column in Excel
              const columnValue =
                firstRow[nombre] ||
                firstRow[
                  Object.keys(firstRow).find(
                    (key) => key.toLowerCase() === nombre.toLowerCase()
                  )
                ];

              if (columnValue !== undefined) {
                const value = parseFloat(columnValue);
                if (!isNaN(value)) {
                  newInputValues[idCaracteristica] = value;
                  // Validate the value
                  const isValid =
                    (lowerLimit === null || value >= lowerLimit) &&
                    (upperLimit === null || value <= upperLimit);
                  newInputValidations[idCaracteristica] = isValid;
                }
              }
            });
          });

          setInputValues(newInputValues);
          setInputValidations(newInputValidations);
          alert("Excel data loaded successfully!");
        }
      } catch (error) {
        console.error("Error processing Excel file:", error);
        alert(
          "Error processing Excel file. Please check the format and try again."
        );
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("Error reading file. Please try again.");
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        processExcelFile(file);
      } else {
        alert("Please upload a valid Excel file (.xlsx or .xls)");
      }
    }
  };

  return (
    <div className="mb-3 d-flex align-items-center">
      <input
        type="file"
        className="form-control"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        style={{ display: "none" }}
        id="excelFileInput"
      />
      <button
        className="btn btn-primary"
        onClick={() => document.getElementById("excelFileInput").click()}
      >
        Cargar desde Excel
      </button>
    </div>
  );
};

export default ExcelUploader;

import React, { useState, useEffect, useRef, lazy } from "react";
import "./styles/HomePage.css";
import { Header } from "../globalComponents/Header";
import { AiTwotoneAppstore } from "react-icons/ai";
import { Loading } from "../globalComponents/Loading";
import { FaCheckCircle } from "react-icons/fa";
import Select from "react-select";

const Combobox = lazy(() =>
  import("../globalComponents/Combobox").then((module) => ({
    default: module.Combobox,
  }))
);

export const HomePage = () => {
  // Sample initial data with id, line and operation
  const [loading, setLoading] = useState(true);
  const [laboratorioSeleccionado, setLaboratorioSeleccionado] = useState(1);

  const handleLaboratoryChange = (selectedLab) => {
    setLaboratorioSeleccionado(selectedLab);
    fetchLinesAndServices(selectedLab);
    obtenerPrioridades(selectedLab);
  };

  const [initialItems, setInitialItems] = useState([]);

  const obtenerPrioridades = async (idLaboratory) => {
    try {
      //ImprimimosS

      const response = await fetch(
        `http://10.239.10.175:3000/priorities/${idLaboratory}`
      );
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }
      const initialItems = await response.json();
      setItems(initialItems);
    } catch (error) {
      console.error("Error al consultar prioridades:", error);
    }
  };

  // Mock database data

  const operationsData = {
    "Line A": [
      { id: 1, name: "Operation 1" },
      { id: 2, name: "Operation 2" },
    ],
    "Line B": [
      { id: 32, name: "Operation 3" },
      { id: 40, name: "Operation 4" },
    ],
    "Line C": [
      { id: 5, name: "Operation 5" },
      { id: 6, name: "Operation 6" },
    ],
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#161a23",
      border: "none", // Removes border
      borderRadius: "4px",
      boxShadow: "none", // Removes default focus ring
      padding: "2px 5px",
      "&:hover": {
        border: "none", // Ensure no border on hover
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#2d2f38",
      borderRadius: "4px",
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#363841" : "#2d2f38",
      color: "white",
      cursor: "pointer",
      padding: "10px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
    input: (base) => ({
      ...base,
      color: "white",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#999",
    }),
  };

  // States
  const [items, setItems] = useState(() => {
    // Try to load from localStorage on initial load
    const savedItems = localStorage.getItem("dragableItems");
    return savedItems ? JSON.parse(savedItems) : initialItems;
  });

  const [linesData, setLinesData] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedOperation, setSelectedOperation] = useState("");
  const [availableOperations, setAvailableOperations] = useState([]);
  const [dragItem, setDragItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  // Save to localStorage whenever items change
  useEffect(() => {
    obtenerPrioridades(laboratorioSeleccionado);
    fetchLinesAndServices(laboratorioSeleccionado);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [items]);

  useEffect(() => {
    localStorage.removeItem("dragableItems");
  }, [laboratorioSeleccionado]);

  const fetchLinesAndServices = async (idLaboratory) => {
    try {
      const linesRes = await fetch("http://10.239.10.175:3000/lines");
      const servicesRes = await fetch(
        `http://10.239.10.175:3000/services/${idLaboratory}`
      );

      if (!linesRes.ok || !servicesRes.ok) {
        throw new Error("Error al obtener datos");
      }

      const lines = await linesRes.json();
      const services = await servicesRes.json();

      setLinesData(lines);
      setAllServices(services);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  // Update available operations when line selection changes
  useEffect(() => {
    if (selectedLine) {
      setAvailableOperations(allServices);
      setSelectedOperation(null); // Reset to null, not empty string
    } else {
      setAvailableOperations([]);
    }
  }, [selectedLine]);

  useEffect(() => {
    // Al cargar, primero conseguimos el laboratorio seleccionado
    const laboratorioPorDefecto = 1;
    // Actualizamos el estado y consultamos los servicios
    obtenerPrioridades(laboratorioPorDefecto);
    //Quitamos el icono de cargando
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDragItem(index);
    e.target.classList.add("dragging");
  };

  const handleDragEnter = (e, index) => {
    setDragOverItem(index);
    e.target.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.target.classList.remove("drag-over");
  };

  const handleDragEnd = async (e) => {
    e.target.classList.remove("dragging");

    const newItems = [...items];
    const draggedItemContent = newItems[dragItem];
    newItems.splice(dragItem, 1);
    newItems.splice(dragOverItem, 0, draggedItemContent);

    setDragItem(null);
    setDragOverItem(null);
    setItems(newItems);

    // Extraer solo los IDs en nuevo orden
    const newOrder = newItems.map((item) => parseInt(item.idPriority));

    // Enviar al backend
    try {
      const response = await fetch(
        "http://10.239.10.175:3000/update-priority-order",
        {
          method: "POST", // o POST si así lo definiste
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newOrder,
            idLaboratory: laboratorioSeleccionado,
          }),
        }
      );

      // ⚠️ Este es el paso crucial
      // Limpiar localStorage para que no reescriba con el orden viejo
      localStorage.removeItem("dragableItems");

      // 🔄 Volver a cargar desde backend para asegurar que el orden está bien reflejado
      await obtenerPrioridades(laboratorioSeleccionado);

      if (!response.ok) {
        throw new Error(`Error actualizando orden: ${response.statusText}`);
      }

      console.log("Orden actualizado en la base de datos");
    } catch (err) {
      console.error("Error al actualizar orden:", err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
    setSelectedLine("");
    setSelectedOperation("");
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Add new item
  const addItem = async () => {
    if (!selectedLine || !selectedOperation) return;
    console.log(selectedOperation, selectedLine, laboratorioSeleccionado);
    const payload = {
      idLine: selectedLine.idLine,
      idService: selectedOperation.idService,
      idLaboratory: parseInt(laboratorioSeleccionado),
    };

    console.log("Sending:", payload);

    try {
      const res = await fetch(`http://10.239.10.175:3000/priorities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Error al guardar: ${res.statusText}`);
      }

      await obtenerPrioridades(laboratorioSeleccionado); // Refresh list
      closeModal();
    } catch (error) {
      console.error("Error al agregar prioridad:", error);
    }
  };

  // Remove item
  const removeItem = async (idPriority) => {
    try {
      const response = await fetch(
        `http://10.239.10.175:3000/priorities/${idPriority}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Error al eliminar: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result.message); // Optionally show a success message

      // Refresh the priorities list
      obtenerPrioridades(laboratorioSeleccionado);
    } catch (error) {
      console.error("Error al eliminar prioridad:", error);
    }
  };

  return loading ? (
    <>
      <Loading />
    </>
  ) : (
    <div className="homeMainContainer ">
      <div className="dragableListContainer">
        <div className="header d-flex align-items-center">
          <AiTwotoneAppstore className="mt-2 iconHeader" />
          <Header title="Prioridades" />
        </div>

        <hr className="border border-primary" />
        <div className="comboboxContainer row ">
          <Combobox
            title={"Laboratorios"}
            onLaboratoryChange={handleLaboratoryChange}
          />
        </div>
        {/* Add new item button */}
        <div className="addButtonContainer">
          <button onClick={openModal} className="addButton">
            Agregar prioridad
          </button>
        </div>

        {/* Draggable list */}
        <div className="itemList">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={item.idPriority}
                className="item"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
              >
                <div className="dragHandle">☰</div>
                <div className="itemContent">
                  <div className="operationName">{item.serviceName}</div>
                  <div className="lineName">Line: {item.lineName}</div>
                  {/*                   <div className="itemId">ID: {item.idPriority}</div> */}
                </div>
                <button
                  onClick={() => removeItem(item.idPriority)}
                  className="deleteButton"
                >
                  Borrar
                </button>
              </div>
            ))
          ) : (
            <div className="emptyMessage">
              No existen prioridades por ahora. Click "Agregar prioridad" para
              empezar.
            </div>
          )}
        </div>

        {/* Display current order */}
        {/* <div className="orderInfo">
          <h2>orden:</h2>
          <pre className="jsonDisplay">{JSON.stringify(items, null, 2)}</pre>
        </div> */}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Agregar nueva prioridad</h2>

            {/* Line selection */}
            <div className="formGroup">
              <label>Selecciona una linea:</label>
              <select
                value={selectedLine ? JSON.stringify(selectedLine) : ""}
                onChange={(e) => setSelectedLine(JSON.parse(e.target.value))}
                className="selectInput"
              >
                <option value="">Selecciona una linea...</option>
                {linesData.map((line) => (
                  <option key={line.idLine} value={JSON.stringify(line)}>
                    {line.lineName}
                  </option>
                ))}
              </select>
            </div>

            <div className="formGroup">
              <label>Selecciona un servicio:</label>
              <Select
                isDisabled={!selectedLine}
                value={
                  selectedOperation
                    ? {
                        value: selectedOperation,
                        label: selectedOperation.name,
                      }
                    : null
                }
                onChange={(option) =>
                  setSelectedOperation(option?.value || null)
                }
                options={availableOperations.map((op) => ({
                  value: op,
                  label: op.name,
                }))}
                placeholder="Buscar y seleccionar servicio..."
                className="selectInput"
                styles={customSelectStyles}
              />
            </div>
            {/* Action buttons */}
            <div className="modalButtons">
              <button onClick={closeModal} className="cancelButton">
                Cancel
              </button>
              <button
                onClick={addItem}
                className="addButton"
                disabled={!selectedLine || !selectedOperation}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

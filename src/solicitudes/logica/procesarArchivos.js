import pdfToText from "react-pdftotext";

/*
export function crearTabla(data) {
  const todasFilas = data.split(/\r?\n|\r/);
  let tabla = '<table id="tablaSeleccionable" class="table table-bordered ">';
  let elementosSeleccionados = []; // Arreglo para almacenar los elementos seleccionados
  
  // Array para almacenar si cada columna tiene algún valor
  let columnasConValores = Array(todasFilas[0].split(',').length).fill(false);
  // Array para almacenar si cada fila tiene algún valor
  let filasConValores = Array(todasFilas.length).fill(false);

  // Detectar columnas con valores
  for (let fila = 1; fila < todasFilas.length; fila++) {
    const celdasFila = todasFilas[fila].split(',');
    for (let i = 0; i < celdasFila.length; i++) {
      if (celdasFila[i].trim() !== '') {
        columnasConValores[i] = true;
        filasConValores[fila] = true;
      }
    }
  }


  // Separador de campos
  const separador = ';';

  for (let fila = 0; fila < todasFilas.length; fila++) {
    const esEncabezado = fila === 0;
    if (esEncabezado) {
      tabla += '<thead>';
    } else if (!filasConValores[fila]) {
      continue; // Omitir la creación de la fila si no tiene ningún valor
    }
    tabla += '<tr>';
    const celdasFila = todasFilas[fila].split(separador);
    for (let rowCell = 0; rowCell < celdasFila.length; rowCell++) {
      if (!columnasConValores[rowCell]) {
        continue; // Omitir la creación de la celda si la columna está vacía
      }
      if (esEncabezado) {
        tabla += '<th>';
      } else {
        tabla += `<td onclick="toggleSeleccion(this)" class="no-seleccionado" style="background-color: white;">`; // Agregar estilo para fondo blanco
      }
      tabla += celdasFila[rowCell]; // No agregar imagen
      if (esEncabezado) {
        tabla += '</th>';
      } else {
        tabla += '</td>';
      }
    }
    if (esEncabezado) {
      tabla += '</tr>';
      tabla += '</thead>';
      tabla += '<tbody>';
    } else {
      tabla += '</tr>';
    }
  } 
  tabla += '</tbody>';
  tabla += '</table>';
  document.querySelector('#tablares').innerHTML = tabla;

  // Función para alternar la selección de una celda
  window.toggleSeleccion = function(cell) {
    if (cell.classList.contains('seleccionado')) {
      cell.classList.remove('seleccionado'); // Quitar clase 'seleccionado' si ya está presente
      cell.classList.add('no-seleccionado'); // Agregar clase 'no-seleccionado' para diferenciar visualmente
      const fila = cell.parentElement.rowIndex;
      const columna = cell.cellIndex;
      const index = elementosSeleccionados.findIndex(e => e.fila === fila && e.columna === columna);
      if (index !== -1) {
        elementosSeleccionados.splice(index, 1); // Quitar elemento seleccionado del arreglo si ya existe
      }
    } else {
      cell.classList.remove('no-seleccionado'); // Quitar clase 'no-seleccionado' si ya está presente
      cell.classList.add('seleccionado'); // Agregar clase 'seleccionado' para resaltar visualmente la selección
      const fila = cell.parentElement.rowIndex;
      const columna = cell.cellIndex;
      const elementoSeleccionado = { fila, columna };
      elementosSeleccionados.push(elementoSeleccionado); // Agregar elemento seleccionado al arreglo
    }
    console.log(elementosSeleccionados); // Mostrar elementos seleccionados en la consola
  };
}
*/
export function crearTabla(data) {
  const todasFilas = data.trim().split(/\r?\n|\r/);
  let tabla = '<table id="tablaSeleccionable" class="table table-bordered">';
  let elementosSeleccionados = []; // Arreglo para almacenar los elementos seleccionados

  // Iteramos sobre cada fila del texto
  todasFilas.forEach((line, index) => {
    const celdasFila = line.split("\t");
    tabla += index === 0 ? "<thead><tr>" : "<tr>"; // Abre la fila (encabezado o normal)

    // Iteramos sobre cada celda de la fila
    celdasFila.forEach((cell, cellIndex) => {
      tabla += index === 0 ? `<th>${cell}</th>` : `<td>${cell}</td>`; // Agrega celda como encabezado o normal
    });

    tabla += index === 0 ? "</tr></thead><tbody>" : "</tr>"; // Cierra la fila (encabezado o normal)
  });

  tabla += "</tbody></table>";
  document.querySelector("#tablares").innerHTML = tabla;
}

export function leerArchivo2(evt) {
  let file = evt.target.files[0];
  let reader = new FileReader();
  reader.onload = (e) => {
    // Cuando el archivo se terminó de cargar
    if (file.name.endsWith(".pdf")) {
      // Si el archivo es un archivo PDF (.pdf), extraer texto y convertir a CSV
      const data = e.target.result;
      convertirPDFaCSV(data);
    } else if (file.name.endsWith(".txt")) {
      // Si el archivo es un archivo de texto (.txt), convertirlo a formato CSV
      const data = e.target.result;
      const csvData = convertirTxtACSV(data);
      localStorage.setItem("resultados",csvData )

      mostrarResultadosEnTabla(csvData, "InputTabla", 2, 1);

      //crearTabla(csvData);
    } else if (file.name.endsWith(".csv")) {
      // Si el archivo es un archivo CSV (.csv)
      const data = e.target.result;
      crearTabla(data);
    } else {
      console.error("Formato de archivo no compatible");
    }
  };
  // Leemos el contenido del archivo seleccionado
  reader.readAsText(file);
}
function convertirPDFaCSV(pdfData) {
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  loadingTask.promise
    .then((pdf) => {
      let text = "";
      const getPageText = (pageNum) => {
        pdf.getPage(pageNum).then((page) => {
          page.getTextContent().then((textContent) => {
            textContent.items.forEach((item) => {
              text += item.str + " ";
            });
            text += "\n";
            if (pageNum < pdf.numPages) {
              getPageText(pageNum + 1);
            } else {
              console.log("Texto extraído del PDF:", text); // Mostrar texto en consola
              const csvData = convertirTxtACSV(text);
              crearTabla(csvData);
            }
          });
        });
      };
      getPageText(1);
    })
    .catch((err) => {
      console.error("Error al leer el archivo PDF:", err);
    });
}

function convertirTxtACSV(txtData) {
  // Dividimos el texto en líneas
  const lines = txtData.trim().split("\n");
  let csvData = ""; // Inicializamos el CSV vacío

  // Iteramos sobre cada línea del texto, comenzando desde la segunda línea para ignorar la primera con numeración
  for (let i = 1; i < lines.length; i++) {
    // Dividimos la línea por tabulaciones (ya que es un archivo de texto tabulado)
    const values = lines[i].trim().split("\t");
    // Agregamos el valor de la columna 'Length' al CSV, rodeándolo de comillas dobles
    // El índice de la columna 'Length' es 5 (0-indexed)
    csvData += `${values[7].trim()}\n`;
  }
  // Mostramos el CSV generado en la consola
  console.log(csvData);
  return csvData;
}

function mostrarResultadosEnTabla(txtData, tablaId, inicioColumna, inicioFila) {
  //Obtener la tabla para introducir datos
  const tabla = document.getElementById(tablaId);
  //En la tabla , obtenemos la posicion en los que va  mostrar los datos
  //Recorremos la informacion
  //Convertimos el string a numeros
  const cantidadDatos = convertirStringAArregloEnteros(txtData);
  //Guardamos en el local storage
  localStorage.setItem("cantidadDatos", cantidadDatos);
  
  //Obtenemos la cantidad de datos
  console.log(cantidadDatos);
  //Buscamos la columna
  var posicion = tabla.rows[inicioFila].cells[inicioColumna]; // Suponiendo que el índice de la columna es conocido
  //Hacemos un ciclo por cada dato del arreglo
  //Crear las columnas necesarias
  // Recorremos la información
  let columna = inicioColumna;
  let filaActual = inicioFila;
  cantidadDatos.forEach((resultado, i) => {
    const posicion = tabla.rows[filaActual].cells[columna];
    posicion.textContent = resultado;
   
    filaActual++;
  });
  //Una vez tenemos las columnas, vamos a pintar los datos, yendonos de una en una

}

//Metodo para convertir
function convertirStringAArregloEnteros(cadena) {
  // Dividir la cadena en líneas
  const lineas = cadena.split("\n");

  // Inicializar el arreglo vacío
  const arregloEnteros = [];

  // Recorrer las líneas
  for (const linea of lineas) {
    // Convertir cada valor a entero y agregarlo al arreglo
    arregloEnteros.push(parseFloat(linea));
  }

  // Devolver el arreglo de enteros
  return arregloEnteros;
}

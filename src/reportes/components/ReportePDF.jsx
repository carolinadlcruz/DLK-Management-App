import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import zfwhiteicon from "../../assets/zf-logo_blue.png";
import { useEffect, useState } from "react";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "#E4E4E4",
    padding: 4,
    marginBottom: 4,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cell: {
    width: "48%",
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  tableCellHeader: {
    padding: 5,
    fontWeight: "bold",
    backgroundColor: "#E4E4E4",
  },
  tableCell: {
    padding: 5,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
    color: "black",
  },
});

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const dateOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  return (
    date.toLocaleDateString("es-ES", dateOptions) +
    " " +
    date.toLocaleTimeString("es-ES", timeOptions)
  );
};
const calculateDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const totalMilliseconds = endDate - startDate;
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};
export const ReportePDF = ({ solicitud }) => {
  const [servicios, setServicios] = useState([]);
  const [usuario, setUsuario] = useState([]);

  const obtenerServiciosDeSolicitud = async (idRequest) => {
    try {
      //Imprimimos
      console.log("Se hara la consulta a : " + idRequest);
      const response = await fetch(
        `http://10.239.10.175:3000/requestsServices/${idRequest}`
      );
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }
      const servicios = await response.json();
      console.log("servicios" + servicios);
      setServicios(servicios);
    } catch (error) {
      console.error("Error al consultar servicios:", error);
    }
  };

  const obtenerUser = async (idRequest) => {
    try {
      //Imprimimos
      console.log("Se hara la consulta a : " + idRequest);
      const response = await fetch(
        `http://10.239.10.175:3000/getrequestsUser/${idRequest}`
      );
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }
      const usuario = await response.json();
      setUsuario(usuario);
    } catch (error) {
      console.error("Error al consultar usuario:", error);
    }
  };

  useEffect(() => {
    if (solicitud?.requestId) {
      obtenerServiciosDeSolicitud(solicitud.requestId);
      obtenerUser(solicitud.requestId);
      console.log("ID DE LA REQUEST : " + solicitud.requestId);

      if (solicitud.status === "Nuevo") {
        onSolicitudChangeStatus();
      }
    }
  }, [solicitud]);

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.row}>
          <Image style={styles.logo} src={zfwhiteicon} />
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Datos de la solicitud</Text>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text>
                <Text style={styles.bold}>Folio:</Text> {solicitud.requestId}
              </Text>
              <Text>
                <Text style={styles.bold}>Fecha y hora inicio:</Text>{" "}
                {formatDateTime(solicitud.startHour)}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text>
                {/*TODO: Falta por trabajar la parte de conforme o no conforme */}
                <Text style={styles.bold}>Resultado:</Text> {solicitud.result}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text>
                <Text style={styles.bold}>Fecha de fin:</Text>{" "}
                {formatDateTime(solicitud.exitHour)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Datos del solicitante</Text>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text>
                <Text style={styles.bold}>Número de empleado:</Text>{" "}
                {solicitud.employeeNumber}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text>
                <Text style={styles.bold}>Nombre:</Text> {solicitud.requester}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Datos del técnico</Text>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text>
                <Text style={styles.bold}>Número de empleado:</Text>{" "}
                {usuario?.numEmployee ?? "0000"}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text>
                <Text style={styles.bold}>Nombre:</Text>{" "}
                {usuario?.name && usuario?.lastName
                  ? `${usuario.name} ${usuario.lastName}`
                  : "Técnico asignado"}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Datos del número de parte</Text>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text>
                <Text style={styles.bold}>Número de parte:</Text>{" "}
                {solicitud.partNumber}
              </Text>
            </View>

            <View style={styles.cell}>
              <Text>
                <Text style={styles.bold}>Parte:</Text> {solicitud.component}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text>
                <Text style={styles.bold}>Lote:</Text> {solicitud.lot}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text>
                <Text style={styles.bold}>Linea:</Text> {solicitud.line}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Datos de servicios</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCellHeader, { width: "16%" }]}>
                Servicio
              </Text>
              <Text style={[styles.tableCellHeader, { width: "16%" }]}>
                Fecha Inicio
              </Text>
              <Text style={[styles.tableCellHeader, { width: "16%" }]}>
                Fecha Fin
              </Text>
              <Text style={[styles.tableCellHeader, { width: "16%" }]}>
                Tiempo total
              </Text>
              {/* <Text style={[styles.tableCellHeader, { width: "20%" }]}>
                Resultados
              </Text> */}
            </View>
            {servicios.map((servicio) => (
              <View key={servicio.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "16%" }]}>
                  {servicio.name}
                </Text>
                <Text style={[styles.tableCell, { width: "16%" }]}>
                  {formatDateTime(servicio.startDate)}
                </Text>
                <Text style={[styles.tableCell, { width: "16%" }]}>
                  {formatDateTime(servicio.endDate)}
                </Text>
                <Text style={[styles.tableCell, { width: "16%" }]}>
                  {calculateDuration(servicio.startDate, servicio.endDate)}
                </Text>
                {/* <Text style={[styles.tableCell, { width: "20%" }]}>
                  {servicio.result ? servicio.result : "No disponible"}
                </Text> */}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <Text>F-CA-005-001/3</Text>
        </View>
        <View style={styles.section}>
          {/* TODO: Hay que trabajar la parte de salidas (Hora y fecha, y quién se lo llevó ) */}
        </View>
      </Page>
    </Document>
  );
};

import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { downloadPDF } from "../services/institutionService";

const DashboardSupport = () => {
  const handleGeneratePDF = () => {
    // Realiza el llamado a la API para generar el PDF y mostrarlo en una nueva ventana
    downloadPDF().then((response) => {
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const pdfWindow = window.open();
      pdfWindow.document.write(
        `<iframe width='100%' height='100%' src='${fileURL}'></iframe>`
      );
    });
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleGeneratePDF}
      sx={{
        backgroundColor: "#3f51b5",
        "&:hover": { backgroundColor: "#303f9f" },
      }}
    >
      Generar Reporte en PDF
    </Button>
  );
};

export default DashboardSupport;

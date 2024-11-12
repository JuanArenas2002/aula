// Ruta para generar el reporte en PDF de instituciones
router.get('/reporte-instituciones', async (req, res) => {
    try {
      const institutions = await getInstitutions();
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=reporte_instituciones.pdf');
      const doc = new PDFDocument({ margin: 40 });
  
      const logoPath = path.join(__dirname, '../assets/logo.png');
  
      doc.pipe(res);
  
      // Obtener la fecha y hora actual
      const now = new Date();
      const fecha = now.toLocaleDateString();
      const hora = now.toLocaleTimeString();
  
      // Encabezado con el logo, título, fecha y hora
      doc
        .image(logoPath, 40, 20, { width: 40 })
        .fontSize(20)
        .fillColor('#333')
        .text('Reporte de Instituciones', 90, 20, { align: 'left' })
        .fontSize(10)
        .text(`Fecha: ${fecha}`, 450, 20, { align: 'right' })
        .text(`Hora: ${hora}`, 450, 35, { align: 'right' })
        .moveDown();
  
      // Línea debajo del encabezado
      doc
        .moveTo(40, 60)
        .lineTo(570, 60)
        .lineWidth(1)
        .strokeColor('#3f51b5')
        .stroke();
  
      // Configuración de la tabla
      const tableTop = 80;
      const itemMargin = 20;
      const itemsPerPage = 20; // Límite de filas por página
      let currentY = tableTop;
  
      // Configuración de ancho de columnas
      const columnWidths = {
        ID: 40,
        NIT: 60,
        Nombre: 100,
        Municipio: 80,
        Dirección: 100,
        Correo: 120,
        Estado: 60,
      };
  
      // Encabezados de la tabla
      const headers = ['ID', 'NIT', 'Nombre', 'Municipio', 'Dirección', 'Correo', 'Estado'];
  
      // Función para dibujar el texto de cada columna en la tabla
      const drawColumn = (text, x, y, width, isHeader = false) => {
        doc
          .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
          .fontSize(isHeader ? 10 : 9)
          .fillColor(isHeader ? '#ffffff' : '#333')
          .text(text || '', x, y, { width, align: 'center', ellipsis: true });
      };
  
      // Función para dibujar los encabezados
      const drawTableHeaders = (y) => {
        let xPosition = 40;
        doc
          .rect(40, y - 5, 530, 20) // Fondo de color para el encabezado de la tabla
          .fillAndStroke('#3f51b5', '#3f51b5');
  
        headers.forEach((header) => {
          drawColumn(header, xPosition, y, columnWidths[header], true);
          xPosition += columnWidths[header];
        });
      };
  
      // Dibujar encabezados en la primera página
      drawTableHeaders(tableTop);
  
      // Función para dibujar una fila
      const drawRow = (institution, y) => {
        let xPosition = 40;
        const values = [
          institution.id_institucion,
          institution.nit,
          institution.nombre,
          institution.municipio,
          institution.direccion,
          institution.correo,
          institution.estado ? 'Activo' : 'Inactivo',
        ];
  
        values.forEach((value, colIndex) => {
          const header = headers[colIndex];
          drawColumn(value, xPosition, y, columnWidths[header]);
          xPosition += columnWidths[header];
        });
      };
  
      // Dibujar cada institución en una nueva fila, manejando paginación
      institutions.forEach((institution, index) => {
        if (index > 0 && index % itemsPerPage === 0) {
          // Nueva página si se supera el límite de items por página
          doc.addPage();
          currentY = tableTop; // Reiniciar la posición Y para la nueva página
          drawTableHeaders(currentY); // Redibujar los encabezados en la nueva página
          currentY += itemMargin;
        }
  
        // Alternar color de fondo de las filas
        const fillColor = index % 2 === 0 ? '#f4f6f8' : '#ffffff';
        doc
          .rect(40, currentY - 5, 530, 20)
          .fillAndStroke(fillColor, fillColor)
          .stroke();
  
        drawRow(institution, currentY);
        currentY += itemMargin;
      });
  
      // Línea final debajo de la tabla
      doc
        .moveTo(40, currentY)
        .lineTo(570, currentY)
        .stroke();
  
      // Pie de página
      doc
        .fontSize(8)
        .fillColor('#777')
        .text('Reporte generado automáticamente por el sistema', 40, currentY + 15, {
          align: 'center',
          width: 530,
        });
  
      doc.end();
    } catch (error) {
      console.error('Error al generar el reporte de instituciones:', error);
      res.status(500).json({ error: 'Error al generar el reporte de instituciones' });
    }
  });
  
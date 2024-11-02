const express = require('express');
const router = express.Router();
const authSupportController = require('../controller/authSupportController');
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Importa la configuración de la base de datos
const PDFDocument = require('pdfkit');
const path = require('path');

// Ruta para crear un nuevo usuario de soporte
router.post('/', authSupportController.createSupport);

// Ruta de inicio de sesión para soporte
router.post('/login', authSupportController.login);

// Ruta para obtener todas las instituciones junto con el nombre del municipio
router.get('/institucion', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        i.id_institucion, 
        UPPER(i.nit) AS nit,
        UPPER(i.nombre) AS nombre, 
        i.id_municipio,
        UPPER(i.direccion) AS direccion,
        LOWER(i.correo) AS correo,
        i.estado, 
        UPPER(m.municipio) AS municipio
      FROM 
        institucion i
      LEFT JOIN 
        municipios m ON i.id_municipio = m.id_municipio;
    `);
    res.json(results); // Devuelve los resultados como JSON
  } catch (err) {
    console.error('Error al obtener instituciones:', err);
    res.status(500).json({ error: 'Error al obtener instituciones' });
  }
});

// Cambiar estado de la institución
router.put('/institucion/:id_institucion/toggleStatus', async (req, res) => {
  const { id_institucion } = req.params;
  
  try {
    const [rows] = await db.query('SELECT estado FROM institucion WHERE id_institucion = ?', [id_institucion]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Institución no encontrada' });
    }

    const estadoActual = parseInt(rows[0].estado, 10);
    const nuevoEstado = estadoActual === 1 ? 0 : 1;

    const [updateResult] = await db.query('UPDATE institucion SET estado = ? WHERE id_institucion = ?', [nuevoEstado, id_institucion]);

    if (updateResult.affectedRows === 1) {
      res.json({ id_institucion, estado: nuevoEstado });
    } else {
      res.status(500).json({ message: 'No se pudo actualizar el estado de la institución' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar el estado de la institución' });
  }
});

// Ruta para crear una nueva institución
router.post('/institucion', async (req, res) => {
  const { nit, nombre, id_municipio, direccion, correo, clave } = req.body;

  if (!id_municipio) {
    return res.status(400).json({ error: 'El id_municipio es obligatorio y no puede estar vacío' });
  }

  try {
    const hashedPassword = await bcrypt.hash(clave, 10);
    
    // Intenta insertar la institución
    const [result] = await db.query(
      'INSERT INTO institucion (nit, nombre, id_municipio, direccion, correo, clave) VALUES (?, ?, ?, ?, ?, ?)',
      [nit, nombre, id_municipio, direccion, correo, hashedPassword]
    );

    res.status(201).json({ message: 'Institución creada exitosamente', id: result.insertId });
  } catch (error) {
    // Detecta el error de correo duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El correo ya está en uso. Por favor, elige otro correo.' });
    }
    console.error('Error al crear la institución:', error);
    res.status(500).json({ error: 'Error al crear la institución' });
  }
});

// Ruta para obtener municipios por término de búsqueda (con parámetro `q`)
router.get('/municipios', async (req, res) => {
  const searchQuery = req.query.q || '';
  try {
      const [results] = await db.query(
          `SELECT id_municipio, municipio 
           FROM municipios 
           WHERE municipio LIKE ? AND estado = 1 
           LIMIT 10`,
          [`%${searchQuery}%`]
      );
      res.json(results);
  } catch (error) {
      console.error('Error al obtener los municipios:', error);
      res.status(500).json({ error: 'Error al obtener los municipios' });
  }
});

// Ruta para obtener todos los departamentos
router.get('/departamentos', async (req, res) => {
  try {
      const [departamentos] = await db.query('SELECT id_departamento, departamento FROM departamentos');
      res.json(departamentos);
  } catch (error) {
      console.error('Error al obtener los departamentos:', error);
      res.status(500).json({ error: 'Error al obtener los departamentos' });
  }
});

// Ruta para obtener municipios según el departamento_id
router.get('/municipios/:departamento_id', async (req, res) => {
  const { departamento_id } = req.params;
  try {
    const [municipios] = await db.query(
      'SELECT id_municipio, municipio FROM municipios WHERE departamento_id = ? AND estado = 1',
      [departamento_id]
    );
    res.json(municipios);
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    res.status(500).json({ error: 'Error al obtener municipios' });
  }
});

// Función para obtener todas las instituciones
const getInstitutions = async () => {
  const [institutions] = await db.query(`
    SELECT 
      i.id_institucion, 
      i.nit, 
      i.nombre, 
      m.municipio AS municipio, 
      i.direccion, 
      i.correo, 
      i.estado 
    FROM institucion i
    LEFT JOIN municipios m ON i.id_municipio = m.id_municipio
  `);
  return institutions;
};

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
      NIT: 50,
      Nombre: 90,
      Municipio: 70,
      Dirección: 90,
      Correo: 100,
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

module.exports = router;
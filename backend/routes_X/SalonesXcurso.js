router.get('/salonesPorCurso', (req, res) => {
    const query = `
      SELECT cursos.Nombre AS nombre_curso, COUNT(salones.id) AS cantidad
      FROM cursos
      LEFT JOIN salones ON cursos.id = salones.Id_curso
      GROUP BY cursos.Nombre
    `;
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener salones por curso:', err);
        return res.status(500).send('Error en el servidor');
      }
      res.json(results);
    });
  });
  

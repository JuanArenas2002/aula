const bcrypt = require('bcryptjs');

const clave_original = '01'; // Usa la clave que quieras hashear
bcrypt.hash(clave_original, 10, (err, hash) => {
  if (err) {
    console.error('Error al hashear:', err);
  } else {
    console.log('Nuevo hash generado:', hash);
  }
});

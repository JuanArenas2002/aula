const bcrypt = require('bcryptjs');

const password = 'securepassword';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hash generado:', hash); // Este hash debería coincidir con el de la base de datos si todo está correcto
});

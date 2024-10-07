import React from 'react';
import ReactDOM from 'react-dom/client';  // Importa `createRoot` de `react-dom/client`
import App from './App';                  // Asegúrate de que `App` esté correctamente importado

// Crea un root con `createRoot`
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

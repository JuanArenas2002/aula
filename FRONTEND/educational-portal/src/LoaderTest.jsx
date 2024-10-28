import React from 'react';
import Loader from './components/Loader'; // Asegúrate de que la ruta sea correcta

const LoaderTest = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Loader />
    </div>
  );
};

export default LoaderTest;

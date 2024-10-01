import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Bienvenido a Mapify</h1>
      <p className="text-center text-lg mb-8">
        Carga tu archivo para comenzar a procesar tu texto.
      </p>
      {/* Aquí irá el componente de carga de archivos */}
    </div>
  );
};

export default Home;
import React from 'react';
import './Cabecera.css';

const Cabecera = ({ onHistoryClick }) => {
  return (
    <div className="bg-teal-500 text-white p-4 text-xl font-bold shadow rounded-md mb-4 flex justify-between items-center">
      <div>REPORTE DE INSPECCIÓN DE CALIDAD</div>
      <button
        onClick={onHistoryClick}
        title="Historial"
        className="bg-white text-teal-600 p-2 rounded-full shadow hover:bg-gray-100 transition"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3V12.4142L7.70711 15.7071C7.31658 16.0976 7.31658 16.7308 7.70711 17.1213C8.09763 17.5118 8.73079 17.5118 9.12132 17.1213L13 13.2426V3Z" fill="currentColor" />
          <path d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
};

export default Cabecera;

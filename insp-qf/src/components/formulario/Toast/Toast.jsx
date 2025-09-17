// src/components/Toast/Toast.jsx
import { useEffect } from 'react';

const Toast = ({ type = 'success', message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Cierra en 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseStyle = 'fixed top-5 right-5 z-50 px-4 py-3 rounded shadow-lg text-white';
  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500 text-black',
  };

  return (
    <div className={`${baseStyle} ${styles[type]}`}>
      <p>{message}</p>
    </div>
  );
};

export default Toast;

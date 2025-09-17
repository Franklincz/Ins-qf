import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import logo from '../../assets/logo-qf.png';

const db = getFirestore();

const Registro = ({ onNavigate }) => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Verificar si el DNI ya existe en Firestore
      const q = query(collection(db, 'users'), where('dni', '==', dni));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('El DNI ingresado ya está registrado.');
        setLoading(false);
        return;
      }

      // 2️⃣ Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3️⃣ Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        nombres,
        apellidos,
        dni,
        email,
        createdAt: new Date(),
      });

      setSuccess('Usuario registrado exitosamente');
      setLoading(false);

      // Redirigir después de 1.5s
      setTimeout(() => onNavigate('dashboard'), 1500);

    } catch (err) {
      setError('Error al registrar: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="QF Logo" className="h-16 mb-2" />
          <h1 className="text-xl font-semibold text-teal-600">Registro</h1>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="text"
            placeholder="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-500"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          ¿Ya tienes una cuenta?{" "}
          <span
            onClick={() => onNavigate("login")}
            className="text-teal-600 hover:underline cursor-pointer"
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

export default Registro;





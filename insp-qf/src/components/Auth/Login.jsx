// src/components/Auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-qf.png";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate(); // respaldo por si no envían onNavigate

  const goDashboard = () => {
    if (typeof onNavigate === "function") {
      onNavigate("dashboard"); // AppRouter lo mapea a /dashboard
    } else {
      nav("/dashboard"); // fallback directo por ruta
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user: fbUser } = await signInWithEmailAndPassword(auth, email, password);

      const user = {
        email: fbUser.email,
        uid: fbUser.uid,
        role: "inspector", // TODO: si usas Firestore, trae el rol real
      };

      // Persistencia básica
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          name: user.email?.split("@")[0] || "Usuario",
          email: user.email,
        })
      );

      // Notifica arriba y navega
      onLoginSuccess?.(user);
      goDashboard();
    } catch (err) {
      console.error(err);
      setError("Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-950 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-neutral-900 shadow-lg rounded-2xl p-8 w-full max-w-md border border-slate-200/60 dark:border-neutral-800">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="QF Logo" className="h-16 mb-2" />
          <h1 className="text-xl font-semibold text-teal-600 dark:text-teal-400">
            Farmacia Magistral
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 rounded-md transition duration-200"
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="text-sm mt-4 text-center text-slate-600 dark:text-slate-300">
          ¿No tienes cuenta?{" "}
          <span
            onClick={() =>
              typeof onNavigate === "function" ? onNavigate("/register") : nav("/register")
            }
            className="text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}





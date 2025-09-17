// src/components/Sidebar/Sidebar.jsx
// src/components/Sidebar/Sidebar.jsx
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  CheckCircle,
  LogOut
} from "lucide-react";
import SidebarItem from "./SidebarItem";

const Sidebar = ({ onNavigate, onLogout }) => {
  const [expanded, setExpanded] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedInfo = localStorage.getItem("userInfo");
    if (storedInfo) setUserInfo(JSON.parse(storedInfo));

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const localData = localStorage.getItem("userInfo");
        if (localData) {
          setUserInfo(JSON.parse(localData));
        } else {
          setUserInfo({ name: "Usuario", email: user.email });
        }
      } else {
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <aside
      className={`min-h-screen transition-all duration-300 ${
        expanded ? "w-64" : "w-20"
      } bg-gradient-to-b from-white via-gray-50 to-gray-100 border-r shadow-lg flex flex-col`}
    >
      {/* Contenedor superior con scroll */}
      <div className="flex-1 overflow-y-auto sidebar-scroll">
        {/* Logo y botón */}
        <div className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <img
            src="/logo-qf.png"
            className={`transition-all duration-300 ${
              expanded ? "w-32 opacity-100" : "w-0 opacity-0"
            } overflow-hidden`}
            alt="logo"
          />
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-600 hover:text-purple-600 text-xl transition-colors"
          >
            {expanded ? "⏴" : "☰"}
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-1 px-2 py-3">
          <SidebarItem icon={LayoutDashboard} text="Dashboard" onClick={() => onNavigate("dashboard")} expanded={expanded} />
          <SidebarItem icon={ClipboardList} text="Inspecciones" onClick={() => onNavigate("inspecciones")} expanded={expanded} />
          <SidebarItem icon={CheckCircle} text="Aprobadas" onClick={() => onNavigate("aprobadas")} expanded={expanded} />
          <SidebarItem icon={FileText} text="Reportes PDF" onClick={() => onNavigate("reportes")} expanded={expanded} />
          <SidebarItem icon={FileText} text="Formularios" onClick={() => onNavigate("formulario")} expanded={expanded} />
          <SidebarItem icon={FileText} text="Form Builder" onClick={() => onNavigate("formBuilder")} expanded={expanded} />
        </nav>
      </div>

      {/* Bloque inferior */}
      <div className="p-3 border-t bg-white/80 backdrop-blur-md">
        <SidebarItem
          icon={LogOut}
          text="Cerrar sesión"
          onClick={handleLogout}
          expanded={expanded}
        />

        {userInfo && (
          <div
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 transition-colors ${
              expanded ? "mt-2" : "mt-4 justify-center"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white shadow-md">
              {userInfo.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </div>
            {expanded && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {userInfo.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;


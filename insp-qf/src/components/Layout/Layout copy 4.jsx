// src/components/Layout/Layout.jsx
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Sidebar/Header";

const Layout = ({ children, user, onLogout, onNavigate, currentView }) => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar fijo */}
      <div className="fixed top-0 left-0 h-screen">
        <Sidebar
          onNavigate={onNavigate}
          onLogout={onLogout}
          currentView={currentView}
        />
      </div>

      {/* Contenido principal con margen a la izquierda para el sidebar */}
      <div className="flex-1 flex flex-col min-w-0 ml-64">
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;



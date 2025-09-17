// src/components/Layout/Layout.jsx
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Sidebar/Header";

const Layout = ({ children, user, onLogout, onNavigate, currentView }) => {
  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <Sidebar onNavigate={onNavigate} onLogout={onLogout} currentView={currentView} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;



// src/components/Layout/Layout.jsx
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Sidebar/Header";

const Layout = ({ children, user, onLogout, onNavigate, currentView }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onNavigate={onNavigate} currentView={currentView} />
      <div className="flex flex-col flex-1">
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;


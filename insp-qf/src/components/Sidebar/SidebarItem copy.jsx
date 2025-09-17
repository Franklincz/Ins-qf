// src/components/Sidebar/SidebarItem.jsx
import { useEffect, useRef } from "react";

const SidebarItem = ({ icon: Icon, text, active, expanded, onClick }) => {
  const textRef = useRef(null);

  // Efecto para ajustar ancho del texto al expandir/cerrar
  useEffect(() => {
    if (textRef.current && expanded) {
      textRef.current.style.width = "0";
      setTimeout(() => {
        textRef.current.style.width = "auto";
      }, 10);
    }
  }, [expanded]);

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
        active
          ? "bg-purple-100 text-purple-700 font-medium"
          : "hover:bg-gray-100 text-gray-600"
      } ${expanded ? "px-3" : "justify-center px-2"}`}
      title={!expanded ? text : ""}
    >
      <Icon size={20} className="min-w-[20px] flex-shrink-0" />
      {expanded && (
        <span
          ref={textRef}
          className="whitespace-nowrap overflow-hidden transition-all duration-300"
          style={{
            opacity: expanded ? 1 : 0,
            width: expanded ? "auto" : "0",
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default SidebarItem;






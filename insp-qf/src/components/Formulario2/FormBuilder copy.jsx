import React, { useState } from "react";
import Sidebar from "./Sidebar";
import FormCanvas from "./FormCanvas";
import Topbar from "./Topbar";

export default function FormBuilder() {
  // Estado para manejar los campos dinámicos del formulario
  const [fields, setFields] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);

  // Función para agregar campos al lienzo
  const addField = (type) => {
    setFields((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        label: `${type} Field`,
        options: type === "Radio" || type === "Dropdown" ? ["Option 1", "Option 2"] : [],
      },
    ]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar izquierdo */}
      <Sidebar addField={addField} />

      {/* Área principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <Topbar
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          onSave={() => alert("Form saved!")}
        />

        {/* Canvas para formulario */}
        <FormCanvas fields={fields} previewMode={previewMode} />
      </div>
    </div>
  );
}


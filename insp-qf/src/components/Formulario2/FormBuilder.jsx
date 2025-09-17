import React, { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import FormCanvas from "./FormCanvas";
import FieldSettings from "./FieldSettings";
import html2pdf from "html2pdf.js";

export default function FormBuilderPro() {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const canvasRef = useRef(null);

  const addField = (type) => {
    setFields((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        label: `${type} Field`,
        color: "#000000",
        fontSize: "text-xl",
        alignment: "text-left",
        options:
          type === "Radio" || type === "Checkbox" || type === "Table"
            ? ["Option 1", "Option 2"]
            : [],
      },
    ]);
  };

  const updateField = (id, key, value) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
    if (selectedField && selectedField.id === id) {
      setSelectedField((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSavePDF = () => {
    if (canvasRef.current) {
      html2pdf().from(canvasRef.current).save("formulario.pdf");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar addField={addField} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          onSave={handleSavePDF}
        />

        <div className="flex flex-1 overflow-hidden">
          <FormCanvas
            fields={fields}
            setSelectedField={setSelectedField}
            previewMode={previewMode}
            canvasRef={canvasRef}
          />

          <FieldSettings
            selectedField={selectedField}
            updateField={updateField}
          />
        </div>
      </div>
    </div>
  );
}





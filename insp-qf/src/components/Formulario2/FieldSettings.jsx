import React from "react";

export default function FieldSettings({ selectedField, updateField }) {
  if (!selectedField) {
    return (
      <div className="w-64 bg-white border-l p-4">
        <p className="text-gray-400 text-center mt-10">Select a field to edit</p>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-l p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Field Settings</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700">Label / Text</label>
        <input
          type="text"
          value={selectedField.label}
          onChange={(e) => updateField(selectedField.id, "label", e.target.value)}
          className="w-full border rounded px-2 py-1 mt-1"
        />
      </div>

      {(selectedField.type === "Title" || selectedField.type === "Header") && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="color"
              value={selectedField.color || "#000000"}
              onChange={(e) => updateField(selectedField.id, "color", e.target.value)}
              className="w-full h-10 rounded mt-1 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Font Size</label>
            <select
              value={selectedField.fontSize || "text-xl"}
              onChange={(e) => updateField(selectedField.id, "fontSize", e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
            >
              <option value="text-lg">Small</option>
              <option value="text-xl">Medium</option>
              <option value="text-2xl">Large</option>
              <option value="text-3xl">Extra Large</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Alignment</label>
            <select
              value={selectedField.alignment || "text-left"}
              onChange={(e) => updateField(selectedField.id, "alignment", e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
            >
              <option value="text-left">Left</option>
              <option value="text-center">Center</option>
              <option value="text-right">Right</option>
            </select>
          </div>
        </>
      )}

{selectedField.type === "MatrixCNC" && (
  <div className="space-y-2">
    <p className="font-medium text-gray-700">Preguntas</p>

    {(selectedField.rows || []).map((row, idx) => (
      <input
        key={idx}
        value={row}
        onChange={(e) => {
          const updated = [...(selectedField.rows || [])];
          updated[idx] = e.target.value; // 🔹 Actualiza el texto de la pregunta
          updateField(selectedField.id, "rows", updated);
        }}
        className="w-full border rounded px-2 py-1"
      />
    ))}

    <button
      type="button"
      onClick={() =>
        updateField(selectedField.id, "rows", [
          ...(selectedField.rows || []),
          "Nueva pregunta"
        ])
      }
      className="text-blue-600 text-sm hover:underline"
    >
      + Agregar Pregunta
    </button>

    <p className="font-medium text-gray-700 mt-4">Columnas</p>
    {(selectedField.columns || []).map((col, idx) => (
      <input
        key={idx}
        value={col}
        onChange={(e) => {
          const updated = [...(selectedField.columns || [])];
          updated[idx] = e.target.value; // 🔹 Actualiza el nombre de la columna
          updateField(selectedField.id, "columns", updated);
        }}
        className="w-full border rounded px-2 py-1"
      />
    ))}
  </div>
)}




    </div>
  );
}


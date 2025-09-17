// src/components/FormBuilderPro/fields/renderField.js
import React from "react";

export function renderField(field, previewMode, onSelect) {
  const baseProps = {
    onClick: () => !previewMode && onSelect(field),
    className: `mb-4 cursor-pointer`,
  };

  switch (field.type) {
    case "Logo":
      return (
        <div {...baseProps} className="h-16 border-b border-gray-300 flex items-center justify-center text-gray-400">
          Company Logo
        </div>
      );
    case "Title":
      return (
        <h1
          {...baseProps}
          className={`${field.fontSize || "text-2xl"} font-bold ${field.alignment || "text-center"}`}
          style={{ color: field.color || "#000000" }}
        >
          {field.label}
        </h1>
      );
    case "Header":
      return (
        <h2
          {...baseProps}
          className={`${field.fontSize || "text-lg"} font-semibold ${field.alignment || "text-left"} border-b pb-1`}
          style={{ color: field.color || "#000000" }}
        >
          {field.label}
        </h2>
      );
    case "Text":
      return (
        <input
          {...baseProps}
          type="text"
          placeholder={field.label}
          className="w-full border rounded px-3 py-2"
          disabled={previewMode}
        />
      );
    case "Checkbox":
      return (
        <label {...baseProps} className="flex items-center gap-2 text-gray-700">
          <input type="checkbox" disabled={previewMode} /> {field.label}
        </label>
      );
    case "Radio":
      return (
        <div {...baseProps} className="flex gap-4">
          {field.options.map((opt, idx) => (
            <label key={idx} className="flex items-center gap-1">
              <input type="radio" name={`radio-${field.id}`} disabled={previewMode} />
              {opt} / {opt === "Option 1" ? "English" : "العربية"}
            </label>
          ))}
        </div>
      );
    case "Dropdown":
      return (
        <select {...baseProps} className="w-full border rounded px-3 py-2" disabled={previewMode}>
          {field.options.map((opt, idx) => (
            <option key={idx}>{opt}</option>
          ))}
        </select>
      );
    case "Table":
      return (
        <table {...baseProps} className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {field.options.map((opt, idx) => (
                <th key={idx} className="border border-gray-300 px-2 py-1">{opt}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {field.options.map((_, idx) => (
                <td key={idx} className="border border-gray-300 px-2 py-1">
                  {previewMode ? "" : <input className="w-full border rounded px-1 py-0.5" />}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      );
    case "Signature":
      return (
        <div {...baseProps} className="border-dashed border-2 border-gray-300 h-20 rounded-lg flex items-center justify-center text-gray-400">
          Signature
        </div>
      );
    case "MatrixCNC":
  return (
    <div {...baseProps} className="overflow-x-auto">
      <p className="mb-2 font-semibold text-gray-700">{field.label}</p>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-2 py-1 text-left">Pregunta</th>
            {field.columns.map((col, idx) => (
              <th key={idx} className="border border-gray-300 px-2 py-1">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {field.rows.map((row, rIdx) => (
            <tr key={rIdx}>
              <td className="border border-gray-300 px-2 py-1">{row}</td>
              {field.columns.map((col, cIdx) => (
                <td key={cIdx} className="border border-gray-300 px-2 py-1 text-center">
                  <input
                    type="radio"
                    name={`matrix-${field.id}-row${rIdx}`}
                    disabled={previewMode}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

    default:
      return null;
  }
}


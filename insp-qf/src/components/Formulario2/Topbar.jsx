import React from "react";

export default function Topbar({ previewMode, setPreviewMode, onSave }) {
  return (
    <div className="flex justify-between items-center bg-white px-6 py-3 border-b shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">Form Builder Pro</h1>
      <div className="flex gap-3">
        <button
          className={`px-4 py-2 rounded-lg border ${
            previewMode ? "bg-blue-100" : "bg-white"
          } hover:bg-blue-50`}
          onClick={() => setPreviewMode(!previewMode)}
        >
          {previewMode ? "Exit Preview" : "Preview Mode"}
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
        >
          Save as PDF
        </button>
      </div>
    </div>
  );
}



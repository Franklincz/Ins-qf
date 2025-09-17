import React from "react";
import { renderField } from "./fields/renderField";

export default function FormCanvas({ fields, setSelectedField, previewMode, canvasRef }) {
  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
      <div
        ref={canvasRef}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200"
      >
        <h2 className="text-center text-gray-700 text-xl font-bold mb-6">
          Form Preview
        </h2>

        {fields.length === 0 && (
          <p className="text-center text-gray-400">
            Add fields from the sidebar to start building your form
          </p>
        )}

        {fields.map((field) => (
          <div key={field.id}>
            {renderField(field, previewMode, setSelectedField)}
          </div>
        ))}
      </div>
    </div>
  );
}




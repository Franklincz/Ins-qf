import React from "react";

export default function FieldCard({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 bg-gray-50 hover:bg-blue-50 rounded-lg shadow-sm border hover:shadow-md transition"
    >
      {icon}
      <span className="text-gray-700 text-sm">{label}</span>
    </button>
  );
}


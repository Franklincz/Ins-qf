import React from "react";
import FieldCard from "./FieldCard";
import { fieldTypes } from "./fields/fieldTypes";

export default function Sidebar({ addField }) {
  return (
    <div className="w-72 bg-white shadow-lg p-4 overflow-y-auto border-r">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Add Elements</h2>
      <div className="grid grid-cols-1 gap-2">
        {fieldTypes.map((f) => (
          <FieldCard key={f.type} icon={f.icon} label={f.label} onClick={() => addField(f.type)} />
        ))}
      </div>
    </div>
  );
}



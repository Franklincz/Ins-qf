// src/components/FormBuilderPro/fields/fieldTypes.js
import {
  Type,
  Heading,
  List,
  CheckSquare,
  Circle,
  Table,
  Image,
  PenTool,
} from "lucide-react";

export const fieldTypes = [
  { type: "Logo", label: "Logo", icon: <Image size={18} /> },
  { type: "Title", label: "Title", icon: <Heading size={18} /> },
  { type: "Header", label: "Header", icon: <Heading size={18} /> },
  { type: "Text", label: "Text", icon: <Type size={18} /> },
  { type: "Dropdown", label: "Dropdown", icon: <List size={18} /> },
  { type: "Checkbox", label: "Checkbox", icon: <CheckSquare size={18} /> },
  { type: "Radio", label: "Radio", icon: <Circle size={18} /> },
  { type: "Table", label: "Table", icon: <Table size={18} /> },
  { type: "Signature", label: "Signature", icon: <PenTool size={18} /> },
  { type: "MatrixCNC", label: "Checklist C/NC", icon: <Table size={18} /> },

];

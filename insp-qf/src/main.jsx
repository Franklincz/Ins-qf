// src/main.jsx
import React, { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import GlobalStyles from "./global.style.js";
import AppRouter from "./router/AppRouter.jsx";

// Formulario: estado y helpers
import {
  initialFormData,
  handleSimpleChange,
  handleChange as inspectionHandleChange,
} from "./components/formulario/Inspection/Inspection.style.js";

const Root = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ---- ESTADO DEL FORMULARIO (como ya lo tenías) ----
  const [formData, setFormData] = useState(initialFormData);
  const [questionnaire, setQuestionnaire] = useState({});
  const [productData, setProductData] = useState({ product: "", lot: "", date: "", area: "" });
  const [signatures, setSignatures] = useState({ assistant: "", chief: "" });
  const [observations, setObservations] = useState("");
  const [images, setImages] = useState([]);
  const [editingReportId, setEditingReportId] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Cargar usuario
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  // Auth handlers
  const handleLoginSuccess = (firebaseUser) => {
    // nombre amigable desde displayName o email
    const niceName =
      firebaseUser.displayName?.trim() ||
      (firebaseUser.email ? firebaseUser.email.split("@")[0] : "")
        .replace(/[._-]+/g, " ")
        .trim() ||
      "Usuario";

    const userInfo = { name: niceName, email: firebaseUser.email || "" };
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ---- Handlers de formulario (como ya los tenías) ----
  const handleQuestionnaireChange = (_, question, value) =>
    setQuestionnaire((prev) => ({ ...prev, [question]: value }));

  const handleProductDataChange = (field, value) =>
    setProductData((p) => ({ ...p, [field]: value }));

  const handleDefectChange = (defectType, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [defectType]: { ...prev[defectType], [index]: { ...prev[defectType]?.[index], ...value } },
    }));
  };

  const handleSignatureChange = (role, value) => setSignatures((p) => ({ ...p, [role]: value }));
  const handleObservationsChange = setObservations;
  const handleAddImages = (newImages) => setImages((p) => [...p, ...newImages]);
  const handleRemoveImage = (i) => setImages((p) => p.filter((_, idx) => idx !== i));
  const handleRemoveSelectedImages = (sel) =>
    setImages((p) => p.filter((_, idx) => !sel.includes(idx)));

  const handleHistoryClick = () => setIsHistoryOpen(true);
  const handleCloseHistory = () => setIsHistoryOpen(false);

  const handleHistoryItemSelect = (item) => {
    setEditingReportId(item.id);
    setProductData({
      product: item.product || "",
      lot: item.lot || "",
      date: item.date || "",
      area: item.area || "",
    });
    if (item.questionnaire) setQuestionnaire(item.questionnaire);
    if (item.signatures) setSignatures(item.signatures);
    if (item.observations) setObservations(item.observations);
    if (item.images) setImages(item.images);
    setFormData((prev) => ({ ...prev, ...item }));
  };

  // ---------------- NUEVO: reset centralizado para todo el formulario ----------------
  // Llama a este callback desde Buttons.jsx vía props (onResetForm) después de guardar.
  const resetFormAll = () => {
    setFormData(initialFormData);
    setQuestionnaire({});
    setProductData({ product: "", lot: "", date: "", area: "" });
    setSignatures({ assistant: "", chief: "" });
    setObservations("");
    setImages([]);
    setEditingReportId(null);
    setIsHistoryOpen(false);
  };
  // -----------------------------------------------------------------------------------

  if (isLoading) return <div />;

  // Props empaquetadas para el formulario
  const formProps = {
    productData,
    onProductDataChange: handleProductDataChange,
    questionnaire,
    onQuestionnaireChange: handleQuestionnaireChange,
    formData,
    onInspectionChange: (section, field, value) =>
      inspectionHandleChange(section, field, value, setFormData),
    onSimpleChange: (field, value) => handleSimpleChange(field, value, setFormData),
    onDefectChange: handleDefectChange,
    observations,
    onObservationsChange: handleObservationsChange,
    images,
    onAddImages: handleAddImages,
    onRemoveImage: handleRemoveImage,
    onRemoveSelectedImages: handleRemoveSelectedImages,
    signatures,
    onSignatureChange: handleSignatureChange,
    editingReportId,
    isHistoryOpen,
    onHistoryClick: handleHistoryClick,
    onCloseHistory: handleCloseHistory,
    onHistoryItemSelect: handleHistoryItemSelect,

    // ---------- NUEVO: callback para resetear todo desde componentes hijos ----------
    onResetForm: resetFormAll,
  };

  return (
    <AppRouter
      user={user}
      onLoginSuccess={handleLoginSuccess}
      onLogout={handleLogout}
      formProps={formProps}
    />
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalStyles />
      <Root />
    </BrowserRouter>
  </StrictMode>
);

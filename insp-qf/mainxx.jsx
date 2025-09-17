import React, { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import GlobalStyles from "./global.style.js";

import Layout from "./components/Layout/Layout";
import Login from "./components/Auth/Login";
import Registro from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";

// Formulario original
import Cabecera from "./components/formulario/Cabecera/Cabecera.jsx";
import Header from "./components/formulario/header/Header.jsx";
import ProductSection from "./components/formulario/productSection/ProductoSection.jsx";
import QuestionnaireSection from "./components/formulario/QuestionnaireSection/QuestionnaireSection.jsx";
import Inspection from "./components/formulario/Inspection/Inspection.jsx";
import DefectsSection from "./components/formulario/Defectos/Defectos.jsx";
import Observations from "./components/formulario/Observation/Observation.jsx";
import Evidence from "./components/formulario/Evidence/Evidence.jsx";
import Firmas from "./components/formulario/Firma/Firmas.jsx";
import Buttons from "./components/formulario/Buttons/Buttons.jsx";
import HistoryModal from "./components/formulario/History/HistoryModal.jsx";

// Nuevo Formulario2
import FormBuilder from "./components/Formulario2/FormBuilder.jsx";
import FormRender from "./components/Formulario2/FormRender.jsx";

// Estado y helpers del formulario
import {
  initialFormData,
  handleSimpleChange,
  handleChange as inspectionHandleChange,
} from "./components/formulario/Inspection/Inspection.style.js";

const Root = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");

  // --- Normalización de vistas (Opción B) ---
  const normalizeView = (view) => {
    const map = {
      // Abrir el formulario (sinónimos)
      formularios: "formulario",
      inspecciones: "formulario",
      inspections: "formulario",
      // otras vistas conocidas (idempotentes)
      formulario: "formulario",
      dashboard: "dashboard",
      formBuilder: "formBuilder",
      reportes: "reportes",
      aprobadas: "aprobadas",
      register: "register",
      login: "login",
    };
    return map[view] || view;
  };

  const handleNavigate = (view) => setCurrentView(normalizeView(view));

  // Estados para formulario de inspección
  const [formData, setFormData] = useState(initialFormData);
  const [questionnaire, setQuestionnaire] = useState({});
  const [productData, setProductData] = useState({
    product: "", lot: "", date: "", area: "",
  });
  const [signatures, setSignatures] = useState({ assistant: "", chief: "" });
  const [observations, setObservations] = useState("");
  const [images, setImages] = useState([]);
  const [editingReportId, setEditingReportId] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Cargar usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  // Auth handlers
  const handleLoginSuccess = (firebaseUser) => {
    const userInfo = {
      name: firebaseUser.displayName || "Usuario",
      email: firebaseUser.email,
    };
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCurrentView("dashboard");
  };

  // Form handlers
  const handleQuestionnaireChange = (_, question, value) =>
    setQuestionnaire((prev) => ({ ...prev, [question]: value }));

  const handleProductDataChange = (field, value) =>
    setProductData((p) => ({ ...p, [field]: value }));

  const handleDefectChange = (defectType, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [defectType]: {
        ...prev[defectType],
        [index]: { ...prev[defectType]?.[index], ...value },
      },
    }));
  };

  const handleSignatureChange = (role, value) =>
    setSignatures((p) => ({ ...p, [role]: value }));

  const handleObservationsChange = setObservations;
  const handleAddImages = (newImages) => setImages((p) => [...p, ...newImages]);
  const handleRemoveImage = (i) => setImages((p) => p.filter((_, idx) => idx !== i));
  const handleRemoveSelectedImages = (sel) =>
    setImages((p) => p.filter((_, idx) => !sel.includes(idx)));

  // Historial modal
  const handleHistoryClick = () => setIsHistoryOpen(true);
  const handleCloseHistory = () => setIsHistoryOpen(false);
  const handleHistoryItemSelect = (item) => {
    setEditingReportId(item.id);
    setProductData({
      product: item.product || "", lot: item.lot || "",
      date: item.date || "", area: item.area || "",
    });
    if (item.questionnaire) setQuestionnaire(item.questionnaire);
    if (item.signatures) setSignatures(item.signatures);
    if (item.observations) setObservations(item.observations);
    if (item.images) setImages(item.images);
    setFormData((prev) => ({ ...prev, ...item }));
  };

  // Render principal
  if (isLoading) return <div />;

  if (!user) {
    return currentView === "register" ? (
      <Registro onNavigate={handleNavigate} />
    ) : (
      <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />
    );
  }

  if (currentView === "dashboard") {
    return (
      <Layout
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentView={currentView}
      >
        {/* Dashboard ahora es SOLO contenido */}
        <Dashboard />
      </Layout>
    );
  }

  if (currentView === "formulario") {
    return (
      <Layout
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentView={currentView}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Cabecera onHistoryClick={handleHistoryClick} />
          <Header />

          <ProductSection
            product={productData.product}
            lot={productData.lot}
            date={productData.date}
            area={productData.area}
            onProductChange={(v) => handleProductDataChange("product", v)}
            onLotChange={(v) => handleProductDataChange("lot", v)}
            onDateChange={(v) => handleProductDataChange("date", v)}
            onAreaChange={(v) => handleProductDataChange("area", v)}
          />

          <QuestionnaireSection
            questionnaire={questionnaire}
            onChange={handleQuestionnaireChange}
          />

          <Inspection
            formData={formData}
            handleChange={(section, field, value) =>
              inspectionHandleChange(section, field, value, setFormData)
            }
            handleSimpleChange={(field, value) =>
              handleSimpleChange(field, value, setFormData)
            }
          />

          <DefectsSection
            formData={formData}
            handleChange={handleDefectChange}
            handleSimpleChange={(field, value) =>
              handleSimpleChange(field, value, setFormData)
            }
          />

          <Observations
            observations={observations}
            onChange={handleObservationsChange}
          />

          <Evidence
            images={images}
            onAddImages={handleAddImages}
            onRemoveImage={handleRemoveImage}
            onRemoveSelectedImages={handleRemoveSelectedImages}
          />

          <Firmas
            signatures={signatures}
            onSignatureChange={handleSignatureChange}
          />

          <Buttons
            formData={{
              ...formData,
              ...productData,
              questionnaire,
              images,
              signatures,
              observations,
            }}
            editingReportId={editingReportId}
          />

          <HistoryModal
            isOpen={isHistoryOpen}
            onClose={handleCloseHistory}
            onSelectItem={handleHistoryItemSelect}
          />
        </div>
      </Layout>
    );
  }

  if (currentView === "formBuilder") {
    return (
      <Layout
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentView={currentView}
      >
        <FormBuilder onNavigate={handleNavigate} />
        <FormRender />
      </Layout>
    );
  }

  return null;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalStyles />
      <Root />
    </BrowserRouter>
  </StrictMode>
);



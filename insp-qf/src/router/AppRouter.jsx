// src/components/routes/AppRouter.jsx
// src/router/AppRouter.jsx
// src/router/AppRouter.jsx
import { Suspense } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
//
import PdfReports from "../components/Reports/PdfReports";

import Layout from "../components/Layout/Layout";
import Login from "../components/Auth/Login";
import Registro from "../components/Auth/Register";
import Dashboard from "../components/Dashboard/Dashboard";

// --- Secciones del formulario (usa los paths exactos que ya tienes) ---
import Cabecera from "../components/formulario/Cabecera/Cabecera.jsx";
import Header from "../components/formulario/header/Header.jsx";
import ProductSection from "../components/formulario/productSection/ProductoSection.jsx";
import QuestionnaireSection from "../components/formulario/QuestionnaireSection/QuestionnaireSection.jsx";
import Inspection from "../components/formulario/Inspection/Inspection.jsx";
import DefectsSection from "../components/formulario/Defectos/Defectos.jsx";
import Observations from "../components/formulario/Observation/Observation.jsx";
import Evidence from "../components/formulario/evidence/Evidence.jsx"; // carpeta en minúsculas
import Firmas from "../components/formulario/Firma/Firmas.jsx";
import Buttons from "../components/formulario/Buttons/Buttons.jsx";
import HistoryModal from "../components/formulario/History/HistoryModal.jsx";

// Ruta protegida simple
function ProtectedRoute({ user }) {
  return user ? <Outlet /> : <Navigate to="/" replace />;
}

// Página de Formulario ensamblada aquí para no depender de otro archivo
function FormularioPage({ formProps }) {
  const {
    productData,
    onProductDataChange,
    questionnaire,
    onQuestionnaireChange,
    formData,
    onInspectionChange,
    onSimpleChange,
    onDefectChange,
    observations,
    onObservationsChange,
    images,
    onAddImages,
    onRemoveImage,
    onRemoveSelectedImages,
    signatures,
    onSignatureChange,
    editingReportId,
    isHistoryOpen,
    onHistoryClick,
    onCloseHistory,
    onHistoryItemSelect,
  } = formProps;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <Cabecera onHistoryClick={onHistoryClick} />
      <Header />

      <ProductSection
        product={productData.product}
        lot={productData.lot}
        date={productData.date}
        area={productData.area}
        onProductChange={(v) => onProductDataChange("product", v)}
        onLotChange={(v) => onProductDataChange("lot", v)}
        onDateChange={(v) => onProductDataChange("date", v)}
        onAreaChange={(v) => onProductDataChange("area", v)}
      />

      <QuestionnaireSection
        questionnaire={questionnaire}
        onChange={onQuestionnaireChange}
      />

      <Inspection
        formData={formData}
        handleChange={onInspectionChange}
        handleSimpleChange={onSimpleChange}
      />

      <DefectsSection
        formData={formData}
        handleChange={onDefectChange}
        handleSimpleChange={onSimpleChange}
      />

      <Observations
        observations={observations}
        onChange={onObservationsChange}
      />

      <Evidence
        images={images}
        onAddImages={onAddImages}
        onRemoveImage={onRemoveImage}
        onRemoveSelectedImages={onRemoveSelectedImages}
      />

      <Firmas
        signatures={signatures}
        onSignatureChange={onSignatureChange}
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
        onClose={onCloseHistory}
        onSelectItem={onHistoryItemSelect}
      />
    </div>
  );
}

export default function AppRouter({
  user,
  onLoginSuccess,
  onLogout,
  formProps, // viene desde main.jsx
}) {
  const navigate = useNavigate();

  // Mapeo clave->ruta para tu Sidebar
  const pathMap = {
    dashboard: "/dashboard",
    formulario: "/formulario",
    formularios: "/formulario",
    inspecciones: "/formulario",
    inspections: "/formulario",
    formBuilder: "/form-builder",
    reportes: "/reportes",   // // ← Reportes PDF
    aprobadas: "/aprobadas", // TODO: crea vista cuando toque
  };

  const handleNavigate = (keyOrPath) => {
    const path = pathMap[keyOrPath] || keyOrPath || "/dashboard";
    navigate(path);
  };

  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Cargando…</div>}>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Login onLoginSuccess={onLoginSuccess} onNavigate={handleNavigate} />} />
        <Route path="/register" element={<Registro onNavigate={handleNavigate} />} />

        {/* Protegidas */}
        <Route element={<ProtectedRoute user={user} />}>
          {/* Layout persistente para todo lo interno */}
          <Route
            element={
              <Layout
                user={user}
                onLogout={onLogout}
                onNavigate={handleNavigate}
                currentView=""
              />
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/formulario" element={<FormularioPage formProps={formProps} />} />

             {/* NUEVO: listado + visor de PDFs */}
            <Route path="/reportes" element={<PdfReports />} />
            {/* <Route path="/reportes" element={<div className="p-6">Reportes</div>} /> */}
            {/* <Route path="/aprobadas" element={<div className="p-6">Aprobadas</div>} /> */}

            {/* por defecto, redirige al dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Suspense>
  );
}



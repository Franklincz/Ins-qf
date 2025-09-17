// Formulario original (ajustado a tu estructura real)
import Cabecera from "./components/formulario/Cabecera/Cabecera.jsx";
import Header from "./components/formulario/header/Header.jsx";
import ProductSection from "./components/formulario/productSection/ProductoSection.jsx";
import QuestionnaireSection from "./components/formulario/QuestionnaireSection/QuestionnaireSection.jsx";
import Inspection from "./components/formulario/Inspection/Inspection.jsx";
import DefectsSection from "./components/formulario/Defectos/Defectos.jsx";
import Observations from "./components/formulario/Observation/Observation.jsx";
import Evidence from "./components/formulario/evidence/Evidence.jsx"; // <-- minúsculas
import Firmas from "./components/formulario/Firma/Firmas.jsx";
import Buttons from "./components/formulario/Buttons/Buttons.jsx";
import HistoryModal from "./components/formulario/History/HistoryModal.jsx";


const AppRouter = ({ user, onLoginSuccess, onLogout }) => {
  return (
    <Routes>
      <Route path="/" element={<Login onLoginSuccess={onLoginSuccess} />} />
      <Route element={<ProtectedRoute user={user} />}>
        <Route path="/dashboard" element={<Dashboard user={user} onLogout={onLogout} />} />
        <Route path="/formulario" element={<Formulario />} />
        {/* otras rutas como /reportes, /aprobadas, etc */}
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;

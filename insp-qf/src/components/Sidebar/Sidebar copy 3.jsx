// src/components/Sidebar/Sidebar.jsx
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import {
  LayoutDashboard, FileText, ClipboardList,
  CheckCircle, LogOut, Menu, ChevronLeft
} from "lucide-react";
import styled from "styled-components";
import SidebarItem from "./SidebarItem";

const NAV = [
  { key: "dashboard",     label: "Dashboard",     icon: LayoutDashboard },
  { key: "inspecciones",  label: "Inspecciones",  icon: ClipboardList },
  { key: "aprobadas",     label: "Aprobadas",     icon: CheckCircle },
  { key: "reportes",      label: "Reportes PDF",  icon: FileText },
  { key: "formularios",   label: "Formularios",   icon: FileText },
  { key: "formBuilder",   label: "Form Builder",  icon: FileText },
];

const WIDTH_EXPANDED  = 288;
const WIDTH_COLLAPSED = 80;

export default function Sidebar({
  onNavigate,
  onLogout,
  /** control externo opcional (desktop ancho) */
  isOpen,
  setIsOpen,
  /** control externo opcional (drawer móvil) */
  mobileOpen,
  setMobileOpen,
  /** si true, agrega el Spacer (compatibilidad) */
  useSpacer = false,
}) {
  /* ---------- Estado desktop (expandido/colapsado) ---------- */
  const [internalOpen, setInternalOpen] = useState(true);
  const expanded    = isOpen    ?? internalOpen;
  const setExpanded = setIsOpen ?? setInternalOpen;

  // Persistencia SOLO cuando no está controlado desde fuera
  useEffect(() => {
    if (setIsOpen) return;
    const saved = localStorage.getItem("sidebar:expanded");
    if (saved !== null) setInternalOpen(saved === "true");
  }, [setIsOpen]);
  useEffect(() => {
    if (setIsOpen) return;
    localStorage.setItem("sidebar:expanded", String(internalOpen));
  }, [internalOpen, setIsOpen]);

  /* ---------- Estado móvil (drawer) ---------- */
  const [internalMobile, setInternalMobile] = useState(false);
  const mOpen    = mobileOpen    ?? internalMobile;
  const setMOpen = setMobileOpen ?? setInternalMobile;

  /* ---------- Auth / usuario ---------- */
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUserInfo(JSON.parse(stored));
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        const localData = localStorage.getItem("user");
        setUserInfo(localData ? JSON.parse(localData) : { name: "Usuario", email: u.email });
      } else setUserInfo(null);
    });
    return () => unsub();
  }, []);

  const currentKey = useMemo(() => "", []);

  const handleLogout = async () => {
    await signOut(auth);
    onLogout?.();
    // si estamos en móvil, cerrar el drawer
    setMOpen(false);
  };

  /* ---------- Render ---------- */
  return (
    <>
      {/* Topbar móvil (lo mantengo, por si usas el Sidebar standalone en otra pantalla).
          En tu Layout actual no se verá porque el contenedor del sidebar es w-0 en mobile. */}
      <TopbarMobile>
        <IconButton onClick={() => setMOpen(true)} aria-label="Abrir menú">
          <Menu size={22} />
        </IconButton>
        <BrandText>Farmacia Magistral</BrandText>
        <div style={{ width: 40 }} />
      </TopbarMobile>

      {/* Drawer móvil (controlado) */}
      <MobileAside className="sidebar-transition" data-open={mOpen} aria-label="Menú">
        <Header>
          <BrandRow>
            <BrandLogo src="/logo-qf.png" alt="QF" />
            <BrandName>QF</BrandName>
          </BrandRow>
          <IconButton onClick={() => setMOpen(false)} aria-label="Cerrar menú">
            <ChevronLeft size={22} />
          </IconButton>
        </Header>

        <Nav className="sidebar-scroll">
          {NAV.map(({ key, label, icon: Icon }) => (
            <SidebarItem
              key={key}
              icon={Icon}
              text={label}
              expanded
              active={currentKey === key}
              onClick={() => {
                onNavigate?.(key);
                setMOpen(false); // cerrar drawer al navegar
              }}
              size="lg"
            />
          ))}
        </Nav>

        <Footer>
          <SidebarItem
            icon={LogOut}
            text="Cerrar sesión"
            expanded
            onClick={handleLogout}
            size="lg"
          />
          {userInfo && (
            <UserCard>
              <Avatar>
                {(userInfo.name || "U").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
              </Avatar>
              <UserMeta>
                <UserName title={userInfo.name}>{userInfo.name}</UserName>
                <UserEmail title={userInfo.email}>{userInfo.email}</UserEmail>
              </UserMeta>
            </UserCard>
          )}
        </Footer>
      </MobileAside>
      {mOpen && <Backdrop onClick={() => setMOpen(false)} />}

      {/* Sidebar desktop */}
      <DesktopAside className="sidebar-transition" data-expanded={expanded} aria-label="Menú">
        <Header>
          <BrandRow>
            {expanded ? <BrandLogo src="/logo-qf.png" alt="QF" /> : <MiniLogo>QF</MiniLogo>}
          </BrandRow>
          <ToggleButton onClick={() => setExpanded(v => !v)} aria-label="Toggle sidebar">
            {expanded ? "⏴" : "☰"}
          </ToggleButton>
        </Header>

        <Nav className="sidebar-scroll">
          {NAV.map(({ key, label, icon: Icon }) => (
            <SidebarItem
              key={key}
              icon={Icon}
              text={label}
              expanded={expanded}
              active={currentKey === key}
              onClick={() => onNavigate?.(key)}
              size="lg"
            />
          ))}
        </Nav>

        <Footer>
          <SidebarItem
            icon={LogOut}
            text="Cerrar sesión"
            expanded={expanded}
            onClick={handleLogout}
            size="lg"
          />
          {userInfo && (
            <UserCard collapsed={!expanded}>
              <Avatar>
                {(userInfo.name || "U").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
              </Avatar>
              {expanded && (
                <UserMeta>
                  <UserName title={userInfo.name}>{userInfo.name}</UserName>
                  <UserEmail title={userInfo.email}>{userInfo.email}</UserEmail>
                </UserMeta>
              )}
            </UserCard>
          )}
        </Footer>
      </DesktopAside>

      {/* Empuje de contenido: SOLO si lo piden (compatibilidad) */}
      {useSpacer && (
        <Spacer aria-hidden style={{ width: expanded ? WIDTH_EXPANDED : WIDTH_COLLAPSED }} />
      )}
    </>
  );
}

/* ===================== styled-components ===================== */
/* Usa variables definidas en index.css:
   :root{ --sidebar-bg; --sidebar-fg; --sidebar-border; --sidebar-hover; }
   .dark{ (las mismas, con valores dark) }
*/

const TopbarMobile = styled.div`
  position: sticky; top: 0; z-index: 30;
  height: 64px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px;
  background: color-mix(in srgb, var(--sidebar-bg) 85%, transparent);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--sidebar-border);
  @media (min-width: 768px) { display: none; }
`;

const BrandText = styled.div`
  font-weight: 600;
  color: var(--sidebar-fg);
`;

const DesktopAside = styled.aside`
  position: fixed; inset: 0 auto 0 0; z-index: 40; height: 100vh;
  width: 288px;
  background: var(--sidebar-bg);
  color: var(--sidebar-fg);
  border-right: 1px solid var(--sidebar-border);
  display: none; flex-direction: column;
  &[data-expanded="false"] { width: 80px; }
  @media (min-width: 768px) { display: flex; }
`;

const MobileAside = styled.aside`
  position: fixed; inset: 0 auto 0 0; z-index: 50;
  width: 288px;
  background: var(--sidebar-bg);
  color: var(--sidebar-fg);
  border-right: 1px solid var(--sidebar-border);
  transform: translateX(-100%);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  &[data-open="true"] { transform: translateX(0); }
  @media (min-width: 768px) { display: none; }
`;

const Header = styled.div`
  position: sticky; top: 0;
  display:flex; align-items:center; justify-content:space-between;
  padding: 14px;
  background: color-mix(in srgb, var(--sidebar-bg) 92%, transparent);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--sidebar-border);
`;

const BrandRow = styled.div`
  display:flex; align-items:center; gap:10px; min-width:0;
`;

const BrandLogo = styled.img`
  height: 32px; max-width: 140px;
`;

const BrandName = styled.div`
  font-weight: 700; color: #10b981;
`;

const MiniLogo = styled.div`
  height: 40px; width: 40px; border-radius: 999px; display: grid; place-items: center;
  font-weight: 700; color: #10b981; background: rgba(16,185,129,0.12);
`;

const IconButton = styled.button`
  display:inline-flex; align-items:center; justify-content:center;
  height:40px; width:40px; border-radius:12px;
  border: 1px solid var(--sidebar-border);
  background: color-mix(in srgb, var(--sidebar-bg) 96%, transparent);
  color: var(--sidebar-fg);
  cursor:pointer;
`;

const ToggleButton = styled(IconButton)`
  font-weight: 600;
`;

const Nav = styled.nav`
  flex:1; padding: 14px 10px; overflow-y:auto;
`;

const Footer = styled.div`
  padding:14px; border-top:1px solid var(--sidebar-border);
`;

const UserCard = styled.div`
  display:flex; align-items:center; gap:12px; padding:10px; margin-top:10px;
  border-radius:16px; transition: background 150ms ease;
  ${(p)=>p.collapsed ? "justify-content:center;" : ""}
  &:hover { background: var(--sidebar-hover); }
`;

const Avatar = styled.div`
  height:40px; width:40px; border-radius:999px; display:grid; place-items:center;
  background:#10b981; color:#fff; font-weight:700;
`;

const UserMeta = styled.div` min-width:0; `;
const UserName = styled.p` margin:0; font-weight:600; font-size:15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; `;
const UserEmail = styled.p` margin:0; color:#94a3b8; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; `;

const Backdrop = styled.div`
  position: fixed; inset:0; z-index:45; background: rgba(0,0,0,.35);
  @media (min-width: 768px) { display:none; }
`;

const Spacer = styled.div`
  display:none; @media (min-width:768px){ display:block; }
`;


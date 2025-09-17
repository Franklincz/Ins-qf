// src/components/Sidebar/SidebarItem.jsx
import styled, { css } from "styled-components";

export default function SidebarItem({
  icon: Icon,
  text,
  onClick,
  expanded = true,
  active = false,
  size = "lg", // 'md' | 'lg'
}) {
  return (
    <Item
      className="sidebar-transition"
      aria-current={active ? "page" : undefined}
      data-active={active}
      data-size={size}
      onClick={onClick}
      as="button"
      type="button"
    >
      <Icon className="sb-icon" />
      {expanded && <span className="label">{text}</span>}
      {!expanded && <Tooltip className="sidebar-transition">{text}</Tooltip>}
    </Item>
  );
}

/* === sizing variantes === */
const sizing = {
  md: css`
    .sb-icon { width: 18px; height: 18px; }
    font-size: 14px; padding: 10px 12px; gap: 12px; border-radius: 12px;
  `,
  lg: css`
    .sb-icon { width: 22px; height: 22px; }
    font-size: 16px; padding: 12px 14px; gap: 14px; border-radius: 14px;
  `,
};

/* === estilos base === */
const Item = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 4px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  
  color: var(--sidebar-fg);
  border: 1px solid transparent;
  background: transparent;

  ${(p) => sizing[p["data-size"] || "lg"]}

  &:hover {
    background: var(--sidebar-hover);
  }

  &[data-active="true"] {
    background: var(--sidebar-active-bg, rgba(16,185,129,.15));
    color: var(--sidebar-active-fg, #34d399);
    border-color: var(--sidebar-active-border, rgba(16,185,129,.25));
  }

  .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Tooltip = styled.span`
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%) scale(0.95);
  opacity: 0;
  pointer-events: none;

  background: var(--tooltip-bg, #0b1220);
  color: var(--tooltip-fg, #e2e8f0);
  border: 1px solid var(--tooltip-border, rgba(148,163,184,.25));
  box-shadow: 0 8px 24px rgba(0,0,0,.25);

  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  white-space: nowrap;

  ${Item}:hover & {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
`;










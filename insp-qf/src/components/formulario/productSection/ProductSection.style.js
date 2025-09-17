//ProductSection.style.js
import styled from 'styled-components';

// Contenedor principal con grid de 2 columnas
export const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid #d1d5db;
    border-left: 1px solid #d1d5db;
    border-right: 1px solid #d1d5db;
    background-color: #fff;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr 1fr;
        
        grid-template-rows: auto auto;
        border-bottom: 1px solid #d1d5db;
        border-left: 1px solid #d1d5db;
        border-right: 1px solid #d1d5db;
    }
`;

// Columna izquierda
export const LeftColumn = styled.div`
    padding: 0.75rem;
    border-right: 1px solid #d1d5db;
    
    @media (max-width: 768px) {
        padding: 0.5rem;
        border-right: none;
        border-bottom: 1px solid #d1d5db;
    }
`;

// Columna derecha
export const RightColumn = styled.div`
    padding: 0.75rem;
    
    @media (max-width: 768px) {
        padding: 0.5rem;
    }
`;

// Grupo de campo (label + input)
export const FieldGroup = styled.div`
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
        margin-bottom: 0.75rem;
    }
    
    &.mb-4 {
        margin-bottom: 1.5rem;
        
        @media (max-width: 768px) {
            margin-bottom: 1rem;
        }
    }
`;

// Etiqueta del campo
export const Label = styled.p`
    font-weight: 700;
    font-size: 0.875rem;
    color: #000;
    margin: 0 0 0.375rem 0;
    line-height: 1.2;
    
    @media (max-width: 768px) {
        font-size: 0.75rem;
        font-weight: 800;
        margin: 0 0 0.25rem 0;
    }
`;

// Campo de entrada
export const Input = styled.input`
    width: 90%;
    border: 2px solid #000;
    padding: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #000;
    background-color: #fff;
    border-radius: 0;
    outline: none;
    transition: all 0.2s ease;
    
    @media (max-width: 768px) {
        padding: 0.375rem;
        font-size: 0.75rem;
        border: 1.5px solid #000;
        font-weight: 700;
    }
    
    &:focus {
        border-color: #15803d;
        box-shadow: 0 0 0 2px rgba(21, 128, 61, 0.2);
        background-color: #f9fafb;
    }
    
    &::placeholder {
        color: #6b7280;
        font-weight: 500;
        font-style: italic;
        
        @media (max-width: 768px) {
            font-size: 0.625rem;
        }
    }
    
    &[type="date"] {
    cursor: pointer;
    -webkit-appearance: auto;
    appearance: auto;

    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      opacity: 1;
      display: block;
      filter: invert(0);
    }
  }
    
    /* Estilos para inputs en estado disabled */
    &:disabled {
        background-color: #f3f4f6;
        color: #6b7280;
        cursor: not-allowed;
        border-color: #d1d5db;
    }
    
    /* Estilos para inputs con error */
    &.error {
        border-color: #dc2626;
        background-color: #fef2f2;
        
        &:focus {
            border-color: #dc2626;
            box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
        }
    }
    
    /* Estilos para inputs válidos */
    &.valid {
        border-color: #16a34a;
        background-color: #f0fdf4;
        
        &:focus {
            border-color: #16a34a;
            box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
        }
    }
`;
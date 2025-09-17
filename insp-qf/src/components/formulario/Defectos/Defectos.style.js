import styled from 'styled-components';

// Contenedor principal
export const Container = styled.div`
    padding: 1rem;
    border-bottom: 1px solid #d1d5db;
    border-left: 1px solid #d1d5db;
    border-right: 1px solid #d1d5db;
    background-color: #fff;
    
    @media (max-width: 768px) {
        padding: 0.75rem;
    }
    
    @media (max-width: 360px) {
        padding: 0.5rem;
    }
`;

// Encabezado de la sección
export const SectionHeader = styled.p`
   
    font-weight: bold;
    font-size: 0.875rem;
    color: #000;
    margin: 0 0 1rem 0;
    line-height: 1.4;
    
    @media (max-width: 768px) {
        font-size: 0.75rem;
        margin-bottom: 0.75rem;
    }
    
    @media (max-width: 360px) {
        font-size: 0.625rem;
    }
`;

// Tabla de defectos
export const DefectTable = styled.div`
    border: 1px solid #d1d5db;
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
        margin-bottom: 0.75rem;
    }
    
    &:last-child {
        margin-bottom: 0;
    }
`;

// Encabezado de tabla
export const TableHeader = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    background-color: #f9fafb;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr 80px;
    }
    
    @media (max-width: 360px) {
        grid-template-columns: 1fr 60px;
    }
`;

// Celda de encabezado
export const TableHeaderCell = styled.div`
    padding: 0.5rem;
    font-weight: 500;
    font-size: 0.875rem;
    color: #000;
    border-right: 1px solid #d1d5db;
    
    @media (max-width: 768px) {
        padding: 0.375rem;
        font-size: 0.75rem;
    }
    
    @media (max-width: 360px) {
        padding: 0.25rem;
        font-size: 0.625rem;
    }
    
    &.defect-type {
        border-right: 1px solid #d1d5db;
    }
    
    &.units-header {
        text-align: center;
        border-right: none;
        min-width: 100px;
        
        @media (max-width: 768px) {
            min-width: 80px;
        }
        
        @media (max-width: 360px) {
            min-width: 60px;
        }
    }
`;

// Fila de la tabla
export const TableRow = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    border-top: 1px solid #d1d5db;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr 80px;
    }
    
    @media (max-width: 360px) {
        grid-template-columns: 1fr 60px;
    }
    
    &:hover {
        background-color: #f9fafb;
    }
`;

// Descripción del defecto
export const DefectDescription = styled.div`
    padding: 0.5rem;
    font-size: 0.875rem;
    color: #000;
    border-right: 1px solid #d1d5db;
    line-height: 1.4;
    
    @media (max-width: 768px) {
        padding: 0.375rem;
        font-size: 0.75rem;
    }
    
    @media (max-width: 360px) {
        padding: 0.25rem;
        font-size: 0.625rem;
        line-height: 1.3;
    }
`;

// Contenedor del input
export const InputContainer = styled.div`
    padding: 0.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 100px;
    
    @media (max-width: 768px) {
        padding: 0.125rem;
        min-width: 80px;
    }
    
    @media (max-width: 360px) {
        min-width: 60px;
    }
`;

// Input de defectos
export const DefectInput = styled.input`
    width: 85%;
    height: 2.5rem;
    border: 2px solid #000;
    padding: 0.25rem;
    text-align: center;
    font-size: 1.125rem;
    font-weight: 500;
    color: #000;
    background-color: #fff;
    border-radius: 0;
    outline: none;
    transition: all 0.2s ease;
    
    @media (max-width: 768px) {
        height: 2rem;
        font-size: 1rem;
        border: 1.5px solid #000;
        font-weight: 600;
    }
    
    @media (max-width: 360px) {
        height: 1.5rem;
        font-size: 0.875rem;
        padding: 0.125rem;
    }
    
    &:focus {
        border-color: #15803d;
        box-shadow: 0 0 0 2px rgba(21, 128, 61, 0.2);
        background-color: #f9fafb;
        outline: 2px solid #15803d;
        outline-offset: 2px;
    }
    
    &::placeholder {
        color: #6b7280;
        font-weight: 400;
        font-style: italic;
        
        @media (max-width: 768px) {
            font-size: 0.875rem;
        }
        
        @media (max-width: 360px) {
            font-size: 0.75rem;
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
            outline-color: #dc2626;
        }
    }
    
    /* Estilos para inputs válidos */
    &.valid {
        border-color: #16a34a;
        background-color: #f0fdf4;
        
        &:focus {
            border-color: #16a34a;
            box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
            outline-color: #16a34a;
        }
    }
`;
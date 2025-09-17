import styled from 'styled-components';

// Contenedor principal
export const Container = styled.div`
    padding: 1rem;
    border-bottom: 1px solid #d1d5db;
    border-left: 1px solid #d1d5db;
    border-right: 1px solid #d1d5db;
    background-color: #fff;
    
    @media (max-width: 768px) {
        padding: 0.5rem;
    }
`;

// Encabezado con instrucciones
export const Header = styled.p`
    font-weight: 600;
    font-size: 0.875rem;
    color: #000;
    margin: 0 0 0.5rem 0;
    line-height: 1.4;
    
    @media (max-width: 768px) {
        font-size: 0.75rem;
        margin: 0 0 0.75rem 0;
    }
`;

// Tabla principal
export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    border: 2px solid #000;
    
    @media (max-width: 768px) {
        border: 1.5px solid #000;
    }
`;

// Encabezado de tabla
export const TableHead = styled.thead`
    background-color: #f9fafb;
`;

// Cuerpo de tabla
export const TableBody = styled.tbody``;

// Fila de tabla
export const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f9fafb;
    }
    
    &:hover {
        background-color: #f3f4f6;
    }
`;

// Encabezado de columna
export const TableHeader = styled.th`
    border: 2px solid #000;
    padding: 0.5rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: #000;
    text-align: left;
    background-color: #e5e7eb;
    
    @media (max-width: 768px) {
        padding: 0.375rem;
        font-size: 0.75rem;
        border: 1.5px solid #000;
    }
    
    &.center-header {
        text-align: center;
        width: 4rem;
        
        @media (max-width: 768px) {
            width: 3rem;
            font-size: 0.625rem;
        }
    }
`;

// Celda de tabla
export const TableCell = styled.td`
    border: 2px solid #000;
    padding: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #000;
    vertical-align: middle;
    
    @media (max-width: 768px) {
        padding: 0.375rem;
        font-size: 0.75rem;
        border: 1.5px solid #000;
    }
    
    &.question-cell {
        line-height: 1.4;
        
        @media (max-width: 768px) {
            font-size: 0.625rem;
            line-height: 1.3;
        }
    }
    
    &.radio-cell {
        text-align: center;
        width: 4rem;
        padding: 0.75rem 0.5rem;
        
        @media (max-width: 768px) {
            width: 3rem;
            padding: 0.5rem 0.25rem;
        }
    }
`;

// Input radio personalizado
export const RadioInput = styled.input`
    width: 1.125rem;
    height: 1.125rem;
    cursor: pointer;
    accent-color: #15803d;
    transform: scale(1.2);

    
    
    @media (max-width: 768px) {
        width: 1rem;
        height: 1rem;
        transform: scale(1.1);
    }
    
    &:focus {
        outline: 2px solid #15803d;
        outline-offset: 2px;
    }
    
    &:hover {
        transform: scale(1.3);
        
        @media (max-width: 768px) {
            transform: scale(1.2);
        }
    }
    
    /* Estilos para inputs en estado disabled */
    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;
import styled from 'styled-components';

// Contenedor principal del cuestionario
export const Container = styled.div`
    padding: 1rem;
    border-bottom: 1px solid #d1d5db;
    border-left: 1px solid #d1d5db;
    border-right: 1px solid #d1d5db;
`;

// Texto de instrucciones
export const Instruction = styled.p`
    font-weight: 500;
    font-size: 0.875rem;
    margin: 0 0 0.5rem 0;
    color: #374151;
`;

// Tabla principal
export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
`;

// Encabezados de tabla
export const TableHeader = styled.th`
    border: 1px solid #d1d5db;
    padding: 0.5rem;
    font-size: 0.875rem;
    background-color: #f9fafb;
    color: #111827;
    font-weight: 600;
    
    &.question-header {
        text-align: left;
    }
    
    &.answer-header {
        text-align: center;
        width: 4rem;
    }
`;

// Filas de la tabla
export const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f9fafb;
    }
    
    &:hover {
        background-color: #f3f4f6;
    }
`;

// Celdas de la tabla
export const TableCell = styled.td`
    border: 1px solid #d1d5db;
    padding: 0.5rem;
    font-size: 0.875rem;
    
    &.question-cell {
        color: #374151;
        line-height: 1.4;
    }
    
    &.answer-cell {
        text-align: center;
        vertical-align: middle;
    }
`;

// Input radio personalizado
export const RadioInput = styled.input`
    cursor: pointer;
    width: 1rem;
    height: 1rem;
    accent-color: #3b82f6;
    
    &:hover {
        transform: scale(1.1);
        transition: transform 0.2s ease;
    }
    
    &:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }
`;
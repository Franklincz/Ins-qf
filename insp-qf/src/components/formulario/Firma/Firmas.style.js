import styled from 'styled-components';

// Contenedor principal de firmas
export const SignatureContainer = styled.div`
    border-bottom: 1px solid #d1d5db;
`;

// Sección de firmas (2 columnas)
export const SignatureSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 1rem;
    border-left: 1px solid #d1d5db;
    border-right: 1px solid #d1d5db;
`;

// Columna individual de firma
export const SignatureColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

// Wrapper para input de nombre
export const NameInputWrapper = styled.div`
    width: 100%;
    max-width: 400px;
`;

// Input de nombre
export const NameInput = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #111827;
    background-color: white;
    transition: all 0.2s ease-in-out;
    
    &::placeholder {
        color: #9ca3af;
    }
    
    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &:hover {
        border-color: #9ca3af;
    }
`;

// Wrapper para mostrar el nombre como firma
export const SignatureDisplayWrapper = styled.div`
    width: 100%;
    max-width: 400px;
`;

// Borde de la firma (nombre)
export const SignatureDisplayBorder = styled.div`
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: #f9fafb;
    padding: 1rem;
    min-height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
`;

// Nombre mostrado como firma
export const SignatureName = styled.p`
    font-family: 'Brush Script MT', cursive, serif;
    font-size: 1.25rem;
    color: #111827;
    margin: 0;
    text-align: center;
    font-weight: 400;
    font-style: italic;
    
    /* Fallback si no tiene la fuente cursiva */
    @supports not (font-family: 'Brush Script MT') {
        font-family: 'Georgia', serif;
        font-style: italic;
    }
`;

// Etiqueta de rol de firma
export const SignatureLabel = styled.p`
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
    color: #111827;
    margin: 0;
    padding: 0.5rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
`;
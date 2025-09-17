import styled from 'styled-components';

// Contenedor principal con grid de 3 columnas
export const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border-top: 1px solid #d1d5db;
    border-bottom: 1px solid #d1d5db;
    border-left: 1px solid #d1d5db;
    border-right: 1px solid #d1d5db;
    background-color: #fff;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr 1fr 1fr;
        gap: 0;
    }
`;

// Campo individual de información del lote
export const BatchInfoField = styled.div`
    border: 1px solid #d1d5db;
    padding: 0.75rem;
    background-color: #fff;
    
    @media (max-width: 768px) {
        padding: 0.5rem;
        border-bottom: 1px solid #d1d5db;
        border-left: none;
        border-right: none;
        border-top: none;
        
        &:last-child {
            border-bottom: 1px solid #d1d5db;
        }
    }
    
    &:not(:last-child) {
        border-right: 1px solid #d1d5db;
        
        @media (max-width: 768px) {
            border-right: none;
        }
    }
`;

// Etiqueta del campo
export const FieldLabel = styled.label`
    display: block;
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
export const FieldInput = styled.input`
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
        width: 95%;
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

// Funciones de manejo de cambios para el formulario
export const handleSimpleChange = (field, value, setFormData) => {
    setFormData(prevData => ({
        ...prevData,
        [field]: value
    }));
};

// Función genérica para manejar cambios en formularios complejos
export const handleChange = (section, field, value, setFormData) => {
    setFormData(prevData => ({
        ...prevData,
        [section]: {
            ...prevData[section],
            [field]: value
        }
    }));
};

// Select para nivel de inspección
export const Select = styled.select`
    width: 100%;
    border: 2px solid #000;
    
    padding: 0.25rem;
    font-size: 0.875rem;
    color: #000;
    background-color: #fff;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    cursor: pointer;
    
    @media (max-width: 768px) {
        padding: 0.375rem;
        font-size: 0.8125rem;
    }
    
    &:focus {
        border-color: #15803d;
        box-shadow: 0 0 0 2px rgba(21, 128, 61, 0.2);
        background-color: #f9fafb;

    }
    
    &:hover {
        border-color: #9ca3af;
    }
    
    /* Estilos para opciones */
    option {
        padding: 0.5rem;
        font-size: 0.875rem;
        color: #000;
        background-color: #fff;
        
        &:hover {
            background-color: #f3f4f6;
        }

        
        
        &:disabled {
            color: #6b7280;
            background-color: #f9fafb;
        }
    }
    
    /* Estilos para select en estado disabled */
    &:disabled {
        background-color: #f3f4f6;
        color: #6b7280;
        cursor: not-allowed;
        border-color: #d1d5db;
    }
    
    /* Estilos para select con error */
    &.error {
        border-color: #dc2626;
        background-color: #fef2f2;
        
        &:focus {
            border-color: #dc2626;
            box-shadow: 0 0 0 1px #dc2626;
        }
    }
    
    
    /* Estilos para select válido */
    &.valid {
        border-color: #16a34a;
        background-color: #f0fdf4;
        
        &:focus {
            border-color: #16a34a;
            box-shadow: 0 0 0 2px #16a34a;
        }
    }
    
    /* Personalizar la flecha del select */
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1rem;
    padding-right: 2rem;
`;

// Función para validar los campos del lote
export const validateBatchInfo = (formData) => {
    const errors = {};
    
    if (!formData.batchSize || formData.batchSize.trim() === '') {
        errors.batchSize = 'El tamaño de lote es requerido';
    }
    
    if (!formData.sampleSize || formData.sampleSize.trim() === '') {
        errors.sampleSize = 'El tamaño de muestra es requerido';
    }
    
    if (!formData.inspectionLevel || formData.inspectionLevel.trim() === '') {
        errors.inspectionLevel = 'El nivel de inspección es requerido';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Estado inicial para el formulario
export const initialFormData = {
    batchSize: '',
    sampleSize: '',
    inspectionLevel: '',
    questionnaire: {}
};
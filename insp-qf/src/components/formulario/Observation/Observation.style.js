import styled from 'styled-components';

// Contenedor principal
export const Container = styled.div`
    padding: 1rem;
    border-bottom: 1px solid #d1d5db;
    background-color: #fff;
    position: relative;
    
    @media (max-width: 768px) {
        padding: 0.75rem;
    }
    
    @media (max-width: 480px) {
        padding: 0.5rem;
    }
    
    /* Animación de entrada */
    animation: fadeIn 0.3s ease-in;
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Grid de observaciones
export const ObservationsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0;
    width: 100%;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
    
    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

// Contenido de observaciones
export const ObservationsContent = styled.div`
    grid-column: span 4;
    border: 1px solid #d1d5db;
    padding: 0.5rem;
    background-color: #fff;
    position: relative;
    
    @media (max-width: 768px) {
        grid-column: span 1;
        padding: 0.375rem;
    }
    
    @media (max-width: 480px) {
        padding: 0.25rem;
    }
    
    /* Hover effect */
    &:hover {
        border-color: #9ca3af;
        transition: border-color 0.2s ease;
    }
`;

// Título de observaciones
export const ObservationsTitle = styled.p`
    font-weight: 500;
    font-size: 0.875rem;
    color: #000;
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    line-height: 1.2;
    
    @media (max-width: 768px) {
        font-size: 0.75rem;
        font-weight: 600;
        margin: 0 0 0.375rem 0;
    }
    
    @media (max-width: 480px) {
        font-size: 0.625rem;
        margin: 0 0 0.25rem 0;
        font-weight: 700;
    }
`;

// Textarea de observaciones
export const ObservationsTextarea = styled.textarea`
    width: 100%;
    border: 1px solid #d1d5db;
    padding: 0.5rem;
    margin-top: 0.5rem;
    height: 8rem;
    font-family: inherit;
    font-size: 0.875rem;
    color: #000;
    background-color: #fff;
    border-radius: 0;
    resize: vertical;
    outline: none;
    transition: all 0.2s ease;
    min-height: 5rem;
    max-height: 15rem;
    
    @media (max-width: 768px) {
        padding: 0.375rem;
        font-size: 0.75rem;
        height: 6rem;
        margin-top: 0.375rem;
        min-height: 4rem;
        max-height: 12rem;
    }
    
    @media (max-width: 480px) {
        padding: 0.25rem;
        font-size: 0.625rem;
        height: 5rem;
        margin-top: 0.25rem;
        min-height: 3rem;
        max-height: 10rem;
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
        font-style: italic;
        font-weight: 400;
        
        @media (max-width: 768px) {
            font-size: 0.625rem;
        }
        
        @media (max-width: 480px) {
            font-size: 0.5rem;
        }
    }
    
    &:disabled {
        background-color: #f3f4f6;
        color: #6b7280;
        cursor: not-allowed;
        border-color: #d1d5db;
        opacity: 0.6;
    }
    
    &.error {
        border-color: #dc2626;
        background-color: #fef2f2;
        
        &:focus {
            border-color: #dc2626;
            box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
            outline-color: #dc2626;
        }
    }
    
    &.valid {
        border-color: #16a34a;
        background-color: #f0fdf4;
        
        &:focus {
            border-color: #16a34a;
            box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
            outline-color: #16a34a;
        }
    }
    
    &.loading {
        position: relative;
        
        &::after {
            content: "";
            position: absolute;
            right: 10px;
            top: 10px;
            width: 16px;
            height: 16px;
            border: 2px solid #d1d5db;
            border-top: 2px solid #15803d;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    }
`;
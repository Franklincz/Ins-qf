import styled from 'styled-components';

// Contenedor principal de la sección de evidencias
export const EvidenceContainer = styled.div`
    padding: 1rem;
    border-bottom: 1px solid #d1d5db;
`;

// Contenido de la sección
export const EvidenceContent = styled.div`
    margin-bottom: 1rem;
`;

// Título de la sección
export const EvidenceTitle = styled.p`
    font-weight: 500;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    color: #374151;
    margin: 0 0 0.5rem 0;
`;

// Controles de la sección (botones)
export const EvidenceControls = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    align-items: center;
    flex-wrap: wrap;
`;

// Botón de subir archivos
export const UploadButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: white;
    color: #374151;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f9fafb;
        border-color: #9ca3af;
    }
    
    &:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }
`;

// Botón de eliminar seleccionados
export const DeleteButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    border: 1px solid #dc2626;
    border-radius: 0.375rem;
    background-color: #dc2626;
    color: white;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #b91c1c;
        border-color: #b91c1c;
    }
    
    &:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }
`;

// Input de archivos (oculto)
export const FileInput = styled.input`
    display: none;
`;

// Grid de imágenes
export const ImagesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    
    @media (min-width: 640px) {
        grid-template-columns: repeat(3, 1fr);
    }
    
    @media (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

// Contenedor de cada imagen
export const ImageContainer = styled.div`
    position: relative;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    overflow: hidden;
    transition: all 0.2s ease;

    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    background: white;
    
    &:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    &.selected {
        ring: 2px solid #3b82f6;
        ring-offset: 2px;
        box-shadow: 0 0 0 2px #3b82f6;
    }
    
    &:hover .remove-button {
        opacity: 1;
    }
    
    &:hover .evidence-image {
        transform: scale(1.05);
    }
`;

// Contenedor del checkbox
export const CheckboxContainer = styled.div`
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    z-index: 10;
`;

// Checkbox de imagen
export const ImageCheckbox = styled.div`
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    border-radius: 0.25rem;
    padding: 0.125rem;
    
    input[type="checkbox"] {
        width: 1rem;
        height: 1rem;
        cursor: pointer;
        accent-color: #3b82f6;
        
        &:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }
    }
`;

// Botón de remover imagen
export const RemoveButton = styled.button`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    padding: 0.25rem;
    border: none;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.95);
        transform: scale(1.1);
    }
    
    &:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
        opacity: 1;
    }
`;

// Wrapper de la imagen
export const ImageWrapper = styled.div`
    aspect-ratio: 1;
    position: relative;
    overflow: hidden;
    //
    width: 100%;
`;

// Imagen de evidencia
export const EvidenceImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
    border-radius: 8px;
`;

// Nombre de la imagen
export const ImageName = styled.div`
    padding: 0.5rem;
    font-size: 0.75rem;
    background-color: #f9fafb;
    color: #374151;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-top: 1px solid #e5e7eb;

    text-align: center;
`;

// Estado vacío
export const EmptyState = styled.div`
    border: 2px dashed #d1d5db;
    border-radius: 0.375rem;
    padding: 2rem;
    text-align: center;
    background-color: #fafafa;
    transition: all 0.2s ease;
    
    &:hover {
        border-color: #9ca3af;
        background-color: #f5f5f5;
    }
`;

// Mensaje principal del estado vacío
export const EmptyMessage = styled.p`
    color: #6b7280;
    font-size: 1rem;
    margin-bottom: 0.25rem;
    margin: 0 0 0.25rem 0;
`;

// Submensaje del estado vacío
export const EmptySubmessage = styled.p`
    color: #9ca3af;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    margin: 0.25rem 0 0 0;
`;
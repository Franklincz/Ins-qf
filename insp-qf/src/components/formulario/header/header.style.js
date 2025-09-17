import styled from 'styled-components';

// Contenedor principal del header (3 columnas)
export const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border-bottom: 1px solid #d1d5db;
    border-left: 1px solid #d1d5db;
    border-right: 1px solid #d1d5db;
    border-top: 1px solid #d1d5db;
`;

// Sección del logo (columna izquierda)
export const LogoSection = styled.div`
    padding: 0.5rem;
    border-right: 1px solid #d1d5db;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
`;
export const Logo = styled.img`
    height: 3rem;
    width: auto;
    
`;
// Sección principal (columna central)
export const MainSection = styled.div`
    padding: 0.5rem;
    border-right: 1px solid #d1d5db;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const Title = styled.p`
    text-align: center;
    font-weight: bold;
    font-size: 0.875rem;
    margin: 0 0 0.25rem 0;
    color:#000000;
`;

export const DocumentTypeInfo = styled.div`
    font-size: 0.75rem;
    margin-top: 0.25rem;
    
    p {
        margin: 0;
        color:rgb(0, 0, 0);
        
        span {
            font-weight: 500;
        }
    }
`;

// Sección de información (columna derecha)
export const InfoSection = styled.div`
    padding: 0.5rem;
    font-size: 0.75rem;
`;

export const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.25rem;
    margin-bottom: 0.125rem;
`;

export const InfoLabel = styled.p`
    margin: 0;
    color: #374151;
`;

export const InfoValue = styled.p`
    margin: 0;
    font-weight: 500;
    color: #111827;
`;

// Sección de aprobaciones (debajo del header principal)
export const ApprovalSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border-bottom: 1px solid #d1d5db;
    border-left: 1px solid #d1d5db;
    border-right: 1px solid #d1d5db;
`;

export const ApprovalColumn = styled.div`
    padding: 0.5rem;
    border-right: 1px solid #d1d5db;
    font-size: 0.75rem;
    
    &:last-child {
        border-right: none;
    }
`;

export const ApprovalTitle = styled.p`
    font-weight: bold;
    margin: 0 0 0.25rem 0;
    color: #111827;
`;

export const ApprovalText = styled.p`
    margin: 0 0 0.25rem 0;
    color: #374151;
`;

export const ApprovalDate = styled.p`
    margin: 0;
    color: #374151;
`;
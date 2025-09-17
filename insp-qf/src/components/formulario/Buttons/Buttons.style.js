import styled from 'styled-components';

export const Container = styled.div`
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
`;

export const ButtonsWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
`;

export const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
    gap: 0.5rem;
    cursor: pointer;

    ${({ $variant }) => 
        $variant === 'outline' ? `
            border: 1px solid #e5e7eb;
            background-color: white;
            color: #374151;
            
            &:hover {
                background-color: #f9fafb;
            }
        ` : `
            border: 1px solid #3b82f6;
            background-color: #3b82f6;
            color: white;
            
            &:hover {
                background-color: #2563eb;
                border-color: #2563eb;
            }
        `
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &.relative {
        position: relative;
    }
`;

export const IconWrapper = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
        height: 1rem;
        width: 1rem;
    }

    .text-success {
        color: #10b981;
    }

    .animate-spin {
        animation: spin 1s linear infinite;
    }
`;

export const SuccessIndicator = styled.span`
    position: absolute;
    top: -0.25rem;
    right: -0.25rem;
    display: flex;
    height: 0.75rem;
    width: 0.75rem;
`;

export const DialogOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
`;

export const DialogContent = styled.div`
    position: relative;
    z-index: 50;
    width: 100%;
    max-width: 32rem;
    border-radius: 0.5rem;
    background-color: white;
    padding: 1.5rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const DialogHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    text-align: center;

    @media (min-width: 640px) {
        text-align: left;
    }
`;

export const DialogTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.75rem;
    letter-spacing: -0.025em;
    margin: 0;
    color: #111827;
`;

export const DialogDescription = styled.p`
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
`;

export const DialogForm = styled.div`
    display: grid;
    gap: 1rem;
    padding: 1.5rem 0;
`;

export const FormGroup = styled.div`
    display: grid;
    gap: 0.5rem;
`;

export const Label = styled.label`
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    color: #374151;
`;

export const Input = styled.input`
    display: flex;
    height: 2.5rem;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
    background-color: white;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
`;

export const DialogFooter = styled.div`
    display: flex;
    flex-direction: column-reverse;
    gap: 0.5rem;

    @media (min-width: 640px) {
        flex-direction: row;
        justify-content: flex-end;
    }
`;

export const ErrorAlert = styled.div`
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.375rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;

    .icon {
        height: 1.25rem;
        width: 1.25rem;
        color: #ef4444;
        margin-top: 0.125rem;
        flex-shrink: 0;
    }
`;

export const ErrorContent = styled.div`
    display: flex;
    flex-direction: column;

    .error-title {
        color: #b91c1c;
        font-weight: 500;
        margin: 0;
    }

    .error-message {
        font-size: 0.875rem;
        color: #dc2626;
        margin: 0;
    }
`;
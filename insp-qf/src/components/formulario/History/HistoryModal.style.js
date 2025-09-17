import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-in-out;
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
  
  h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ClearAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #c82333;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e9ecef;
    color: #333;
  }
`;

export const FilterSection = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px 24px;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
`;

export const FilterButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  background-color: ${props => props.$active ? '#00d4aa' : 'white'};
  color: ${props => props.$active ? 'white' : '#6c757d'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$active ? '#00b89a' : '#f8f9fa'};
  }
`;

export const ModalBody = styled.div`
  padding: 0;
  max-height: 50vh;
  overflow-y: auto;
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const HistoryDate = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
  min-width: 80px;
  margin-right: 16px;
`;

export const HistoryTitle = styled.div`
  flex: 1;
  
  strong {
    color: #333;
    font-size: 1rem;
  }
  
  small {
    color: #6c757d;
    font-size: 0.875rem;
  }
`;

export const HistoryStatus = styled.div`
  background-color: ${props => props.color};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
  margin-right: 8px;
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #ffebee;
    color: #d32f2f;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

export const NoResults = styled.div`
  text-align: center;
  padding: 40px 24px;
  color: #6c757d;
  font-style: italic;
`;

// Estilos para el diálogo de confirmación
export const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20000;
  animation: fadeIn 0.2s ease-in-out;
`;

export const ConfirmDialog = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.2s ease-in-out;
  
  h3 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 1.25rem;
  }
  
  p {
    margin: 0 0 12px 0;
    color: #666;
    line-height: 1.5;
  }
`;

export const DialogActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

export const DialogButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
  
  ${props => props.variant === 'secondary' && `
    background-color: white;
    color: #6c757d;
    border-color: #dee2e6;
    
    &:hover {
      background-color: #f8f9fa;
      border-color: #adb5bd;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background-color: #dc3545;
    color: white;
    border-color: #dc3545;
    
    &:hover {
      background-color: #c82333;
      border-color: #bd2130;
    }
  `}
  
  &:active {
    transform: scale(0.98);
  }
`;

// Agrégalo al final de HistoryModal.style.js
export const ErrorMessage = styled.div`
  color: #ff4444;
  background: #ffe6e6;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 14px;
`;

// Al final del archivo HistoryModal.style.js
export const LoadingSpinner = styled.div`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 10px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const RefreshButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;
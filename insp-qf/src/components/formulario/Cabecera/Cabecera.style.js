import styled from 'styled-components';

export const CabeceraContainer = styled.div`
  background: linear-gradient(135deg, #00d4aa 0%, #00b89a 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const CabeceraContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  .logo-circle {
    width: 50px;
    height: 50px;
    background-color: rgba(255, 255, 255, 0.2);
    border: 2px solid white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    span {
      color: white;
      font-weight: bold;
      font-size: 1.2rem;
      letter-spacing: 1px;
    }
  }
`;

export const Title = styled.h1`
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const HistoryButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 12px;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background-color: white;
    color: #00d4aa;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    
    svg {
      transform: scale(1.1);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;
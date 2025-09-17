import React from 'react';
import {
    Container,
    LogoSection,
    Logo,
    MainSection,
    Title,
    DocumentTypeInfo,
    InfoSection,
    InfoGrid,
    InfoLabel,
    InfoValue,
    ApprovalSection,
    ApprovalColumn,
    ApprovalTitle,
    ApprovalText,
    ApprovalDate
} from './header.style.js';
import './header.css';

const Header = ({
    documentCode = "F.GE.MC.015",
    version = "00",
    pageNumber = "#",
    elaboratedDate = "25/03/2023",
    reviewedDate = "27/03/2023",
    approvedDate = "27/03/2023"
}) => {
    return (
        <div>
            {/* Header superior con 3 columnas */}
            <Container>
                <LogoSection>
                    <Logo
                        src="./logo-qf.png"
                        alt="QF Logo">
                    </Logo>
                </LogoSection>

                <MainSection>
                    <Title>REPORTE DE INSPECCIÓN DE CALIDAD</Title>
                    <DocumentTypeInfo>
                        <p>Tipo de documento: <span>Formato</span></p>
                        <p>Área: <span>Calidad y Mejora Continua</span></p>
                    </DocumentTypeInfo>
                </MainSection>

                <InfoSection>
                    <InfoGrid>
                        <InfoLabel>Código:</InfoLabel>
                        <InfoValue>{documentCode}</InfoValue>
                    </InfoGrid>
                    <InfoGrid>
                        <InfoLabel>Versión:</InfoLabel>
                        <InfoValue>{version}</InfoValue>
                    </InfoGrid>
                    <InfoGrid>
                        <InfoLabel>Página:</InfoLabel>
                        <InfoValue>{pageNumber}</InfoValue>
                    </InfoGrid>
                </InfoSection>
            </Container>

            {/* Sección de aprobaciones */}
            <ApprovalSection>
                <ApprovalColumn>
                    <ApprovalTitle>ELABORADO POR:</ApprovalTitle>
                    <ApprovalText>Coordinador de Calidad y Mejora Continua</ApprovalText>
                    <ApprovalDate>Fecha: {elaboratedDate}</ApprovalDate>
                </ApprovalColumn>

                <ApprovalColumn>
                    <ApprovalTitle>REVISADO POR:</ApprovalTitle>
                    <ApprovalText>Jefe de Calidad y Mejora Continua</ApprovalText>
                    <ApprovalDate>Fecha: {reviewedDate}</ApprovalDate>
                </ApprovalColumn>

                <ApprovalColumn>
                    <ApprovalTitle>APROBADO POR:</ApprovalTitle>
                    <ApprovalText>Jefe de Calidad y Mejora Continua</ApprovalText>
                    <ApprovalDate>Fecha: {approvedDate}</ApprovalDate>
                </ApprovalColumn>
            </ApprovalSection>
        </div>
    );
};

export default Header;
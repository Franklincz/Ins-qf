import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    SignatureContainer,
    SignatureSection,
    SignatureColumn,
    NameInputWrapper,
    NameInput,
    SignatureDisplayWrapper,
    SignatureDisplayBorder,
    SignatureName,
    SignatureLabel
} from './Firmas.style.js';
import './Firmas.css';

const Firmas = ({ signatures = {}, onSignatureChange = () => {} }) => {
    const [assistantName, setAssistantName] = useState(signatures?.assistant || '');
    const [chiefName, setChiefName] = useState(signatures?.chief || '');

    const handleNameChange = (role, value) => {
        if (role === "assistant") {
            setAssistantName(value);
            // Safety check before calling the function
            if (typeof onSignatureChange === 'function') {
                onSignatureChange("assistant", value);
            }
        } else if (role === "chief") {
            setChiefName(value);
            // Safety check before calling the function
            if (typeof onSignatureChange === 'function') {
                onSignatureChange("chief", value);
            }
        }
    };

    return (
        <SignatureContainer>
            <SignatureSection>
                {/* Nombre del Asistente de Calidad */}
                <SignatureColumn>
                    <NameInputWrapper>
                        <NameInput
                            type="text"
                            value={assistantName}
                            onChange={(e) => handleNameChange("assistant", e.target.value)}
                            placeholder="Escriba su nombre completo"
                            aria-label="Nombre del Asistente de Calidad"
                        />
                    </NameInputWrapper>
                    <SignatureDisplayWrapper>
                        <SignatureDisplayBorder>
                            <SignatureName>
                                {assistantName.trim() || "Sin nombre"}
                            </SignatureName>
                        </SignatureDisplayBorder>
                    </SignatureDisplayWrapper>
                    <SignatureLabel>Asistente de Calidad</SignatureLabel>
                </SignatureColumn>

                {/* Nombre del Jefe de Calidad */}
                <SignatureColumn>
                    <NameInputWrapper>
                        <NameInput
                            type="text"
                            value={chiefName}
                            onChange={(e) => handleNameChange("chief", e.target.value)}
                            placeholder="Escriba su nombre completo"
                            aria-label="Nombre del Jefe de Calidad"
                        />
                    </NameInputWrapper>
                    <SignatureDisplayWrapper>
                        <SignatureDisplayBorder>
                            <SignatureName>
                                {chiefName.trim() || "Sin nombre"}
                            </SignatureName>
                        </SignatureDisplayBorder>
                    </SignatureDisplayWrapper>
                    <SignatureLabel>Jefe de Calidad y Mejora Continua</SignatureLabel>
                </SignatureColumn>
            </SignatureSection>
        </SignatureContainer>
    );
};

// PropTypes for better development experience
Firmas.propTypes = {
    signatures: PropTypes.shape({
        assistant: PropTypes.string,
        chief: PropTypes.string
    }),
    onSignatureChange: PropTypes.func
};

// Default props
Firmas.defaultProps = {
    signatures: {},
    onSignatureChange: () => {}
};

export default Firmas;
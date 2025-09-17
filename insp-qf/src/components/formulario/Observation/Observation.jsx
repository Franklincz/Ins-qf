"use client"
import React from 'react';
import {
    Container,
    ObservationsGrid,
    ObservationsContent,
    ObservationsTitle,
    ObservationsTextarea
} from './Observation.style.js';
import './Observation.css';

function Observations({ observations, onChange }) {
  return (
    <Container className="observations-container">
      <ObservationsGrid className="observations-grid">
        <ObservationsContent className="observations-content">
          <ObservationsTitle className="observations-title">
            OBSERVACIONES
          </ObservationsTitle>
          <ObservationsTextarea
            className="observations-textarea"
            value={observations}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ingrese sus observaciones aquí..."
          />
        </ObservationsContent>
      </ObservationsGrid>
    </Container>
  )
}
export default Observations;
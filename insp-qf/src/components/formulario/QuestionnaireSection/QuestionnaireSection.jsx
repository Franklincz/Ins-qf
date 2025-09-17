"use client"
import React from 'react';
import {
    Container,
    Instruction,
    Table,
    TableHeader,
    TableRow,
    TableCell,
    RadioInput
} from './Questionnaire.style.js';
import './questionnaire.css';

const QuestionnaireSection = ({ questionnaire, onChange }) => {
    const questions = [
        "¿El formulador registra correctamente la información en la orden de producción?",
        "¿El formulador esta correctamente uniformados?",
        "¿Las condiciones ambientales son registradas correctamente y se mantienen dentro de los parámetros establecidos?",
        "¿Las áreas se encuentran identificadas correctamente?",
        "¿El formulador realiza correctamente la limpieza del área, equipos y/o instrumentos?",
        "¿Se registra correctamente el análisis organoléptico del producto?",
        "¿La documentación del proceso se encuentra completa, vigente y legible?",
    ];

    return (
        <Container>
            <Instruction>
                1. Marcar con un "X", según corresponda: Conformidad (C) / No conformidad (NC).
            </Instruction>
            <Table>
                <thead>
                    <tr>
                        <TableHeader className="question-header">Cuestionario</TableHeader>
                        <TableHeader className="answer-header">C</TableHeader>
                        <TableHeader className="answer-header">NC</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((question, index) => (
                        <TableRow key={index}>
                            <TableCell className="question-cell">{question}</TableCell>
                            <TableCell className="answer-cell">
                                <RadioInput
                                    type="radio"
                                    name={`q${index + 1}`}
                                    value="C"
                                    checked={questionnaire[`q${index + 1}`] === "C"}
                                    onChange={() => onChange("questionnaire", `q${index + 1}`, "C")}
                                />
                            </TableCell>
                            <TableCell className="answer-cell">
                                <RadioInput
                                    type="radio"
                                    name={`q${index + 1}`}
                                    value="NC"
                                    checked={questionnaire[`q${index + 1}`] === "NC"}
                                    onChange={() => onChange("questionnaire", `q${index + 1}`, "NC")}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default QuestionnaireSection;
import React from 'react';
import {
    Container,
    Header,
    Table,
    TableHead,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    RadioInput
} from './QuestionSection.style.js';
import './QuestionSection.css';

const QuestionSection = ({ questionnaire = {}, onChange }) => {
    const questions = [
        "¿El formulador registra correctamente la información en la orden de producción?",
        "¿El formulador está correctamente uniformados?",
        "¿Las condiciones ambientales son registradas correctamente y se mantienen dentro de los parámetros establecidos?",
        "¿Las áreas se encuentran identificadas correctamente?",
        "¿El formulador realiza correctamente la limpieza del área, equipos y/o instrumentos?",
        "¿Se registra correctamente el análisis organoléptico del producto?",
        "¿La documentación del proceso se encuentra completa, vigente y legible?",
    ];

    // Función de manejo seguro para onChange
    const handleChange = (section, question, value) => {
        if (onChange && typeof onChange === 'function') {
            onChange(section, question, value);
        }
    };

    return (
        <Container>
            <Header>
                1. Marcar con un "X", según corresponda: Conformidad (C) / No conformidad (NC).
            </Header>
            
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeader>Cuestionario</TableHeader>
                        <TableHeader className="center-header">C</TableHeader>
                        <TableHeader className="center-header">NC</TableHeader>
                    </TableRow>
                </TableHead>
                
                <TableBody>
                    {questions.map((question, index) => (
                        <TableRow key={index}>
                            <TableCell className="question-cell">
                                {question}
                            </TableCell>
                            <TableCell className="radio-cell">
                                <RadioInput
                                    type="radio"
                                    name={`q${index + 1}`}
                                    value="C"
                                    checked={questionnaire[`q${index + 1}`] === "C"}
                                    onChange={() => handleChange("questionnaire", `q${index + 1}`, "C")}
                                />
                            </TableCell>
                            <TableCell className="radio-cell">
                                <RadioInput
                                    type="radio"
                                    name={`q${index + 1}`}
                                    value="NC"
                                    checked={questionnaire[`q${index + 1}`] === "NC"}
                                    onChange={() => handleChange("questionnaire", `q${index + 1}`, "NC")}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
};

export default QuestionSection;
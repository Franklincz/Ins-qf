import React, { useEffect} from 'react';
import {
    Container,
    BatchInfoField,
    FieldLabel,
    FieldInput,
    Select
} from './Inspection.style.js';
import './Inspection.css';

// Tabla de inspección basada en la imagen proporcionada
const INSPECTION_TABLE = [
    { minSize: 0.01, maxSize: 2.99, levelI: "todo", levelII: "todo", levelIII: "todo" },
    { minSize: 3.00, maxSize: 8.99, levelI: 2, levelII: 2, levelIII: 3 },
    { minSize: 9.00, maxSize: 15.99, levelI: 2, levelII: 3, levelIII: 5 },
    { minSize: 16.00, maxSize: 25.99, levelI: 3, levelII: 5, levelIII: 8 },
    { minSize: 26.00, maxSize: 50.99, levelI: 5, levelII: 8, levelIII: 13 },
    { minSize: 51.00, maxSize: 90.99, levelI: 5, levelII: 13, levelIII: 20 },
    { minSize: 91.00, maxSize: 150.99, levelI: 8, levelII: 20, levelIII: 32 },
    { minSize: 151.00, maxSize: 280.99, levelI: 13, levelII: 32, levelIII: 50 },
    { minSize: 281.00, maxSize: 500.99, levelI: 20, levelII: 50, levelIII: 80 },
    { minSize: 501.00, maxSize: 1200.99, levelI: 32, levelII: 80, levelIII: 125 },
    { minSize: 1201.00, maxSize: 3200.99, levelI: 50, levelII: 125, levelIII: 200 },
    { minSize: 3201.00, maxSize: 10000.99, levelI: 80, levelII: 200, levelIII: 315 },
    { minSize: 10001.00, maxSize: 35000.99, levelI: 125, levelII: 315, levelIII: 500 },
    { minSize: 35001.00, maxSize: 150000.99, levelI: 200, levelII: 500, levelIII: 800 },
    { minSize: 150001.00, maxSize: 500000.99, levelI: 315, levelII: 800, levelIII: 1250 },
    { minSize: 500001.00, maxSize: Infinity, levelI: 500, levelII: 1250, levelIII: 2000 }
];

// Función para extraer número y unidad de un string
const parseValueWithUnit = (value) => {
    if (!value) return { number: 0, unit: '' };
    
    // Buscar el patrón: número seguido de letras (unidad)
    const match = value.toString().match(/^(\d*\.?\d+)\s*([a-zA-Z]*)$/);
    
    if (match) {
        return {
            number: parseFloat(match[1]),
            unit: match[2] || ''
        };
    }
    
    // Si no tiene formato de unidad, asumir que es solo número
    const numericValue = parseFloat(value);
    return {
        number: isNaN(numericValue) ? 0 : numericValue,
        unit: ''
    };
};
// Función para calcular el tamaño de muestra
const calculateSampleSize = (batchSize, inspectionLevel) => {
    if (!batchSize || !inspectionLevel) return '';
    
    const { number: numericBatchSize, unit } = parseValueWithUnit(batchSize);
    
    if (isNaN(numericBatchSize) || numericBatchSize <= 0) return '';
    
    // Encontrar el rango correcto en la tabla
    const range = INSPECTION_TABLE.find(row => 
        numericBatchSize >= row.minSize && numericBatchSize <= row.maxSize
    );
    
    if (!range) return '';
    
    // Retornar el tamaño de muestra según el nivel de inspección
    let sampleSize;
    switch (inspectionLevel) {
        case 'I':
            sampleSize = range.levelI;
            break;
        case 'II':
            sampleSize = range.levelII;
            break;
        case 'III':
            sampleSize = range.levelIII;
            break;
        default:
            return '';
    }
    
    // Si el valor es "todo", retornar el tamaño de lote original con su unidad
    if (sampleSize === "todo") {
        return batchSize;
    }
    
    // Retornar el tamaño de muestra con la unidad del lote original
    return unit ? `${sampleSize}${unit}` : sampleSize.toString();
};

const Inspection = ({ formData, handleChange, handleSimpleChange }) => {
    
    // Efecto para calcular automáticamente el tamaño de muestra
    useEffect(() => {
        const calculatedSampleSize = calculateSampleSize(
            formData.batchSize, 
            formData.inspectionLevel
        );
        
        // Solo actualizar si el valor calculado es diferente al actual
        if (calculatedSampleSize !== formData.sampleSize) {
            handleSimpleChange("sampleSize", calculatedSampleSize);
        }
    }, [formData.batchSize, formData.inspectionLevel, formData.sampleSize, handleSimpleChange]);
    
    return (
        <>

            <Container>
                <BatchInfoField>
                    <FieldLabel>Tamaño de lote:</FieldLabel>
                    <FieldInput
                        type="text"
                        value={formData.batchSize}
                        onChange={(e) => handleSimpleChange("batchSize", e.target.value)}
                        placeholder="Ingrese el tamaño de lote"
                        step="0.01"
                    />
                </BatchInfoField>

                <BatchInfoField>
                    <FieldLabel>Tamaño de muestra:</FieldLabel>
                    <FieldInput
                        type="text"
                        value={formData.sampleSize}
                        onChange={(e) => handleSimpleChange("sampleSize", e.target.value)}
                        placeholder="Se calcula automáticamente"
                        readOnly
                        style={{ backgroundColor: '#f3f4f6'}}
                        
                    />
                </BatchInfoField>

                <BatchInfoField>
                    <FieldLabel>Nivel de inspección:</FieldLabel>
                    <Select
                        
                        value={formData.inspectionLevel}
                        onChange={(e) => handleSimpleChange("inspectionLevel", e.target.value)}
                        //placeholder="Ingrese el nivel de inspección"
                    >
                        <option value="">Seleccione el nivel de inspección</option>
                        <option value="I">I</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                    </Select>
                </BatchInfoField>


            </Container>


        </>
    );
};

export default Inspection;

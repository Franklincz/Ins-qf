import React,{useState, useEffect, useRef} from 'react';
import {
    Container,
    LeftColumn,
    RightColumn,
    FieldGroup,
    Label,
    Input
} from './ProductSection.style.js';
import './ProductSection.css';

// Listas de opciones para área y producto (puedes modificar estas listas según tus necesidades)
const AREAS_OPTIONS = [
    'Producción General',
    'Área de Envasado',
    'Área de Mezcla',
    'Área de Empaque',
    'Área de Almacén',
    'Área de Control de Calidad',
    'Área de Limpieza',
    'Área de Mantenimiento',
    'Área de Recepción',
    'Área de Despacho',
    'Área de Laboratorio',
    'Área de Desarrollo',
    'Área de Administración'
];

const PRODUCTS_OPTIONS = [
    'Producto A - Categoría 1',
    'Producto B - Categoría 1',
    'Producto C - Categoría 2',
    'Producto D - Categoría 2',
    'Producto E - Categoría 3',
    'Producto F - Categoría 3',
    'Producto G - Categoría 4',
    'Producto H - Categoría 4',
    'Producto I - Categoría 5',
    'Producto J - Categoría 5',
    'Producto K - Especial',
    'Producto L - Premium',
    'Producto M - Estándar'
];

// Función para resaltar texto coincidente
const highlightText = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
        regex.test(part) ? 
            <span key={index} className="highlight">{part}</span> : 
            part
    );
};

const AutocompleteInput = ({ 
    value, 
    onChange, 
    placeholder, 
    options, 
    disabled = false,
    maxSuggestions = 10
}) => {
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Filtrar opciones con debounce para mejor rendimiento
    useEffect(() => {
        const timer = setTimeout(() => {
            if (value && value.length > 0) {
                setIsLoading(true);
                
                // Simulamos una pequeña demora para mostrar loading
                setTimeout(() => {
                    const filtered = options
                        .filter(option =>
                            option.toLowerCase().includes(value.toLowerCase())
                        )
                        .slice(0, maxSuggestions); // Limitar número de sugerencias
                    
                    setFilteredOptions(filtered);
                    setShowSuggestions(filtered.length > 0 && value !== '');
                    setIsLoading(false);
                }, 100);
            } else {
                setFilteredOptions([]);
                setShowSuggestions(false);
                setIsLoading(false);
            }
            setHighlightedIndex(-1);
        }, 150); // Debounce de 150ms

        return () => clearTimeout(timer);
    }, [value, options, maxSuggestions]);

    // Manejar cambios en el input
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);
    };

    // Manejar selección de sugerencia
    const handleSuggestionClick = (suggestion) => {
        onChange(suggestion);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.focus();
    };

    // Manejar teclas del teclado
    const handleKeyDown = (e) => {
        if (!showSuggestions) {
            // Mostrar sugerencias al presionar flecha hacia abajo
            if (e.key === 'ArrowDown' && filteredOptions.length > 0) {
                e.preventDefault();
                setShowSuggestions(true);
                setHighlightedIndex(0);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev < filteredOptions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev > 0 ? prev - 1 : filteredOptions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                    handleSuggestionClick(filteredOptions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setHighlightedIndex(-1);
                inputRef.current?.blur();
                break;
            case 'Tab':
                // Cerrar sugerencias al presionar Tab
                setShowSuggestions(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    // Manejar focus del input
    const handleFocus = () => {
        if (value && filteredOptions.length > 0) {
            setShowSuggestions(true);
        }
    };

    // Manejar blur del input
    const handleBlur = (e) => {
        // Delay para permitir clicks en sugerencias
        setTimeout(() => {
            setShowSuggestions(false);
            setHighlightedIndex(-1);
        }, 200);
    };

    // Scroll automático para mantener elemento resaltado visible
    useEffect(() => {
        if (highlightedIndex >= 0 && suggestionsRef.current) {
            const suggestionElement = suggestionsRef.current.children[highlightedIndex];
            if (suggestionElement) {
                suggestionElement.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    }, [highlightedIndex]);

    return (
        <div className="autocomplete-container">
            <Input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
                className={isLoading ? 'loading-input' : ''}
                role="combobox"
                aria-expanded={showSuggestions}
                aria-autocomplete="list"
                aria-haspopup="listbox"
            />
            
            {showSuggestions && (
                <div 
                    className="autocomplete-suggestions fade-in" 
                    ref={suggestionsRef}
                    role="listbox"
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <div
                                key={index}
                                className={`autocomplete-suggestion ${
                                    index === highlightedIndex ? 'highlighted' : ''
                                }`}
                                onClick={() => handleSuggestionClick(option)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                role="option"
                                aria-selected={index === highlightedIndex}
                                tabIndex={-1}
                            >
                                {highlightText(option, value)}
                            </div>
                        ))
                    ) : (
                        <div className="no-suggestions">
                            No se encontraron coincidencias
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ProductSection = ({
    product,
    lot,
    date,
    area,
    onProductChange,
    onLotChange,
    onDateChange,
    onAreaChange,
}) => {
    return (
        <Container>
            {/* Columna izquierda: Área y Producto */}
            <LeftColumn>
                <FieldGroup className="mb-4">
                    <Label>Área:</Label>
                    <AutocompleteInput
                        value={area}
                        onChange={onAreaChange}
                        placeholder="Buscar área..."
                        options={AREAS_OPTIONS}
                        maxSuggestions={8}
                    />
                </FieldGroup>
                <FieldGroup>
                    <Label>Producto:</Label>
                    <AutocompleteInput
                        value={product}
                        onChange={onProductChange}
                        placeholder="Buscar producto..."
                        options={PRODUCTS_OPTIONS}
                        maxSuggestions={8}
                    />
                </FieldGroup>
            </LeftColumn>

            {/* Columna derecha: Fecha y Lote */}
            <RightColumn>
                <FieldGroup className="mb-4">
                    <Label>Fecha:</Label>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => onDateChange(e.target.value)}
                        onFocus={(e) => {
                            if (e.target.showPicker) e.target.showPicker();
                        }}
                        />

                </FieldGroup>
                <FieldGroup>
                    <Label>Lote:</Label>
                    <Input
                        type="text"
                        value={lot}
                        onChange={(e) => onLotChange(e.target.value)}
                        placeholder="Ingrese el lote"
                    />
                </FieldGroup>
            </RightColumn>
        </Container>
    );
};

export default ProductSection;
import React from 'react';
import { useState, useRef } from "react";
import { Trash2, Upload, X } from "lucide-react";
import {
    EvidenceContainer,
    EvidenceContent,
    EvidenceTitle,
    EvidenceControls,
    UploadButton,
    DeleteButton,
    FileInput,
    ImagesGrid,
    ImageContainer,
    CheckboxContainer,
    ImageCheckbox,
    RemoveButton,
    ImageWrapper,
    EvidenceImage,
    ImageName,
    EmptyState,
    EmptyMessage,
    EmptySubmessage
} from './Evidence.style.js';
import './Evidence.css';

const Evidence = ({ images = [], onAddImages, onRemoveImage, onRemoveSelectedImages }) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            name: file.name,
        }));
        onAddImages(newImages);
        e.target.value = null; // Reset input
    };

    const toggleImageSelection = (index) => {
        setSelectedImages((prev) => {
            if (prev.includes(index)) {
                return prev.filter((i) => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    const handleRemoveSelected = () => {
        onRemoveSelectedImages(selectedImages);
        setSelectedImages([]);
    };

    return (
        <EvidenceContainer>
            <EvidenceContent>
                <EvidenceTitle>Evidencias fotográficas:</EvidenceTitle>
                <EvidenceControls>
                    <UploadButton onClick={() => fileInputRef.current.click()}>
                        <Upload size={16} />
                        Agregar fotos
                    </UploadButton>
                    {selectedImages.length > 0 && (
                        <DeleteButton onClick={handleRemoveSelected}>
                            <Trash2 size={16} />
                            Eliminar seleccionados ({selectedImages.length})
                        </DeleteButton>
                    )}
                    <FileInput
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                    />
                </EvidenceControls>

                {images.length > 0 ? (
                    <ImagesGrid>
                        {images.map((image, index) => (
                            <ImageContainer
                                key={index}
                                className={selectedImages.includes(index) ? "selected" : ""}
                            >
                                <CheckboxContainer>
                                    <ImageCheckbox>
                                        <input
                                            type="checkbox"
                                            checked={selectedImages.includes(index)}
                                            onChange={() => toggleImageSelection(index)}
                                        />
                                    </ImageCheckbox>
                                </CheckboxContainer>
                                <RemoveButton
                                    onClick={() => onRemoveImage(index)}
                                >
                                    <X size={16} />
                                </RemoveButton>
                                <ImageWrapper>
                                    <EvidenceImage
                                        src={image.url || "/placeholder.svg"}
                                        alt={`Evidencia ${index + 1}`}
                                    />
                                </ImageWrapper>
                                <ImageName>{image.name}</ImageName>
                            </ImageContainer>
                        ))}
                    </ImagesGrid>
                ) : (
                    <EmptyState>
                        <EmptyMessage>No hay imágenes agregadas</EmptyMessage>
                        <EmptySubmessage>Haga clic en "Agregar fotos" para subir evidencias</EmptySubmessage>
                    </EmptyState>
                )}
            </EvidenceContent>
        </EvidenceContainer>
    );
};

export default Evidence;
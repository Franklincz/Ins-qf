"use client"

import { useState } from "react"
import FormHeader from "./form-header"
import ApprovalSection from "./approval-section"
import ProductSection from "./product-section"
import QuestionnaireSection from "./questionnaire-section"
import DefectsSection from "./defects-section"
import ObservationsSection from "./observations-section"
import SignatureSection from "./signature-section"
import EvidenceSection from "./evidence-section"
import ActionButtons from "./action-buttons"
import React from "react"

export default function QualityInspectionForm() {
  // Actualizar el estado para incluir el área
  const [formData, setFormData] = useState({
    product: "",
    lot: "",
    date: "",
    area: "", // Añadido campo para área
    batchSize: "",
    sampleSize: "",
    inspectionLevel: "",
    observations: "",
    images: [],
    signatures: {
      assistant: null,
      chief: null,
    },
    questionnaire: {
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
    },
    criticalDefects: Array(6).fill({ description: "", units: "" }),
    majorDefects: Array(6).fill({ description: "", units: "" }),
    minorDefects: Array(3).fill({ description: "", units: "" }),
  })

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSimpleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDefectChange = (category, index, field, value) => {
    setFormData((prev) => {
      const newDefects = [...prev[category]]
      newDefects[index] = {
        ...newDefects[index],
        [field]: value,
      }
      return {
        ...prev,
        [category]: newDefects,
      }
    })
  }

  // Agregar función para manejar imágenes
  const handleAddImages = (newImages) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }))
  }

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleRemoveSelectedImages = (selectedIndices) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => !selectedIndices.includes(i)),
    }))
  }

  // Función para manejar las firmas
  const handleSignatureChange = (role, signatureData) => {
    setFormData((prev) => ({
      ...prev,
      signatures: {
        ...prev.signatures,
        [role]: signatureData,
      },
    }))
  }

  // Añadir función para cargar datos guardados
  const loadSavedData = () => {
    try {
      const savedForms = JSON.parse(localStorage.getItem("savedInspectionForms") || "[]")
      if (savedForms.length > 0) {
        // Opcional: Podríamos mostrar un diálogo para cargar un formulario guardado
        console.log("Formularios guardados disponibles:", savedForms.length)
      }
    } catch (error) {
      console.error("Error al cargar datos guardados:", error)
    }
  }

  // Añadir useEffect para cargar datos al iniciar
  React.useEffect(() => {
    loadSavedData()
  }, [])

  // Actualizar el return para incluir los nuevos componentes y cambiar el orden
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-md overflow-hidden quality-inspection-form">
      <FormHeader />
      <ApprovalSection />
      <ProductSection
        product={formData.product}
        lot={formData.lot}
        date={formData.date}
        area={formData.area} // Pasar el área al componente
        onProductChange={(value) => handleSimpleChange("product", value)}
        onLotChange={(value) => handleSimpleChange("lot", value)}
        onDateChange={(value) => handleSimpleChange("date", value)}
        onAreaChange={(value) => handleSimpleChange("area", value)} // Manejar cambios en el área
      />
      <QuestionnaireSection questionnaire={formData.questionnaire} onChange={handleChange} />
      <div className="grid grid-cols-3 gap-4 p-4 border-t border-b border-gray-300">
        <div className="border border-gray-300 p-2">
          <label className="block text-sm font-medium">Tamaño de lote:</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-1"
            value={formData.batchSize}
            onChange={(e) => handleSimpleChange("batchSize", e.target.value)}
          />
        </div>
        <div className="border border-gray-300 p-2">
          <label className="block text-sm font-medium">Tamaño de muestra:</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-1"
            value={formData.sampleSize}
            onChange={(e) => handleSimpleChange("sampleSize", e.target.value)}
          />
        </div>
        <div className="border border-gray-300 p-2">
          <label className="block text-sm font-medium">Nivel de inspección:</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-1"
            value={formData.inspectionLevel}
            onChange={(e) => handleSimpleChange("inspectionLevel", e.target.value)}
          />
        </div>
      </div>
      <DefectsSection
        criticalDefects={formData.criticalDefects}
        majorDefects={formData.majorDefects}
        minorDefects={formData.minorDefects}
        onDefectChange={handleDefectChange}
      />
      <ObservationsSection
        observations={formData.observations}
        onChange={(value) => handleSimpleChange("observations", value)}
      />
      <EvidenceSection
        images={formData.images}
        onAddImages={handleAddImages}
        onRemoveImage={handleRemoveImage}
        onRemoveSelectedImages={handleRemoveSelectedImages}
      />
      <SignatureSection signatures={formData.signatures} onSignatureChange={handleSignatureChange} />
      <ActionButtons formData={formData} />
    </div>
  )
}
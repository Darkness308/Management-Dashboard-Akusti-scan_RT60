"""
FastAPI Main Application - RT60 Backend

REST API für RT60-Berechnungen und Materialdatenbank-Zugriff.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import os
import tempfile
from pathlib import Path
from datetime import datetime

from src.acoustics import (
    calculate_rt60_sabine,
    calculate_rt60_eyring,
    get_room_volume,
    get_room_surface_areas,
    calculate_rt60_for_all_frequencies,
    DIN18041Validator,
    RoomUsageType,
)
from src.materials_db import MaterialRepository
from src.reports import RT60ReportGenerator


# FastAPI App initialisieren
app = FastAPI(
    title="RT60 Raumakustik API",
    description="REST API für Nachhallzeit-Berechnungen und akustische Analysen",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8080").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Material Repository initialisieren
try:
    material_repo = MaterialRepository()
except FileNotFoundError:
    print("⚠️  Materialdatenbank nicht gefunden - API läuft im eingeschränkten Modus")
    material_repo = None

# PDF Report Generator initialisieren
report_generator = RT60ReportGenerator()


# Pydantic Models
class RoomDimensions(BaseModel):
    """Raumdimensionen"""

    length: float = Field(..., gt=0, description="Raumlänge in Metern")
    width: float = Field(..., gt=0, description="Raumbreite in Metern")
    height: float = Field(..., gt=0, description="Raumhöhe in Metern")


class Surface(BaseModel):
    """Einzelne Oberfläche mit Material"""

    type: str = Field(..., description="Oberflächentyp (floor, ceiling, walls)")
    material_id: str = Field(..., description="Material-ID aus der Datenbank")
    area: float = Field(..., gt=0, description="Fläche in m²")


class RT60CalculationRequest(BaseModel):
    """Request-Body für RT60-Berechnung"""

    room: RoomDimensions
    surfaces: List[Surface]
    target_usage: Optional[str] = Field(
        "office", description="Raumnutzung (office, classroom, concert_hall, ...)"
    )
    use_eyring: Optional[bool] = Field(
        False, description="Eyring-Formel verwenden (True) oder Sabine (False)"
    )


class RT60Result(BaseModel):
    """RT60-Berechnungsergebnis"""

    rt60_values: Dict[int, float] = Field(..., description="RT60 pro Frequenzband")
    volume: float = Field(..., description="Raumvolumen in m³")
    total_surface_area: float = Field(..., description="Gesamtoberfläche in m²")
    formula_used: str = Field(..., description="Verwendete Formel (sabine/eyring)")
    din18041_compliance: Optional[Dict] = Field(
        None, description="DIN 18041 Validierung"
    )
    recommendations: List[str] = Field(default_factory=list, description="Empfehlungen")


class PDFReportRequest(BaseModel):
    """Request für PDF-Report-Generierung"""

    room: RoomDimensions
    surfaces: List[Surface]
    target_usage: Optional[str] = Field("office", description="Raumnutzung")
    rt60_result: Dict = Field(..., description="RT60-Berechnungsergebnis")
    project_name: Optional[str] = Field(None, description="Projektname")
    customer_name: Optional[str] = Field(None, description="Kundenname")


# API Endpoints
@app.get("/", tags=["General"])
async def root():
    """Root Endpoint - API Info"""
    return {
        "name": "RT60 Raumakustik API",
        "version": "0.1.0",
        "status": "operational",
        "endpoints": {
            "health": "/health",
            "materials": "/api/v1/materials",
            "calculate": "/api/v1/calculate",
            "docs": "/docs",
        },
    }


@app.get("/health", tags=["General"])
async def health_check():
    """Health Check Endpoint"""
    return {
        "status": "healthy",
        "material_database": material_repo is not None,
        "material_count": material_repo.get_material_count() if material_repo else 0,
    }


@app.get("/api/v1/materials", tags=["Materials"])
async def get_materials(category: Optional[str] = None):
    """
    Gibt alle verfügbaren Materialien zurück.

    Args:
        category: Optional - Filtere nach Kategorie (z.B. "Wände", "Decken")

    Returns:
        Liste aller Materialien
    """
    if material_repo is None:
        raise HTTPException(status_code=503, detail="Materialdatenbank nicht verfügbar")

    if category:
        materials = material_repo.get_materials_by_category(category)
    else:
        materials = material_repo.get_all_materials()

    return {
        "count": len(materials),
        "materials": [
            {
                "id": m.id,
                "name": m.name,
                "category": m.category,
                "alpha_w": m.alpha_w,
                "nrc": m.nrc,
                "description": m.description,
                "absorption_coefficients": m.absorption_coefficients,
            }
            for m in materials
        ],
    }


@app.get("/api/v1/materials/categories", tags=["Materials"])
async def get_categories():
    """Gibt alle verfügbaren Material-Kategorien zurück"""
    if material_repo is None:
        raise HTTPException(status_code=503, detail="Materialdatenbank nicht verfügbar")

    return {"categories": material_repo.get_categories()}


@app.get("/api/v1/materials/{material_id}", tags=["Materials"])
async def get_material(material_id: str):
    """
    Gibt ein einzelnes Material nach ID zurück.

    Args:
        material_id: Material-ID (z.B. "mat_001")
    """
    if material_repo is None:
        raise HTTPException(status_code=503, detail="Materialdatenbank nicht verfügbar")

    material = material_repo.get_material_by_id(material_id)

    if material is None:
        raise HTTPException(status_code=404, detail=f"Material {material_id} nicht gefunden")

    return {
        "id": material.id,
        "name": material.name,
        "category": material.category,
        "alpha_w": material.alpha_w,
        "nrc": material.nrc,
        "description": material.description,
        "absorption_coefficients": material.absorption_coefficients,
    }


@app.post("/api/v1/calculate", response_model=RT60Result, tags=["Calculations"])
async def calculate_rt60(request: RT60CalculationRequest):
    """
    Berechnet RT60 für einen Raum mit gegebenen Materialien.

    Args:
        request: RT60CalculationRequest mit Raumdaten und Materialien

    Returns:
        RT60Result mit Berechnungsergebnissen und DIN 18041 Validierung
    """
    if material_repo is None:
        raise HTTPException(status_code=503, detail="Materialdatenbank nicht verfügbar")

    # Raumvolumen berechnen
    try:
        volume = get_room_volume(
            request.room.length, request.room.width, request.room.height
        )
        surface_areas = get_room_surface_areas(
            request.room.length, request.room.width, request.room.height
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Materialien aus Datenbank holen und Oberflächen vorbereiten
    surfaces_by_frequency = {}

    for freq in [125, 250, 500, 1000, 2000, 4000]:
        surfaces_list = []

        for surface in request.surfaces:
            material = material_repo.get_material_by_id(surface.material_id)

            if material is None:
                raise HTTPException(
                    status_code=404, detail=f"Material {surface.material_id} nicht gefunden"
                )

            try:
                alpha = material.get_alpha_at_frequency(freq)
            except KeyError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Frequenz {freq} Hz nicht verfügbar für Material {material.name}",
                )

            surfaces_list.append({"area": surface.area, "alpha": alpha})

        surfaces_by_frequency[freq] = surfaces_list

    # RT60 berechnen
    try:
        rt60_values = calculate_rt60_for_all_frequencies(
            volume, surfaces_by_frequency, use_eyring=request.use_eyring
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Berechnungsfehler: {str(e)}")

    # DIN 18041 Validierung
    din_validation = None
    recommendations = []

    try:
        room_usage = RoomUsageType(request.target_usage)
        din_validation = DIN18041Validator.validate_frequency_band(
            rt60_values, room_usage, volume
        )
        recommendations = DIN18041Validator.get_recommendations(din_validation)
    except ValueError:
        # Unbekannter Raumtyp - Validierung überspringen
        pass

    return RT60Result(
        rt60_values=rt60_values,
        volume=volume,
        total_surface_area=surface_areas["total"],
        formula_used="eyring" if request.use_eyring else "sabine",
        din18041_compliance=din_validation,
        recommendations=recommendations,
    )


@app.get("/api/v1/room-types", tags=["Reference"])
async def get_room_types():
    """Gibt alle verfügbaren Raumnutzungstypen nach DIN 18041 zurück"""
    return {
        "room_types": [
            {"value": rt.value, "name": rt.name} for rt in RoomUsageType
        ]
    }


@app.post("/api/v1/export-pdf", tags=["Reports"])
async def export_pdf_report(request: PDFReportRequest):
    """
    Generiert einen PDF-Report mit RT60-Berechnungsergebnissen.

    Args:
        request: PDFReportRequest mit Raum, Materialien und Ergebnis

    Returns:
        PDF-Datei zum Download
    """
    if material_repo is None:
        raise HTTPException(status_code=503, detail="Materialdatenbank nicht verfügbar")

    try:
        # Materialien aus IDs holen
        materials_used = []
        for surface in request.surfaces:
            material = material_repo.get_material_by_id(surface.material_id)
            if material:
                materials_used.append({
                    "name": material.name,
                    "category": material.category,
                    "alpha_w": material.alpha_w,
                    "nrc": material.nrc,
                })

        # Temp-Datei erstellen
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            output_path = tmp_file.name

        # Raumdaten vorbereiten
        room_data = {
            "length": request.room.length,
            "width": request.room.width,
            "height": request.room.height,
            "usage": request.target_usage,
        }

        # PDF generieren
        report_generator.generate_report(
            output_path=output_path,
            room_data=room_data,
            rt60_result=request.rt60_result,
            materials_used=materials_used,
            project_name=request.project_name,
            customer_name=request.customer_name,
        )

        # PDF zurückgeben
        return FileResponse(
            output_path,
            media_type="application/pdf",
            filename=f"RT60_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fehler bei PDF-Generierung: {str(e)}")


# Run with: uvicorn src.api.main:app --reload
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

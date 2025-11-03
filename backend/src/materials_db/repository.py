"""
Material Repository

Lädt und verwaltet die Materialdatenbank mit Absorptionskoeffizienten.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass


@dataclass
class Material:
    """
    Repräsentiert ein Material mit seinen akustischen Eigenschaften.
    """

    id: str
    name: str
    category: str
    absorption_coefficients: Dict[str, float]  # Frequenz -> Alpha-Wert
    alpha_w: float  # Bewerteter Absorptionsgrad
    nrc: float  # Noise Reduction Coefficient
    description: str

    def get_alpha_at_frequency(self, frequency: int) -> float:
        """
        Gibt den Absorptionskoeffizienten für eine bestimmte Frequenz zurück.

        Args:
            frequency: Frequenz in Hz (z.B. 125, 250, 500, ...)

        Returns:
            float: Absorptionskoeffizient (0-1)

        Raises:
            KeyError: Wenn Frequenz nicht in den Daten vorhanden ist
        """
        freq_key = f"{frequency}Hz"

        if freq_key not in self.absorption_coefficients:
            raise KeyError(
                f"Frequenz {frequency} Hz nicht verfügbar für Material '{self.name}'"
            )

        return self.absorption_coefficients[freq_key]


class MaterialRepository:
    """
    Repository zum Laden und Verwalten der Materialdatenbank.
    """

    def __init__(self, database_path: Optional[str] = None):
        """
        Initialisiert das Material-Repository.

        Args:
            database_path: Pfad zur material_database.json.
                          Falls None, wird der Standard-Pfad verwendet.
        """
        if database_path is None:
            # Standard-Pfad: /shared/material_database.json
            current_dir = Path(__file__).parent
            database_path = (
                current_dir.parent.parent.parent / "shared" / "material_database.json"
            )

        self.database_path = Path(database_path)
        self.materials: Dict[str, Material] = {}
        self._load_database()

    def _load_database(self):
        """
        Lädt die Materialdatenbank aus der JSON-Datei.

        Raises:
            FileNotFoundError: Wenn Datenbankdatei nicht gefunden wurde
            json.JSONDecodeError: Wenn JSON ungültig ist
        """
        if not self.database_path.exists():
            raise FileNotFoundError(
                f"Materialdatenbank nicht gefunden: {self.database_path}"
            )

        with open(self.database_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Lade alle Materialien
        for mat_data in data.get("materials", []):
            material = Material(
                id=mat_data["id"],
                name=mat_data["name"],
                category=mat_data["category"],
                absorption_coefficients=mat_data["absorption_coefficients"],
                alpha_w=mat_data["alpha_w"],
                nrc=mat_data["nrc"],
                description=mat_data["description"],
            )
            self.materials[material.id] = material

    def get_all_materials(self) -> List[Material]:
        """
        Gibt alle verfügbaren Materialien zurück.

        Returns:
            Liste aller Material-Objekte
        """
        return list(self.materials.values())

    def get_material_by_id(self, material_id: str) -> Optional[Material]:
        """
        Sucht ein Material nach ID.

        Args:
            material_id: Material-ID (z.B. "mat_001")

        Returns:
            Material-Objekt oder None wenn nicht gefunden
        """
        return self.materials.get(material_id)

    def get_materials_by_category(self, category: str) -> List[Material]:
        """
        Filtert Materialien nach Kategorie.

        Args:
            category: Kategorie (z.B. "Wände", "Decken", "Böden")

        Returns:
            Liste von Materialien dieser Kategorie
        """
        return [m for m in self.materials.values() if m.category == category]

    def search_materials(self, query: str) -> List[Material]:
        """
        Durchsucht Materialien nach Name oder Beschreibung.

        Args:
            query: Suchbegriff (case-insensitive)

        Returns:
            Liste von passenden Materialien
        """
        query_lower = query.lower()
        results = []

        for material in self.materials.values():
            if (
                query_lower in material.name.lower()
                or query_lower in material.description.lower()
            ):
                results.append(material)

        return results

    def get_categories(self) -> List[str]:
        """
        Gibt alle verfügbaren Kategorien zurück.

        Returns:
            Sortierte Liste von Kategorien
        """
        categories = set(m.category for m in self.materials.values())
        return sorted(categories)

    def get_material_count(self) -> int:
        """
        Gibt die Anzahl der Materialien in der Datenbank zurück.

        Returns:
            int: Anzahl der Materialien
        """
        return len(self.materials)

    def to_dict(self) -> Dict:
        """
        Konvertiert alle Materialien zu einem Dictionary.

        Returns:
            Dict mit allen Materialien
        """
        return {
            "count": self.get_material_count(),
            "categories": self.get_categories(),
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
                for m in self.materials.values()
            ],
        }

"""
DIN 18041 Compliance Validation

Validierung der Nachhallzeiten nach DIN 18041:2016-03
"Hörsamkeit in Räumen - Anforderungen, Empfehlungen und Hinweise für die Planung"

Referenz: DIN 18041:2016-03
"""

from enum import Enum
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass


class RoomUsageType(str, Enum):
    """
    Raumnutzungstypen nach DIN 18041
    """

    # Typ A: Räume für Sprache und Musik
    CLASSROOM = "classroom"  # Klassenraum / Unterrichtsraum
    LECTURE_HALL = "lecture_hall"  # Hörsaal
    CONFERENCE_ROOM = "conference"  # Konferenzraum
    OFFICE = "office"  # Büro

    # Typ B: Räume für Musik und Sprachdarbietungen
    CONCERT_HALL = "concert_hall"  # Konzertsaal
    OPERA_HOUSE = "opera"  # Opernhaus
    THEATER = "theater"  # Theater

    # Spezielle Räume
    RECORDING_STUDIO = "recording_studio"  # Aufnahmestudio
    BROADCAST_STUDIO = "broadcast_studio"  # Sendestudio
    SPORTS_HALL = "sports_hall"  # Sporthalle
    RESTAURANT = "restaurant"  # Restaurant
    CALL_CENTER = "call_center"  # Call Center


@dataclass
class RT60Range:
    """
    Soll-Nachhallzeit-Bereich für eine Raumnutzung
    """

    min_rt60: float  # Minimale Soll-Nachhallzeit in Sekunden
    max_rt60: float  # Maximale Soll-Nachhallzeit in Sekunden
    tolerance: float = 0.1  # Toleranz in Sekunden


# DIN 18041 Soll-Werte für verschiedene Raumtypen
# Format: {RoomUsageType: (min_volume, max_volume, RT60Range)}
DIN18041_TARGET_VALUES = {
    # Typ A: Sprache und Kommunikation
    RoomUsageType.CLASSROOM: {
        "volume_range": (0, 250),  # m³
        "rt60_range": RT60Range(min_rt60=0.6, max_rt60=0.8),
    },
    RoomUsageType.LECTURE_HALL: {
        "volume_range": (250, 5000),  # m³
        "rt60_range": RT60Range(min_rt60=0.7, max_rt60=1.0),
    },
    RoomUsageType.CONFERENCE_ROOM: {
        "volume_range": (0, 500),  # m³
        "rt60_range": RT60Range(min_rt60=0.5, max_rt60=0.8),
    },
    RoomUsageType.OFFICE: {
        "volume_range": (0, 200),  # m³
        "rt60_range": RT60Range(min_rt60=0.35, max_rt60=0.55),
    },
    # Typ B: Musik und Darbietungen
    RoomUsageType.CONCERT_HALL: {
        "volume_range": (5000, 25000),  # m³
        "rt60_range": RT60Range(min_rt60=1.5, max_rt60=2.5),
    },
    RoomUsageType.OPERA_HOUSE: {
        "volume_range": (5000, 15000),  # m³
        "rt60_range": RT60Range(min_rt60=1.3, max_rt60=1.8),
    },
    RoomUsageType.THEATER: {
        "volume_range": (2000, 10000),  # m³
        "rt60_range": RT60Range(min_rt60=0.8, max_rt60=1.2),
    },
    # Spezielle Räume
    RoomUsageType.RECORDING_STUDIO: {
        "volume_range": (0, 500),  # m³
        "rt60_range": RT60Range(min_rt60=0.2, max_rt60=0.4),
    },
    RoomUsageType.BROADCAST_STUDIO: {
        "volume_range": (0, 300),  # m³
        "rt60_range": RT60Range(min_rt60=0.25, max_rt60=0.35),
    },
    RoomUsageType.SPORTS_HALL: {
        "volume_range": (1000, 10000),  # m³
        "rt60_range": RT60Range(min_rt60=1.5, max_rt60=2.0),
    },
    RoomUsageType.RESTAURANT: {
        "volume_range": (0, 1000),  # m³
        "rt60_range": RT60Range(min_rt60=0.5, max_rt60=0.8),
    },
    RoomUsageType.CALL_CENTER: {
        "volume_range": (0, 500),  # m³
        "rt60_range": RT60Range(min_rt60=0.3, max_rt60=0.5),
    },
}


class DIN18041Validator:
    """
    Validiert Nachhallzeiten nach DIN 18041:2016-03
    """

    @staticmethod
    def get_target_rt60(
        room_usage: RoomUsageType, volume: float
    ) -> Optional[RT60Range]:
        """
        Gibt den Soll-RT60-Bereich für eine Raumnutzung zurück.

        Args:
            room_usage: Typ der Raumnutzung
            volume: Raumvolumen in m³

        Returns:
            RT60Range oder None wenn keine Angabe für diesen Raumtyp existiert
        """
        if room_usage not in DIN18041_TARGET_VALUES:
            return None

        target = DIN18041_TARGET_VALUES[room_usage]
        volume_min, volume_max = target["volume_range"]

        # Prüfe ob Volumen im gültigen Bereich liegt
        if not (volume_min <= volume <= volume_max):
            # Warnung, aber trotzdem Werte zurückgeben
            pass

        return target["rt60_range"]

    @staticmethod
    def validate_rt60(
        measured_rt60: float, room_usage: RoomUsageType, volume: float
    ) -> Dict[str, any]:
        """
        Validiert eine gemessene/berechnete RT60 gegen DIN 18041.

        Args:
            measured_rt60: Gemessene/berechnete Nachhallzeit in Sekunden
            room_usage: Typ der Raumnutzung
            volume: Raumvolumen in m³

        Returns:
            Dict mit Validierungsergebnis:
            {
                "compliant": bool,
                "status": str,
                "target_range": (float, float),
                "measured": float,
                "deviation": float,
                "message": str
            }
        """
        target_range = DIN18041Validator.get_target_rt60(room_usage, volume)

        if target_range is None:
            return {
                "compliant": None,
                "status": "unknown",
                "target_range": None,
                "measured": measured_rt60,
                "deviation": None,
                "message": f"Keine DIN 18041 Vorgaben für Raumtyp '{room_usage}'",
            }

        min_rt60 = target_range.min_rt60
        max_rt60 = target_range.max_rt60
        tolerance = target_range.tolerance

        # Berechne Abweichung
        if measured_rt60 < min_rt60:
            deviation = min_rt60 - measured_rt60
            status = "too_short"
            compliant = deviation <= tolerance
            message = (
                f"RT60 zu kurz: {measured_rt60:.2f}s "
                f"(Soll: {min_rt60:.2f}-{max_rt60:.2f}s, Abweichung: -{deviation:.2f}s)"
            )
        elif measured_rt60 > max_rt60:
            deviation = measured_rt60 - max_rt60
            status = "too_long"
            compliant = deviation <= tolerance
            message = (
                f"RT60 zu lang: {measured_rt60:.2f}s "
                f"(Soll: {min_rt60:.2f}-{max_rt60:.2f}s, Abweichung: +{deviation:.2f}s)"
            )
        else:
            deviation = 0.0
            status = "compliant"
            compliant = True
            message = (
                f"RT60 im Soll-Bereich: {measured_rt60:.2f}s "
                f"(DIN 18041: {min_rt60:.2f}-{max_rt60:.2f}s)"
            )

        return {
            "compliant": compliant,
            "status": status,
            "target_range": (min_rt60, max_rt60),
            "measured": measured_rt60,
            "deviation": deviation if deviation > 0 else 0.0,
            "message": message,
        }

    @staticmethod
    def validate_frequency_band(
        rt60_values: Dict[int, float], room_usage: RoomUsageType, volume: float
    ) -> Dict[str, any]:
        """
        Validiert RT60-Werte für alle Frequenzbänder.

        DIN 18041 bezieht sich hauptsächlich auf die mittleren Frequenzen
        (500 Hz und 1000 Hz).

        Args:
            rt60_values: Dict mit Frequenz -> RT60 (z.B. {500: 0.65, 1000: 0.62})
            room_usage: Raumnutzungstyp
            volume: Raumvolumen in m³

        Returns:
            Dict mit Gesamt-Validierungsergebnis
        """
        # Relevante Frequenzen für DIN 18041 (500 Hz und 1000 Hz)
        relevant_frequencies = [500, 1000]

        results = {}
        for freq in relevant_frequencies:
            if freq in rt60_values:
                results[freq] = DIN18041Validator.validate_rt60(
                    rt60_values[freq], room_usage, volume
                )

        # Durchschnitt berechnen
        if results:
            avg_rt60 = sum(r["measured"] for r in results.values()) / len(results)
            all_compliant = all(r["compliant"] for r in results.values())

            return {
                "overall_compliant": all_compliant,
                "average_rt60": round(avg_rt60, 2),
                "frequency_results": results,
                "room_usage": room_usage.value,
                "volume": volume,
            }
        else:
            return {
                "overall_compliant": None,
                "average_rt60": None,
                "frequency_results": {},
                "room_usage": room_usage.value,
                "volume": volume,
                "message": "Keine relevanten Frequenzen (500 Hz, 1000 Hz) vorhanden",
            }

    @staticmethod
    def get_recommendations(
        validation_result: Dict[str, any]
    ) -> List[str]:
        """
        Gibt Empfehlungen basierend auf dem Validierungsergebnis.

        Args:
            validation_result: Ergebnis von validate_rt60() oder validate_frequency_band()

        Returns:
            Liste von Empfehlungsstrings
        """
        recommendations = []

        if "frequency_results" in validation_result:
            # Multi-Frequenz Ergebnis
            for freq, result in validation_result["frequency_results"].items():
                if result["status"] == "too_long":
                    recommendations.append(
                        f"Bei {freq} Hz: Mehr absorbierende Materialien hinzufügen "
                        f"(z.B. Akustikdecken, Teppiche, Vorhänge)"
                    )
                elif result["status"] == "too_short":
                    recommendations.append(
                        f"Bei {freq} Hz: Weniger absorbierende Materialien verwenden "
                        f"(z.B. harte Oberflächen beibehalten)"
                    )
        else:
            # Einzelnes Ergebnis
            if validation_result["status"] == "too_long":
                recommendations.append(
                    "Nachhallzeit zu lang - Empfehlungen:\n"
                    "  • Akustikdeckenplatten installieren (α_w ≥ 0.80)\n"
                    "  • Wandabsorber anbringen (Steinwolle, Schaumstoff)\n"
                    "  • Teppichböden oder schwere Vorhänge einsetzen\n"
                    "  • Polstermöbel hinzufügen"
                )
            elif validation_result["status"] == "too_short":
                recommendations.append(
                    "Nachhallzeit zu kurz - Empfehlungen:\n"
                    "  • Harte, reflektierende Oberflächen beibehalten\n"
                    "  • Absorbierende Materialien reduzieren\n"
                    "  • Diffusoren statt Absorber verwenden"
                )
            elif validation_result["status"] == "compliant":
                recommendations.append(
                    "✓ Raumakustik entspricht DIN 18041 - keine Maßnahmen erforderlich"
                )

        return recommendations

"""
RT60 Calculation Formulas

Implementierung der Sabine- und Eyring-Formeln zur Berechnung
der Nachhallzeit nach akustischen Standards.

Referenzen:
    - Sabine, W.C. (1922): Collected Papers on Acoustics
    - DIN 18041:2016-03: Hörsamkeit in Räumen
    - ISO 3382: Messung der Raumakustik
"""

import math
from typing import Dict, List, Tuple


# Konstanten
SABINE_CONSTANT = 0.163  # m/s für metrische Einheiten
FREQUENCY_BANDS = [125, 250, 500, 1000, 2000, 4000]  # Hz (Oktavbänder)


def calculate_total_absorption(
    surfaces: List[Dict[str, float]], frequency: int
) -> float:
    """
    Berechnet die äquivalente Absorptionsfläche A für eine Frequenz.

    Die äquivalente Absorptionsfläche ist die Summe aller Einzelflächen
    multipliziert mit ihren jeweiligen Absorptionskoeffizienten.

    Args:
        surfaces: Liste von Oberflächen mit 'area' und 'alpha' (Absorptionskoeffizient)
        frequency: Frequenz in Hz (z.B. 125, 250, 500, ...)

    Returns:
        float: Gesamte Absorptionsfläche A in m²

    Formula:
        A = Σ(Si × αi)
        wobei Si = Fläche i, αi = Absorptionskoeffizient der Fläche i

    Example:
        >>> surfaces = [
        ...     {"area": 80.0, "alpha": 0.10},  # Boden
        ...     {"area": 80.0, "alpha": 0.80},  # Decke
        ...     {"area": 108.0, "alpha": 0.05}  # Wände
        ... ]
        >>> calculate_total_absorption(surfaces, 500)
        76.4
    """
    total_absorption = 0.0

    for surface in surfaces:
        area = surface.get("area", 0.0)
        alpha = surface.get("alpha", 0.0)

        # Absorptionskoeffizient muss zwischen 0 und 1 liegen
        if not 0 <= alpha <= 1.0:
            raise ValueError(
                f"Absorptionskoeffizient muss zwischen 0 und 1 liegen, erhalten: {alpha}"
            )

        total_absorption += area * alpha

    return total_absorption


def calculate_rt60_sabine(volume: float, absorption_area: float) -> float:
    """
    Berechnet die Nachhallzeit nach der Sabine-Formel.

    Die Sabine-Formel gilt für Räume mit diffusem Schallfeld und
    relativ geringer Absorption (α_avg < 0.3).

    Args:
        volume: Raumvolumen in m³
        absorption_area: Äquivalente Absorptionsfläche A in m²

    Returns:
        float: Nachhallzeit T60 in Sekunden

    Raises:
        ValueError: Wenn volume <= 0 oder absorption_area <= 0

    Formula:
        T = 0.163 × V / A

        wobei:
        T = Nachhallzeit (s)
        V = Raumvolumen (m³)
        A = äquivalente Absorptionsfläche (m²)
        0.163 = Sabine-Konstante für metrische Einheiten

    Example:
        >>> calculate_rt60_sabine(volume=240.0, absorption_area=50.0)
        0.7824
    """
    if volume <= 0:
        raise ValueError(f"Raumvolumen muss größer als 0 sein, erhalten: {volume}")

    if absorption_area <= 0:
        raise ValueError(
            f"Absorptionsfläche muss größer als 0 sein, erhalten: {absorption_area}"
        )

    rt60 = SABINE_CONSTANT * volume / absorption_area

    return round(rt60, 2)


def calculate_average_absorption_coefficient(
    surfaces: List[Dict[str, float]]
) -> float:
    """
    Berechnet den durchschnittlichen Absorptionskoeffizienten.

    Args:
        surfaces: Liste von Oberflächen mit 'area' und 'alpha'

    Returns:
        float: Durchschnittlicher Absorptionskoeffizient (0-1)

    Formula:
        α_avg = (Σ Si × αi) / Σ Si

    Example:
        >>> surfaces = [
        ...     {"area": 80.0, "alpha": 0.10},
        ...     {"area": 80.0, "alpha": 0.80}
        ... ]
        >>> calculate_average_absorption_coefficient(surfaces)
        0.45
    """
    total_area = sum(s.get("area", 0.0) for s in surfaces)
    total_absorption = sum(s.get("area", 0.0) * s.get("alpha", 0.0) for s in surfaces)

    if total_area == 0:
        return 0.0

    avg_alpha = total_absorption / total_area
    return round(avg_alpha, 3)


def calculate_rt60_eyring(
    volume: float, total_surface_area: float, average_alpha: float
) -> float:
    """
    Berechnet die Nachhallzeit nach der Eyring-Formel.

    Die Eyring-Formel ist genauer bei höheren Absorptionsgraden (α > 0.3)
    und berücksichtigt die exponentielle Abnahme der Schallenergie.

    Args:
        volume: Raumvolumen in m³
        total_surface_area: Gesamte Oberfläche S in m²
        average_alpha: Durchschnittlicher Absorptionskoeffizient (0-1)

    Returns:
        float: Nachhallzeit T60 in Sekunden

    Raises:
        ValueError: Wenn Parameter ungültig sind

    Formula:
        T = 0.163 × V / [-S × ln(1 - α_avg)]

        wobei:
        T = Nachhallzeit (s)
        V = Raumvolumen (m³)
        S = Gesamtoberfläche (m²)
        α_avg = durchschnittlicher Absorptionskoeffizient
        ln = natürlicher Logarithmus

    Notes:
        - Für α_avg → 1 wird die Formel instabil
        - Bei α_avg = 0 ist die Formel nicht definiert (Division durch 0)
        - Für α_avg < 0.3 sollte Sabine bevorzugt werden

    Example:
        >>> calculate_rt60_eyring(volume=240.0, total_surface_area=268.0, average_alpha=0.25)
        0.64
    """
    if volume <= 0:
        raise ValueError(f"Raumvolumen muss größer als 0 sein, erhalten: {volume}")

    if total_surface_area <= 0:
        raise ValueError(
            f"Gesamtoberfläche muss größer als 0 sein, erhalten: {total_surface_area}"
        )

    if not 0 < average_alpha < 1.0:
        raise ValueError(
            f"Durchschnittlicher Absorptionskoeffizient muss zwischen 0 und 1 liegen (exklusiv), erhalten: {average_alpha}"
        )

    # Berechnung: T = 0.163 × V / [-S × ln(1 - α)]
    denominator = -total_surface_area * math.log(1 - average_alpha)

    if denominator == 0:
        raise ValueError("Division durch Null bei Eyring-Formel")

    rt60 = SABINE_CONSTANT * volume / denominator

    return round(rt60, 2)


def calculate_rt60_for_all_frequencies(
    volume: float,
    surfaces_by_frequency: Dict[int, List[Dict[str, float]]],
    use_eyring: bool = False,
) -> Dict[int, float]:
    """
    Berechnet RT60 für alle Standard-Oktavbänder.

    Args:
        volume: Raumvolumen in m³
        surfaces_by_frequency: Dict mit Frequenz -> Liste von Oberflächen
                               Jede Oberfläche: {"area": float, "alpha": float}
        use_eyring: True für Eyring-Formel, False für Sabine (Standard)

    Returns:
        Dict[int, float]: RT60-Werte für jede Frequenz in Sekunden

    Example:
        >>> surfaces_500hz = [
        ...     {"area": 80.0, "alpha": 0.10},
        ...     {"area": 80.0, "alpha": 0.80}
        ... ]
        >>> surfaces_by_freq = {500: surfaces_500hz, 1000: surfaces_500hz}
        >>> calculate_rt60_for_all_frequencies(240.0, surfaces_by_freq)
        {500: 0.43, 1000: 0.43}
    """
    rt60_results = {}

    for frequency in FREQUENCY_BANDS:
        if frequency not in surfaces_by_frequency:
            continue

        surfaces = surfaces_by_frequency[frequency]

        if use_eyring:
            # Eyring-Formel verwenden
            total_area = sum(s.get("area", 0.0) for s in surfaces)
            avg_alpha = calculate_average_absorption_coefficient(surfaces)

            if avg_alpha == 0:
                # Fallback zu Sabine bei α = 0
                absorption_area = calculate_total_absorption(surfaces, frequency)
                rt60 = calculate_rt60_sabine(volume, absorption_area)
            else:
                rt60 = calculate_rt60_eyring(volume, total_area, avg_alpha)
        else:
            # Sabine-Formel verwenden (Standard)
            absorption_area = calculate_total_absorption(surfaces, frequency)
            rt60 = calculate_rt60_sabine(volume, absorption_area)

        rt60_results[frequency] = rt60

    return rt60_results


def get_room_volume(length: float, width: float, height: float) -> float:
    """
    Berechnet das Raumvolumen für rechteckige Räume.

    Args:
        length: Länge in Metern
        width: Breite in Metern
        height: Höhe in Metern

    Returns:
        float: Volumen in m³

    Example:
        >>> get_room_volume(10.0, 8.0, 3.0)
        240.0
    """
    if length <= 0 or width <= 0 or height <= 0:
        raise ValueError("Alle Raumdimensionen müssen größer als 0 sein")

    return round(length * width * height, 2)


def get_room_surface_areas(
    length: float, width: float, height: float
) -> Dict[str, float]:
    """
    Berechnet die Oberflächen eines rechteckigen Raums.

    Args:
        length: Länge in Metern
        width: Breite in Metern
        height: Höhe in Metern

    Returns:
        Dict mit 'floor', 'ceiling', 'walls' und 'total' in m²

    Example:
        >>> get_room_surface_areas(10.0, 8.0, 3.0)
        {'floor': 80.0, 'ceiling': 80.0, 'walls': 108.0, 'total': 268.0}
    """
    floor_area = length * width
    ceiling_area = length * width
    wall_area = 2 * (length * height) + 2 * (width * height)
    total_area = floor_area + ceiling_area + wall_area

    return {
        "floor": round(floor_area, 2),
        "ceiling": round(ceiling_area, 2),
        "walls": round(wall_area, 2),
        "total": round(total_area, 2),
    }

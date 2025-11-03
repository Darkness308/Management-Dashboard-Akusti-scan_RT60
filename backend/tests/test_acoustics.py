"""
Unit Tests für Akustik-Berechnungen (Sabine, Eyring, RT60)
"""

import pytest
import math
from src.acoustics.formulas import (
    calculate_rt60_sabine,
    calculate_rt60_eyring,
    calculate_total_absorption,
    calculate_average_absorption_coefficient,
    get_room_volume,
    get_room_surface_areas,
    calculate_rt60_for_all_frequencies,
)


class TestSabineFormula:
    """Tests für die Sabine-Formel"""

    def test_sabine_basic_calculation(self):
        """Test der Basis-Berechnung nach Sabine"""
        # Beispiel: 10m x 8m x 3m Raum = 240 m³
        # Absorption: 50 m²
        # Erwartung: T = 0.163 * 240 / 50 = 0.7824 s
        volume = 240.0
        absorption_area = 50.0

        result = calculate_rt60_sabine(volume, absorption_area)

        assert result == pytest.approx(0.78, abs=0.01)

    def test_sabine_high_absorption(self):
        """Test mit hoher Absorption (kurze Nachhallzeit)"""
        volume = 200.0
        absorption_area = 100.0  # Viel Absorption

        result = calculate_rt60_sabine(volume, absorption_area)

        # T = 0.163 * 200 / 100 = 0.326 s
        assert result == pytest.approx(0.33, abs=0.01)

    def test_sabine_low_absorption(self):
        """Test mit geringer Absorption (lange Nachhallzeit)"""
        volume = 5000.0  # Konzertsaal
        absorption_area = 500.0

        result = calculate_rt60_sabine(volume, absorption_area)

        # T = 0.163 * 5000 / 500 = 1.63 s
        assert result == pytest.approx(1.63, abs=0.01)

    def test_sabine_zero_volume_raises_error(self):
        """Test: Volumen = 0 sollte Fehler auslösen"""
        with pytest.raises(ValueError, match="Raumvolumen muss größer als 0 sein"):
            calculate_rt60_sabine(volume=0, absorption_area=50)

    def test_sabine_negative_volume_raises_error(self):
        """Test: Negatives Volumen sollte Fehler auslösen"""
        with pytest.raises(ValueError):
            calculate_rt60_sabine(volume=-10, absorption_area=50)

    def test_sabine_zero_absorption_raises_error(self):
        """Test: Absorption = 0 sollte Fehler auslösen"""
        with pytest.raises(ValueError, match="Absorptionsfläche muss größer als 0 sein"):
            calculate_rt60_sabine(volume=240, absorption_area=0)


class TestEyringFormula:
    """Tests für die Eyring-Formel"""

    def test_eyring_basic_calculation(self):
        """Test der Basis-Berechnung nach Eyring"""
        volume = 240.0
        total_surface = 268.0  # 10*8*2 + (10*3 + 8*3)*2
        avg_alpha = 0.25

        result = calculate_rt60_eyring(volume, total_surface, avg_alpha)

        # T = 0.163 * 240 / [-268 * ln(1 - 0.25)]
        # T = 39.12 / [-268 * ln(0.75)]
        # T = 39.12 / [-268 * (-0.2877)]
        # T = 39.12 / 77.1 ≈ 0.51 s
        assert result == pytest.approx(0.51, abs=0.02)

    def test_eyring_high_absorption(self):
        """Test mit hoher Absorption (α = 0.6)"""
        volume = 200.0
        total_surface = 200.0
        avg_alpha = 0.6

        result = calculate_rt60_eyring(volume, total_surface, avg_alpha)

        # Sollte kürzere RT60 als bei geringer Absorption haben
        assert result < 0.5

    def test_eyring_alpha_zero_raises_error(self):
        """Test: α = 0 sollte Fehler auslösen (ln(1-0) = 0)"""
        with pytest.raises(ValueError):
            calculate_rt60_eyring(volume=240, total_surface=268, average_alpha=0.0)

    def test_eyring_alpha_one_raises_error(self):
        """Test: α = 1 sollte Fehler auslösen (ln(1-1) = ln(0) → undefined)"""
        with pytest.raises(ValueError):
            calculate_rt60_eyring(volume=240, total_surface=268, average_alpha=1.0)

    def test_eyring_invalid_alpha_raises_error(self):
        """Test: α > 1 sollte Fehler auslösen"""
        with pytest.raises(ValueError):
            calculate_rt60_eyring(volume=240, total_surface=268, average_alpha=1.5)


class TestAbsorptionCalculations:
    """Tests für Absorptionsberechnungen"""

    def test_total_absorption_simple(self):
        """Test der Gesamt-Absorption"""
        surfaces = [
            {"area": 80.0, "alpha": 0.10},  # Boden
            {"area": 80.0, "alpha": 0.80},  # Decke (Akustikdecke)
            {"area": 108.0, "alpha": 0.05},  # Wände
        ]

        result = calculate_total_absorption(surfaces, frequency=500)

        # A = 80*0.10 + 80*0.80 + 108*0.05
        # A = 8 + 64 + 5.4 = 77.4
        assert result == pytest.approx(77.4, abs=0.1)

    def test_total_absorption_empty_list(self):
        """Test mit leerer Oberflächen-Liste"""
        result = calculate_total_absorption([], frequency=500)
        assert result == 0.0

    def test_total_absorption_invalid_alpha_raises_error(self):
        """Test: α > 1 sollte Fehler auslösen"""
        surfaces = [{"area": 100.0, "alpha": 1.5}]

        with pytest.raises(ValueError, match="Absorptionskoeffizient muss zwischen 0 und 1 liegen"):
            calculate_total_absorption(surfaces, frequency=500)

    def test_average_absorption_coefficient(self):
        """Test des durchschnittlichen Absorptionskoeffizienten"""
        surfaces = [
            {"area": 80.0, "alpha": 0.10},
            {"area": 80.0, "alpha": 0.80},
        ]

        result = calculate_average_absorption_coefficient(surfaces)

        # α_avg = (80*0.10 + 80*0.80) / (80 + 80)
        # α_avg = (8 + 64) / 160 = 72 / 160 = 0.45
        assert result == pytest.approx(0.45, abs=0.01)

    def test_average_absorption_zero_area(self):
        """Test mit Gesamtfläche = 0"""
        surfaces = [{"area": 0.0, "alpha": 0.5}]

        result = calculate_average_absorption_coefficient(surfaces)

        assert result == 0.0


class TestRoomGeometry:
    """Tests für Raumgeometrie-Berechnungen"""

    def test_room_volume_rectangular(self):
        """Test Volumen-Berechnung rechteckiger Raum"""
        volume = get_room_volume(length=10.0, width=8.0, height=3.0)

        assert volume == 240.0

    def test_room_volume_zero_dimension_raises_error(self):
        """Test: Dimension = 0 sollte Fehler auslösen"""
        with pytest.raises(ValueError, match="Alle Raumdimensionen müssen größer als 0 sein"):
            get_room_volume(length=0, width=8, height=3)

    def test_room_surface_areas(self):
        """Test Oberflächenberechnung"""
        surfaces = get_room_surface_areas(length=10.0, width=8.0, height=3.0)

        assert surfaces["floor"] == 80.0
        assert surfaces["ceiling"] == 80.0
        # Wände: 2*(10*3) + 2*(8*3) = 60 + 48 = 108
        assert surfaces["walls"] == 108.0
        # Gesamt: 80 + 80 + 108 = 268
        assert surfaces["total"] == 268.0


class TestMultiFrequencyCalculation:
    """Tests für Multi-Frequenz RT60-Berechnungen"""

    def test_rt60_all_frequencies_sabine(self):
        """Test RT60-Berechnung für alle Frequenzbänder (Sabine)"""
        volume = 240.0

        surfaces_by_freq = {
            500: [
                {"area": 80.0, "alpha": 0.10},
                {"area": 80.0, "alpha": 0.80},
                {"area": 108.0, "alpha": 0.05},
            ],
            1000: [
                {"area": 80.0, "alpha": 0.15},
                {"area": 80.0, "alpha": 0.85},
                {"area": 108.0, "alpha": 0.07},
            ],
        }

        results = calculate_rt60_for_all_frequencies(
            volume, surfaces_by_freq, use_eyring=False
        )

        assert 500 in results
        assert 1000 in results
        assert results[500] > 0
        assert results[1000] > 0
        # Bei höherer Absorption sollte RT60 kürzer sein
        assert results[1000] < results[500]


class TestIntegrationExample:
    """Integrationstests mit realistischen Szenarien"""

    def test_office_room_calculation(self):
        """
        Realistisches Beispiel: Büroraum 10m x 8m x 3m

        DIN 18041 Soll für Büros: 0.35 - 0.55 s
        """
        # Raumdimensionen
        length, width, height = 10.0, 8.0, 3.0
        volume = get_room_volume(length, width, height)
        surface_areas = get_room_surface_areas(length, width, height)

        # Materialien (bei 500 Hz):
        # - Boden: Teppich (α = 0.57)
        # - Decke: Akustikdecke (α = 0.80)
        # - Wände: Gipskarton (α = 0.05)
        surfaces = [
            {"area": surface_areas["floor"], "alpha": 0.57},
            {"area": surface_areas["ceiling"], "alpha": 0.80},
            {"area": surface_areas["walls"], "alpha": 0.05},
        ]

        absorption = calculate_total_absorption(surfaces, 500)
        rt60 = calculate_rt60_sabine(volume, absorption)

        # A = 80*0.57 + 80*0.80 + 108*0.05 = 45.6 + 64 + 5.4 = 115
        # T = 0.163 * 240 / 115 ≈ 0.34 s

        # Sollte nahe am DIN 18041 Soll-Bereich sein (0.35-0.55 s)
        assert 0.3 <= rt60 <= 0.6

    def test_classroom_calculation(self):
        """
        Beispiel: Klassenraum 8m x 7m x 3.5m

        DIN 18041 Soll für Klassenräume: 0.6 - 0.8 s
        """
        volume = get_room_volume(8.0, 7.0, 3.5)
        surface_areas = get_room_surface_areas(8.0, 7.0, 3.5)

        # Typische Klassenraum-Materialien
        surfaces = [
            {"area": surface_areas["floor"], "alpha": 0.10},  # Linoleum
            {"area": surface_areas["ceiling"], "alpha": 0.70},  # Teil-Akustikdecke
            {"area": surface_areas["walls"], "alpha": 0.05},  # Verputzte Wände
        ]

        absorption = calculate_total_absorption(surfaces, 500)
        rt60 = calculate_rt60_sabine(volume, absorption)

        # Sollte im Bereich 0.6-0.8 s liegen
        assert 0.4 <= rt60 <= 1.0

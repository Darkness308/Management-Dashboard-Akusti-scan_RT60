"""
RT60 PDF Report Generator

Generiert professionelle PDF-Reports mit:
- Raumdaten und RT60-Ergebnissen
- DIN 18041 Compliance-Status
- Frequenz-Charts
- Material-Übersicht
- Empfehlungen
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    Image as RLImage,
)
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics import renderPDF

from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path
import io


class RT60ReportGenerator:
    """
    PDF-Report-Generator für RT60-Berechnungen
    """

    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_custom_styles(self):
        """Erstellt custom Paragraph-Styles"""
        # Titel-Style
        self.styles.add(
            ParagraphStyle(
                name="CustomTitle",
                parent=self.styles["Heading1"],
                fontSize=24,
                textColor=colors.HexColor("#007AFF"),
                spaceAfter=30,
                alignment=TA_CENTER,
            )
        )

        # Untertitel-Style
        self.styles.add(
            ParagraphStyle(
                name="Subtitle",
                parent=self.styles["Normal"],
                fontSize=12,
                textColor=colors.grey,
                spaceAfter=20,
                alignment=TA_CENTER,
            )
        )

        # Section Header
        self.styles.add(
            ParagraphStyle(
                name="SectionHeader",
                parent=self.styles["Heading2"],
                fontSize=16,
                textColor=colors.HexColor("#333333"),
                spaceAfter=12,
                spaceBefore=20,
            )
        )

    def generate_report(
        self,
        output_path: str,
        room_data: Dict,
        rt60_result: Dict,
        materials_used: List[Dict],
        project_name: Optional[str] = None,
        customer_name: Optional[str] = None,
        photos: Optional[List[str]] = None,
    ) -> str:
        """
        Generiert einen vollständigen PDF-Report.

        Args:
            output_path: Pfad zur Output-PDF
            room_data: Raumdaten (length, width, height, usage)
            rt60_result: RT60-Berechnungsergebnis
            materials_used: Liste von verwendeten Materialien
            project_name: Optional - Projektname
            customer_name: Optional - Kundenname
            photos: Optional - Liste von Foto-Pfaden

        Returns:
            str: Pfad zur generierten PDF

        Example:
            >>> generator = RT60ReportGenerator()
            >>> generator.generate_report(
            ...     output_path="report.pdf",
            ...     room_data={"length": 10, "width": 8, "height": 3, "usage": "office"},
            ...     rt60_result={"rt60_values": {500: 0.45, 1000: 0.42}, ...},
            ...     materials_used=[{"name": "Teppich", "alpha_w": 0.60}],
            ...     project_name="Büro Hauptgebäude",
            ...     customer_name="Firma XYZ GmbH"
            ... )
            'report.pdf'
        """
        # PDF-Dokument erstellen
        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=20 * mm,
            leftMargin=20 * mm,
            topMargin=20 * mm,
            bottomMargin=20 * mm,
        )

        # Story (Inhalt) aufbauen
        story = []

        # 1. Titel-Seite
        story.extend(self._build_title_page(project_name, customer_name))

        # 2. Projekt-Informationen
        story.extend(self._build_project_info(room_data, project_name, customer_name))

        # 3. RT60-Ergebnisse
        story.extend(self._build_rt60_results(rt60_result))

        # 4. Frequenz-Chart
        story.extend(self._build_frequency_chart(rt60_result))

        # 5. DIN 18041 Compliance
        if "din18041_compliance" in rt60_result and rt60_result["din18041_compliance"]:
            story.extend(self._build_compliance_section(rt60_result["din18041_compliance"]))

        # 6. Material-Übersicht
        story.extend(self._build_materials_table(materials_used))

        # 7. Empfehlungen
        if "recommendations" in rt60_result:
            story.extend(self._build_recommendations(rt60_result["recommendations"]))

        # 8. Fotos (falls vorhanden)
        if photos:
            story.extend(self._build_photo_section(photos))

        # 9. Footer/Metadaten
        story.extend(self._build_footer())

        # PDF generieren
        doc.build(story)

        return output_path

    def _build_title_page(
        self, project_name: Optional[str], customer_name: Optional[str]
    ) -> List:
        """Erstellt die Titel-Seite"""
        elements = []

        # Haupttitel
        elements.append(Spacer(1, 50 * mm))
        elements.append(Paragraph("RT60 Raumakustik-Analyse", self.styles["CustomTitle"]))
        elements.append(Spacer(1, 10 * mm))

        # Untertitel
        if project_name:
            elements.append(Paragraph(f"Projekt: {project_name}", self.styles["Subtitle"]))

        if customer_name:
            elements.append(Paragraph(f"Kunde: {customer_name}", self.styles["Subtitle"]))

        # Datum
        today = datetime.now().strftime("%d.%m.%Y")
        elements.append(Paragraph(f"Erstellt am: {today}", self.styles["Subtitle"]))

        elements.append(PageBreak())

        return elements

    def _build_project_info(
        self, room_data: Dict, project_name: Optional[str], customer_name: Optional[str]
    ) -> List:
        """Erstellt die Projekt-Informations-Sektion"""
        elements = []

        elements.append(Paragraph("Projekt-Informationen", self.styles["SectionHeader"]))

        # Tabelle mit Projekt-Daten
        data = [
            ["Parameter", "Wert"],
            ["Projektname", project_name or "—"],
            ["Kunde", customer_name or "—"],
            ["Datum", datetime.now().strftime("%d.%m.%Y %H:%M")],
            ["", ""],
            ["Raumlänge", f"{room_data.get('length', 0):.2f} m"],
            ["Raumbreite", f"{room_data.get('width', 0):.2f} m"],
            ["Raumhöhe", f"{room_data.get('height', 0):.2f} m"],
            [
                "Raumvolumen",
                f"{room_data.get('length', 0) * room_data.get('width', 0) * room_data.get('height', 0):.2f} m³",
            ],
            ["Raumnutzung", self._format_room_usage(room_data.get("usage", ""))],
        ]

        table = Table(data, colWidths=[80 * mm, 80 * mm])
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#007AFF")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, 0), 12),
                    ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
                    ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ]
            )
        )

        elements.append(table)
        elements.append(Spacer(1, 20))

        return elements

    def _build_rt60_results(self, rt60_result: Dict) -> List:
        """Erstellt die RT60-Ergebnisse-Sektion"""
        elements = []

        elements.append(Paragraph("RT60-Ergebnisse", self.styles["SectionHeader"]))

        # Durchschnittliche RT60
        avg_rt60 = rt60_result.get("din18041_compliance", {}).get("average_rt60")
        if avg_rt60:
            elements.append(
                Paragraph(
                    f"<b>Durchschnittliche Nachhallzeit (500 Hz & 1000 Hz):</b> {avg_rt60:.2f} s",
                    self.styles["Normal"],
                )
            )
            elements.append(Spacer(1, 10))

        # Tabelle mit allen Frequenzen
        rt60_values = rt60_result.get("rt60_values", {})

        if rt60_values:
            data = [["Frequenz", "Nachhallzeit T60"]]

            # Sortiere Frequenzen
            sorted_freqs = sorted([(int(k), v) for k, v in rt60_values.items()])

            for freq, rt60 in sorted_freqs:
                data.append([f"{freq} Hz", f"{rt60:.2f} s"])

            table = Table(data, colWidths=[80 * mm, 80 * mm])
            table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#34C759")),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("FONTSIZE", (0, 0), (-1, 0), 12),
                        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                        ("BACKGROUND", (0, 1), (-1, -1), colors.lightgrey),
                        ("GRID", (0, 0), (-1, -1), 1, colors.black),
                    ]
                )
            )

            elements.append(table)
            elements.append(Spacer(1, 20))

        # Formel
        formula_used = rt60_result.get("formula_used", "sabine")
        elements.append(
            Paragraph(
                f"<i>Berechnet mit {formula_used.capitalize()}-Formel</i>",
                self.styles["Normal"],
            )
        )
        elements.append(Spacer(1, 20))

        return elements

    def _build_frequency_chart(self, rt60_result: Dict) -> List:
        """Erstellt ein Frequenz-Chart"""
        elements = []

        rt60_values = rt60_result.get("rt60_values", {})
        if not rt60_values:
            return elements

        elements.append(Paragraph("RT60-Frequenzverlauf", self.styles["SectionHeader"]))

        # Daten vorbereiten
        sorted_freqs = sorted([(int(k), v) for k, v in rt60_values.items()])
        frequencies = [f"{freq} Hz" for freq, _ in sorted_freqs]
        rt60_vals = [rt60 for _, rt60 in sorted_freqs]

        # Chart erstellen
        drawing = Drawing(400, 200)
        chart = VerticalBarChart()
        chart.x = 50
        chart.y = 50
        chart.height = 125
        chart.width = 300
        chart.data = [rt60_vals]
        chart.categoryAxis.categoryNames = frequencies
        chart.valueAxis.valueMin = 0
        chart.valueAxis.valueMax = max(rt60_vals) * 1.2
        chart.bars[0].fillColor = colors.HexColor("#007AFF")

        drawing.add(chart)
        elements.append(drawing)
        elements.append(Spacer(1, 20))

        return elements

    def _build_compliance_section(self, compliance: Dict) -> List:
        """Erstellt die DIN 18041 Compliance-Sektion"""
        elements = []

        elements.append(Paragraph("DIN 18041 Konformität", self.styles["SectionHeader"]))

        # Status
        is_compliant = compliance.get("overall_compliant", False)
        status_text = "✓ Konform" if is_compliant else "✗ Nicht konform"
        status_color = colors.green if is_compliant else colors.red

        status_style = ParagraphStyle(
            name="Status",
            parent=self.styles["Normal"],
            fontSize=14,
            textColor=status_color,
            fontName="Helvetica-Bold",
        )

        elements.append(Paragraph(status_text, status_style))
        elements.append(Spacer(1, 10))

        # Raumnutzung
        room_usage = compliance.get("room_usage", "")
        elements.append(
            Paragraph(
                f"<b>Raumtyp:</b> {self._format_room_usage(room_usage)}",
                self.styles["Normal"],
            )
        )

        # Message
        if "message" in compliance and compliance["message"]:
            elements.append(Spacer(1, 10))
            elements.append(Paragraph(f"<i>{compliance['message']}</i>", self.styles["Normal"]))

        elements.append(Spacer(1, 20))

        return elements

    def _build_materials_table(self, materials: List[Dict]) -> List:
        """Erstellt die Material-Übersichts-Tabelle"""
        elements = []

        if not materials:
            return elements

        elements.append(Paragraph("Verwendete Materialien", self.styles["SectionHeader"]))

        # Tabellen-Daten
        data = [["Material", "Kategorie", "α_w", "NRC"]]

        for material in materials:
            data.append(
                [
                    material.get("name", ""),
                    material.get("category", ""),
                    f"{material.get('alpha_w', 0):.2f}",
                    f"{material.get('nrc', 0):.2f}",
                ]
            )

        table = Table(data, colWidths=[60 * mm, 40 * mm, 30 * mm, 30 * mm])
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#FF9500")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, 0), 12),
                    ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.lightblue),
                    ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ]
            )
        )

        elements.append(table)
        elements.append(Spacer(1, 20))

        return elements

    def _build_recommendations(self, recommendations: List[str]) -> List:
        """Erstellt die Empfehlungs-Sektion"""
        elements = []

        if not recommendations:
            return elements

        elements.append(Paragraph("Empfehlungen", self.styles["SectionHeader"]))

        for i, recommendation in enumerate(recommendations, 1):
            elements.append(Paragraph(f"{i}. {recommendation}", self.styles["Normal"]))
            elements.append(Spacer(1, 8))

        elements.append(Spacer(1, 20))

        return elements

    def _build_photo_section(self, photos: List[str]) -> List:
        """Fügt Raum-Fotos hinzu"""
        elements = []

        elements.append(PageBreak())
        elements.append(Paragraph("Raum-Fotos", self.styles["SectionHeader"]))

        for photo_path in photos:
            if Path(photo_path).exists():
                try:
                    img = RLImage(photo_path, width=150 * mm, height=100 * mm)
                    elements.append(img)
                    elements.append(Spacer(1, 10))
                except Exception as e:
                    elements.append(
                        Paragraph(f"Fehler beim Laden des Fotos: {e}", self.styles["Normal"])
                    )

        return elements

    def _build_footer(self) -> List:
        """Erstellt Footer mit Metadaten"""
        elements = []

        elements.append(PageBreak())
        elements.append(Spacer(1, 100))

        footer_style = ParagraphStyle(
            name="Footer",
            parent=self.styles["Normal"],
            fontSize=8,
            textColor=colors.grey,
            alignment=TA_CENTER,
        )

        elements.append(
            Paragraph(
                "Erstellt mit RT60 Raumakustik-Analyse System v0.1.0",
                footer_style,
            )
        )
        elements.append(
            Paragraph(
                f"Generiert am {datetime.now().strftime('%d.%m.%Y um %H:%M Uhr')}",
                footer_style,
            )
        )
        elements.append(Spacer(1, 10))
        elements.append(
            Paragraph(
                "© 2025 RT60 Development Team | DIN 18041:2016-03 konform",
                footer_style,
            )
        )

        return elements

    def _format_room_usage(self, usage: str) -> str:
        """Formatiert Raumnutzungs-String"""
        usage_map = {
            "office": "Büro",
            "classroom": "Klassenraum",
            "lecture_hall": "Hörsaal",
            "conference": "Konferenzraum",
            "concert_hall": "Konzertsaal",
            "recording_studio": "Aufnahmestudio",
        }
        return usage_map.get(usage, usage.replace("_", " ").title())

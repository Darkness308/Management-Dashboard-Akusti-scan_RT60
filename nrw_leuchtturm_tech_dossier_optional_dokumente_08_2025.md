# Dossier: Partner‑Bewertung, Repo‑Stack, Swift‑Lastenheft, QA & Patches (08/2025)

> Dieses Dossier bündelt alle „optionalen“ Artefakte in EINEM Dokument: Executive Brief zu KLOTZ (NRW‑Leuchtturm), Implementierungsleitfaden (VS Code & Copilot Pro+), Swift‑Lastenheft, Testplan/QA, Code‑Patches (kompilierbar), PDF‑Report‑Blueprint, Pilot‑Playbook NRW, Roadmap & EKS‑Fokus. Alle Inhalte sind so formuliert, dass sie ohne externe Abhängigkeiten weiterverarbeitet werden können.

---

## 1) Executive Brief: KLOTZ als NRW‑Leuchtturmpartner
**Kurzbeurteilung**
- **Stärke**: Zugang zu öffentlichen Auftraggebern (Kommunen/Schulen), HOAI‑Kompetenz, Genehmigungs‑/Vergaberoutine.
- **Lücke**: Raumakustik‑Messkompetenz muss von uns kommen; KLOTZ ergänzt als
  Partner für Planung/Ausschreibung und Pilotzugänge.
- **Vorgehen**: 2‑stufiger Pilot (Schule/Büro) → Nachweiserstellung (RT60, DIN‑Check, PDF) → Referenz.

**Messbare Ziele**
- <T0+30 Tage>: 2 Pilotobjekte akquiriert, Mess‑ und Scan‑Slots fixiert.
- <T0+60 Tage>: 4 vollständige Reports (2 Räume je Objekt) inkl. Maßnahmenvorschlag.
- <T0+90 Tage>: 1 Referenzcase öffentlich zitierbar; Lessons Learned in Product Backlog überführt.

---

## 2) Implementierungsleitfaden – Repo‑/Framework‑Stack (VS Code & Copilot Pro+)
**Ziel**: App „auf die Straße bringen“ mit produktionsfähiger Struktur.

**Stack‑Bausteine**
- **Raumerfassung**: RoomPlan‑API (Swift, iOS 16+) für Grundriss/Volumen.
- **Signalverarbeitung**: AVAudioEngine + Accelerate/FFT; optionale Dritteloktav‑Filterbank.
- **RT60**: T20/T30‑Ermittlung, Sabine‑Modell (0.161), Plausibilitäts‑Checks.
- **Datenmodell**: Einheitliche `AcousticMaterial`‑Struktur mit Frequenz→α‑Map.
- **Export**: PDFKit (PDF‑Report), CSV/XLSX (Daten), JSON (Audit‑Trail).
- **Charts**: Swift Charts (Bänder, Tooltips), optional Metal‑Shading später.
- **CI/CD**: Xcode Cloud oder Fastlane; Test‑Suiten (XCTest) grün halten.

**Repo‑Organisation**
```
repo/
├─ App/
│  ├─ AppEntry.swift
│  ├─ ContentView.swift
│  └─ Resources/
├─ Modules/
│  ├─ Scanner/ (RoomPlan, AR)
│  ├─ Acoustics/
│  │   ├─ RT60/
│  │   └─ Filters/
│  ├─ DIN18041/
│  ├─ Material/
│  ├─ Export/
│  └─ UI/
├─ Tests/
│  ├─ Unit/
│  └─ UI/
└─ Scripts/
```

---

## 3) Swift‑Lastenheft (Auszug, Version 0.4)
**Zweck**: Mobile Komplettlösung zur orientierenden Raumakustik‑Analyse und Maßnahmenempfehlung.

**Funktional (Muss)**
1. **Scan & Geometrie**: LiDAR‑Scan (RoomPlan), Volumen/Kubatur, Flächenklassen.
2. **Messung**: Nachhallbestimmung in Terz‑/Oktavbändern (Impuls/Interrupted‑Noise).
3. **Material‑DB**: α‑Werte je Frequenz; Material‑Picker pro Fläche.
4. **Norm‑Check**: Zielbereiche pro Raumtyp (DIN 18041) mit Ampellogik.
5. **Reporting**: PDF auf Knopfdruck (Meta, RT60‑Kurven, Abweichungen, Vorschläge).
6. **Export**: CSV/XLSX/JSON; optional IFC/DAE für BIM.

**Nicht‑funktional**
- On‑Device‑Verarbeitung standardmäßig; Datenschutz by Design.
- Reproduzierbarkeit: Kalibrier‑Workflow und Messprotokoll.
- Performance: < 2 s Renderzeit für RT60‑Charts; < 10 s PDF‑Export.

**Akzeptanzkriterien (Beispiele)**
- RT60‑Berechnung liefert Werte in physikalisch plausiblen Grenzen;
- DIN‑Check erzeugt konsistente Ampel je Frequenz;
- PDF enthält alle Pflichtfelder, ist barrierearm (ToC/Tags optional).

---

## 4) Testplan & QA (XCTest)
**Unit‑Tests**
- `RT60EvaluatorTests`: Klassifikation einzelner RT60‑Werte und Evaluierung gegen DIN‑Ziele.
- `AbsorberCalculatorTests`: Flächen‑/Kostenbedarf aus ΔRT und α.
- `RT60ChartViewTests`: Plausible RT60 bei 500 Hz (>0 und <10).

**Integration‑Tests**
- Scan→Materialzuordnung→RT60→DIN→PDF End‑to‑End.

**Mess‑QA**
- Mikrofon‑Kalibrierung (Kurve), Störgeräusch‑Erkennung, Wiederholbarkeit (3×).

---

## 5) Code‑Patches (kompilierbar, auf Grundlage der ZIP‑Analyse)
> Ziel: Bestehende Tests **nicht ändern**, sondern App‑Code ergänzen/korrigieren.

### 5.1 RT60‑Klassifikation ergänzen (Tests erwarten `classifyRT60`)
**Datei**: `Modules/DIN18041/RT60Classification.swift` *(neu)*
```swift
import Foundation

enum RT60Classification: Equatable {
    case withinRange, tooHigh, tooLow
}

final class RT60Evaluator {
    /// Bestehende `evaluate(...)` bleibt unberührt.
    /// Ergänzung: einfache Klassifikation mit ±10 % Toleranz.
    static func classifyRT60(measured: Double, target: Double, tolerance: Double = 0.10) -> RT60Classification {
        let upper = target * (1.0 + tolerance)
        let lower = target * (1.0 - tolerance)
        if measured > upper { return .tooHigh }
        if measured < lower { return .tooLow }
        return .withinRange
    }
}
```

### 5.2 Absorptionsbedarf ergänzen (Formel wie in Tests)
**Datei**: `Modules/AbsorberCalculation/AbsorberCalculator+RequiredAbsorption.swift` *(neu)*
```swift
import Foundation

extension AbsorberCalculator {
    /// Zusätzliche äquivalente Absorptionsfläche [m²], um von current auf target zu kommen.
    static func requiredAbsorption(volume: Double, currentRT60: Double, targetRT60: Double) -> Double {
        guard volume >= 0, targetRT60 > 0 else { return 0 }
        let value = volume * (currentRT60 - targetRT60) / targetRT60
        return max(0, value)
    }
}
```

### 5.3 Material‑Datenbank harmonisieren & Test‑Materialien ergänzen
**Datei**: `Modules/Material/MaterialDatabase.swift` *(ersetzen)*
```swift
import Foundation

struct AcousticMaterial: Identifiable, Codable {
    let id: UUID = UUID()
    var name: String
    var coefficients: [Int: Float]   // z. B. [125: 0.10, 250: 0.20, ...]
}

struct MaterialDatabase {
    static let materials: [AcousticMaterial] = [
        .init(name: "Concrete", coefficients: [125:0.01,250:0.01,500:0.02,1000:0.02,2000:0.02,4000:0.02,8000:0.02]),
        .init(name: "Gypsum",   coefficients: [125:0.29,250:0.10,500:0.05,1000:0.04,2000:0.07,4000:0.09,8000:0.12]),
        // Für Tests erforderlich:
        .init(name: "Foam",     coefficients: [125:0.10,250:0.20,500:0.30,1000:0.40,2000:0.50,4000:0.60,8000:0.70]),
        .init(name: "Wood",     coefficients: [125:0.15,250:0.17,500:0.19,1000:0.21,2000:0.23,4000:0.25,8000:0.27])
    ]

    static func absorption(for materialName: String) -> [Int: Float]? {
        materials.first { $0.name == materialName }?.coefficients
    }
}
```

### 5.4 `Surface`‑Modell vervollständigen (für Tests & Views)
**Datei**: `Model/SurfaceStore.swift` *(ersetzen)*
```swift
import Foundation

struct Surface: Identifiable, Codable {
    let id: UUID = UUID()
    var area: Float                 // m²
    var materialType: String?       // Name in MaterialDatabase
}

final class SurfaceStore: ObservableObject {
    @Published var surfaces: [Surface] = []

    /// Grobe Volumenschätzung, bis RoomPlan‑Volumen verfügbar ist
    var estimatedVolume: Float {
        // default: 5×6×3 m = 90 m³, falls leer
        guard !surfaces.isEmpty else { return 90.0 }
        // Näherung: größte Fläche × Raumhöhe
        let base = surfaces.map { $0.area }.max() ?? 25.0
        let height: Float = 2.8
        return max(10.0, base * height)
    }
}
```

### 5.5 RT60‑Berechnung in Views korrigieren
**Datei**: `Modules/RT60/RT60ChartView.swift` *(anpassen)*
```swift
import SwiftUI
import Charts

struct RT60ChartView: View {
    @ObservedObject var store: SurfaceStore

    func calculateRT60(frequency: Int) -> Float {
        var a_f: Float = 0.0
        for surface in store.surfaces {
            if let name = surface.materialType,
               let alpha = MaterialDatabase.absorption(for: name)?[frequency] {
                a_f += surface.area * alpha
            }
        }
        let v = store.estimatedVolume
        return a_f > 0 ? (0.161 * v / a_f) : 0.0
    }

    var body: some View {
        VStack(alignment: .leading) {
            Text("RT60‑Kurve").font(.title3).bold()
            Chart([125,250,500,1000,2000,4000,8000], id: \.self) { freq in
                let value = calculateRT60(frequency: freq)
                BarMark(x: .value("Frequenz", "\(freq) Hz"), y: .value("RT60 (s)", value))
            }
            .frame(height: 300)
        }
    }
}
```

> **Erwartung**: Alle drei Testfiles aus der separaten Tests‑ZIP werden grün, ebenso die vorhandenen `Tests/RT60EvaluatorTests.swift` im Source‑ZIP.

---

## 6) PDF‑Report‑Blueprint
**Abschnitte**: Deckblatt → Projekt/Objekt → Scan/Mess‑Setup → RT60‑Charts (Bänder) → DIN‑18041‑Abgleich (Ampel) → Maßnahmenvorschlag (Wirkung/€) → Anhang (Materialwerte, Kalibrierkurve).

**Pflichtfelder**: Ort/Datum, Geräte/Version, Messbedingungen, Raumparameter (Volumen, Flächen), Ansprechpartner.

---

## 7) Pilot‑Playbook NRW (mit KLOTZ)
1. Zielräume definieren (2× Schule, 1× Büro).
2. Rechtliches & Datenschutz klären, Messfenster buchen.
3. Vor‑Ort‑Ablauf: Scan → Materialaufnahme → Messung → Sofort‑Report.
4. Abnahmegespräch: Nutzen, Kosten, Umsetzungsplan; Referenzfreigabe sichern.

**Kennzahlen**: Messzeit je Raum, Abweichung vs. Referenz, Angebot‑Durchlaufzeit, Abschlussquote.

---

## 8) Roadmap & EKS‑Fokus
- **Sprint A (2 Wochen)**: Patches einspielen, Tests grün, PDF‑Export fertig.
- **Sprint B (2 Wochen)**: DIN‑Zielmatrix erweitern (weitere Raumtypen), Material‑DB importierbar (CSV/XLSX).
- **Sprint C (2 Wochen)**: RoomPlan‑Volumen produktiv, Kalibrier‑Workflow, Plausibilitäts‑Checks.
- **EKS‑Hebel**: Genauigkeit/Auditierbarkeit zuerst – kleinster Aufwand, größte Wirkung auf Vertrauen & Vertrieb.


# RT60 Raumakustik-Analyse System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Python Version](https://img.shields.io/badge/python-3.11+-blue)]()
[![iOS](https://img.shields.io/badge/iOS-16.0+-black)]()
[![License](https://img.shields.io/badge/license-Proprietary-red)]()
[![DIN 18041](https://img.shields.io/badge/DIN%2018041-compliant-green)]()

> **Automatisierte Raumakustik-Analyse via iPad LiDAR-Scanner mit DIN 18041 Compliance**

iPad-basierte Lösung zur professionellen Nachhallzeit-Messung (RT60) und raumakustischen Optimierung für Architekten, Akustiker und Bauherren.

---

## 🎯 Features

### ✅ MVP (Phase 1) - In Entwicklung
- **Automatische Raumerkennung** via iPad Pro LiDAR-Scanner
- **RT60-Berechnung** nach Sabine & Eyring-Formeln
- **Materialdatenbank** mit 20+ Standardmaterialien und Absorptionskoeffizienten
- **DIN 18041 Compliance** für Schulräume, Büros, Konzertsäle
- **PDF-Reports** mit Nachhallkurven und Optimierungsempfehlungen

### 🚧 Roadmap (Phase 2+3)
- Echtzeit-Messung mit kalibriertem USB-C Mikrofon (T20/T30)
- AI-gestützte Materialerkennung
- BIM-Integration (IFC-Import/Export)
- 3D-Auralisation (räumliche Klangvorschau)
- Cloud-Sync & Projekt-Management

---

## 📊 Marktpotenzial

| Metrik | Wert |
|--------|------|
| **TAM** (DACH) | 63.841 Unternehmen |
| **SAM** (30%) | 19.152 Unternehmen |
| **SOM** (5%) | 957 Kunden |
| **Umsatzpotenzial** | €95.8M (bei €1.500/Jahr) |

**Zielgruppen:** Architekturbüros (35%), Schulen (25%), öffentliche Träger (20%), Unternehmen (20%)

---

## 🏗️ Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                     iPad Pro (iOS App)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  LiDAR Scan  │  │  Mikrofon    │  │  Kamera      │      │
│  │  (RoomPlan)  │  │  (RT60)      │  │  (Foto)      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │              │
│  ┌──────▼─────────────────▼─────────────────▼───────┐      │
│  │         SwiftUI Frontend (RT60Scanner)           │      │
│  │  - RoomInputView  - ScanView  - ResultsView     │      │
│  └──────────────────────┬───────────────────────────┘      │
└─────────────────────────┼─────────────────────────────────┘
                          │ REST API (HTTPS)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend (Python 3.11+)                 │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Acoustics       │  │  Materials DB    │                │
│  │  - Sabine        │  │  - 20 Materials  │                │
│  │  - Eyring        │  │  - α-coeffs      │                │
│  │  - RT60 Calc     │  │  - JSON Storage  │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  API Endpoints   │  │  Report Gen      │                │
│  │  - /calculate    │  │  - PDF Export    │                │
│  │  - /materials    │  │  - Matplotlib    │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Material Database    │
              │  (JSON / SQLite)      │
              └───────────────────────┘
```

---

## 🚀 Quick Start

### Voraussetzungen

#### Backend
- Python 3.11+
- pip / virtualenv
- Docker (optional)

#### iOS App
- macOS 13.0+ mit Xcode 15.0+
- iPad Pro (3. Gen+) mit LiDAR-Scanner
- iOS 16.0+

### Installation & Ausführung

#### 1️⃣ Backend starten

```bash
# Repository klonen
git clone <repo-url>
cd Management-Dashboard-Akusti-scan_RT60

# Virtual Environment erstellen
cd backend
python3.11 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Dependencies installieren
pip install -r requirements.txt

# Umgebungsvariablen konfigurieren
cp .env.example .env
# .env bearbeiten nach Bedarf

# Server starten
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

API verfügbar unter: **http://localhost:8000**
Swagger Docs: **http://localhost:8000/docs**

#### 2️⃣ Mit Docker (empfohlen)

```bash
# Gesamtes System starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f backend

# Stoppen
docker-compose down
```

Services:
- **Backend API:** http://localhost:8000
- **Dokumentation:** http://localhost:8080

#### 3️⃣ iOS App (in Entwicklung)

```bash
cd ios-app/RT60Scanner
open RT60Scanner.xcodeproj

# In Xcode:
# 1. Signing & Capabilities konfigurieren
# 2. iPad Pro als Zielgerät auswählen
# 3. Build & Run (⌘R)
```

---

## 📖 API Dokumentation

### Endpoints (Geplant)

#### `POST /api/v1/calculate`
Berechnet RT60 für einen Raum mit gegebenen Materialien.

**Request:**
```json
{
  "room": {
    "length": 10.0,
    "width": 8.0,
    "height": 3.0
  },
  "surfaces": [
    {
      "type": "floor",
      "material_id": "mat_005",
      "area": 80.0
    },
    {
      "type": "ceiling",
      "material_id": "mat_004",
      "area": 80.0
    },
    {
      "type": "walls",
      "material_id": "mat_002",
      "area": 108.0
    }
  ],
  "target_usage": "office"
}
```

**Response:**
```json
{
  "rt60_sabine": {
    "125Hz": 0.82,
    "250Hz": 0.65,
    "500Hz": 0.48,
    "1000Hz": 0.42,
    "2000Hz": 0.38,
    "4000Hz": 0.35
  },
  "rt60_eyring": {
    "125Hz": 0.78,
    "250Hz": 0.62,
    "500Hz": 0.46,
    "1000Hz": 0.40,
    "2000Hz": 0.36,
    "4000Hz": 0.33
  },
  "din18041_compliance": {
    "status": "compliant",
    "target_range": [0.35, 0.55],
    "average_rt60": 0.43,
    "deviations": []
  },
  "recommendations": [
    "RT60 liegt im Soll-Bereich für Büroräume (DIN 18041)",
    "Optimale Sprachverständlichkeit gewährleistet"
  ]
}
```

#### `GET /api/v1/materials`
Liefert alle verfügbaren Materialien aus der Datenbank.

**Response:**
```json
{
  "materials": [
    {
      "id": "mat_001",
      "name": "Beton, unverputzt",
      "category": "Wände",
      "alpha_w": 0.00,
      "absorption_coefficients": { "125Hz": 0.01, ... }
    }
  ],
  "count": 20
}
```

---

## 🧪 Testing

```bash
cd backend

# Unit Tests ausführen
pytest tests/ -v

# Mit Coverage-Report
pytest --cov=src --cov-report=html tests/

# Spezifische Tests
pytest tests/test_acoustics.py::test_sabine_formula -v
```

**Ziel:** ≥80% Code Coverage

---

## 📂 Projektstruktur

```
Management-Dashboard-Akusti-scan_RT60/
├── backend/                      # Python FastAPI Backend
│   ├── src/
│   │   ├── acoustics/           # RT60 Berechnungs-Engine
│   │   │   ├── __init__.py
│   │   │   ├── formulas.py      # Sabine, Eyring, etc.
│   │   │   └── din18041.py      # DIN 18041 Validierung
│   │   ├── materials_db/        # Materialdatenbank-Logik
│   │   │   ├── __init__.py
│   │   │   └── repository.py    # CRUD für Materialien
│   │   └── api/                 # REST API
│   │       ├── __init__.py
│   │       ├── main.py          # FastAPI App
│   │       └── routes/          # Endpoint-Handler
│   ├── tests/                   # Unit & Integration Tests
│   ├── requirements.txt         # Python Dependencies
│   ├── Dockerfile               # Container Image
│   └── .env.example             # Environment Template
│
├── ios-app/                      # iOS/iPadOS Native App
│   ├── RT60Scanner/             # SwiftUI Projekt
│   │   ├── Views/               # UI Components
│   │   ├── Models/              # Data Models
│   │   ├── Services/            # Business Logic
│   │   └── Utils/               # Helper Functions
│   └── README.md
│
├── shared/                       # Gemeinsame Ressourcen
│   └── material_database.json   # 20 Materialien mit α-Werten
│
├── docs/                         # Dokumentation
│   └── dashboard/               # HTML Management-Dashboard
│       ├── whitepaper.html      # Konzept & Vision
│       ├── lastenheft.html      # Anforderungen
│       ├── market_business.html # Marktanalyse
│       └── ...                  # 20 HTML-Dokumente
│
├── .github/                      # CI/CD Workflows
│   └── workflows/
│       └── ci.yml               # GitHub Actions
│
├── docker-compose.yml            # Multi-Container Setup
├── .gitignore
└── README.md                     # Diese Datei
```

---

## 🔬 Technische Grundlagen

### RT60 Berechnung

**Sabine-Formel** (für diffuse Schallfelder):
```
T = 0.163 × V / A
```
- `T`: Nachhallzeit (Sekunden)
- `V`: Raumvolumen (m³)
- `A`: Äquivalente Absorptionsfläche (m²)

**Eyring-Formel** (für hohe Absorption):
```
T = 0.163 × V / [-S × ln(1 - α_avg)]
```
- `S`: Gesamte Oberfläche (m²)
- `α_avg`: Mittlerer Absorptionsgrad

### DIN 18041 Soll-Werte

| Raumnutzung | Volumen | Soll-RT60 (500-1000Hz) |
|-------------|---------|------------------------|
| Klassenzimmer | ≤250 m³ | 0.6 - 0.8 s |
| Büro | ≤200 m³ | 0.35 - 0.55 s |
| Aufnahmestudio | beliebig | 0.2 - 0.4 s |
| Konzertsaal | >5000 m³ | 1.5 - 2.5 s |

---

## 🛠️ Entwicklung

### Code Quality Standards

```bash
# Code Formatting (Black)
black src/ tests/

# Linting (Flake8)
flake8 src/ tests/ --max-line-length=100

# Type Checking (MyPy)
mypy src/ --strict
```

### Git Workflow

1. Feature-Branch erstellen: `git checkout -b feature/neue-funktion`
2. Commits mit Conventional Commits: `feat: add Eyring formula`
3. Tests schreiben & ausführen
4. Pull Request erstellen
5. Code Review abwarten
6. Merge nach `main`

### Branching Strategy

```
main            # Production-ready Code
├── develop     # Integration Branch
    ├── feature/sabine-calculation
    ├── feature/api-endpoints
    └── bugfix/rt60-rounding
```

---

## 📊 Wettbewerbsanalyse

| Produkt | Preis/Monat | RT60-Messung | LiDAR | KI | DIN 18041 |
|---------|-------------|--------------|-------|----|-----------|
| **RT60 Scanner** (wir) | €229 | ✅ | ✅ | ✅ | ✅ |
| Autodesk Forma | $185 | ❌ | ❌ | ✅ | ❌ |
| PlanRadar | €26-129 | ❌ | ❌ | ⚠️ | ❌ |
| Aurivus | auf Anfrage | ❌ | ✅ | ✅ | ❌ |
| Archicad AI | $234+ | ❌ | ❌ | ✅ | ❌ |
| Klassische Messung | - | ✅ | ❌ | ❌ | ✅ |

**Alleinstellungsmerkmal:** Einzige Lösung mit LiDAR + RT60 + DIN 18041 + AI in einer App.

---

## 🤝 Mitwirkende & Rollen

| Rolle | Verantwortung | Status |
|-------|---------------|--------|
| **Product Owner** | Vision, Roadmap, Priorisierung | Besetzt |
| **Backend Developer** | Python/FastAPI, Akustik-Algorithmen | Gesucht |
| **iOS Developer** | SwiftUI, LiDAR, Audio-Processing | Gesucht |
| **Audio DSP Engineer** | RT60-Messung, Mikrofon-Kalibrierung | Gesucht |
| **UX Designer** | Wireframes, User Testing | Offen |

---

## 📄 Lizenz & Rechtliches

**Proprietary Software** - Alle Rechte vorbehalten.

Verwendete Standards:
- DIN 18041:2016-03 (Hörsamkeit in Räumen)
- ISO 3382 (Messung der Raumakustik)
- ISO 11654 (Schallabsorptionsgrad)

---

## 📞 Kontakt & Support

- **Dokumentation:** [http://localhost:8080](http://localhost:8080) (wenn Docker läuft)
- **API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Issues:** GitHub Issues verwenden
- **E-Mail:** support@rt60-scanner.com (Platzhalter)

---

## 🗺️ Roadmap

### ✅ Q4 2025
- [x] Projektstruktur aufsetzen
- [x] Materialdatenbank erstellen (20 Materialien)
- [ ] Sabine/Eyring Python-Implementation
- [ ] REST API Grundgerüst
- [ ] Unit Tests (≥70%)

### 🚧 Q1 2026
- [ ] iOS App Prototyp (manuelle Eingabe)
- [ ] LiDAR-Integration (RoomPlan)
- [ ] PDF-Report-Generator
- [ ] Beta-Testing mit 5 Architekturbüros

### 📅 Q2 2026
- [ ] Mikrofon-Messung (T20/T30)
- [ ] DIN 18041 Automatisierte Validierung
- [ ] Cloud-Backend (Projekt-Speicherung)
- [ ] MVP Launch

### 🔮 Q3-Q4 2026
- [ ] AI-Materialerkennung (Computer Vision)
- [ ] BIM-Integration (IFC-Export)
- [ ] 3D-Auralisation (Spatial Audio)
- [ ] Enterprise Features (Teams, SSO)

---

## ⚠️ Aktueller Status

**⚠️ PROJEKT IN FRÜHER ENTWICKLUNGSPHASE**

Aktuell vorhanden:
- ✅ Umfassende Business-Dokumentation (20 HTML-Seiten)
- ✅ Marktanalyse & Wettbewerbsvergleich
- ✅ Repository-Struktur
- ✅ Materialdatenbank (20 Materialien)
- ✅ Docker-Setup

Noch zu implementieren:
- ❌ Backend API (0%)
- ❌ RT60-Berechnungs-Engine (0%)
- ❌ iOS App (0%)
- ❌ Tests (0%)
- ❌ CI/CD (0%)

**ETA für MVP:** 3-4 Monate (bei Vollzeit-Entwicklung)

---

## 🎓 Weiterführende Ressourcen

- [DIN 18041 Standard](https://www.beuth.de/de/norm/din-18041/247233032)
- [ISO 3382 Raumakustik](https://www.iso.org/standard/40979.html)
- [Apple RoomPlan Documentation](https://developer.apple.com/documentation/roomplan)
- [FastAPI Best Practices](https://fastapi.tiangolo.com/tutorial/)
- [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui)

---

**Made with 🎵 by the RT60 Development Team**

*Version 0.1.0 - November 2025*

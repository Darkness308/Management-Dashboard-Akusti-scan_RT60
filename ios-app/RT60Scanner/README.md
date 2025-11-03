# RT60Scanner - iOS App

> **SwiftUI iPad App für automatisierte Raumakustik-Analyse**

## 📱 Features

- ✅ Manuelle Raum-Eingabe (Phase 1 MVP)
- 🚧 LiDAR-Scanner Integration (Phase 2)
- 🚧 Mikrofon-Messung (Phase 3)

## 🏗️ Architektur

```
RT60Scanner/
├── App/
│   └── RT60ScannerApp.swift          # App Entry Point
├── Views/
│   ├── RoomInputView.swift           # Manuelle Raum-Eingabe
│   ├── MaterialSelectionView.swift   # Material-Auswahl
│   ├── ResultsView.swift             # RT60 Ergebnisse
│   └── Components/
│       └── MaterialCard.swift        # Wiederverwendbare Komponenten
├── Models/
│   ├── Room.swift                    # Raum-Datenmodell
│   ├── Material.swift                # Material-Datenmodell
│   ├── RT60Result.swift              # Ergebnis-Datenmodell
│   └── DIN18041Compliance.swift      # Compliance-Status
├── Services/
│   ├── APIClient.swift               # REST API Client
│   ├── NetworkManager.swift          # Netzwerk-Layer
│   └── MaterialService.swift         # Material-Cache
├── ViewModels/
│   ├── RoomInputViewModel.swift      # Business Logic für Input
│   └── ResultsViewModel.swift        # Business Logic für Results
└── Utils/
    ├── Constants.swift               # App-Konstanten
    └── Extensions/
        └── Color+Theme.swift         # Theme-Extensions

MVVM Pattern + Clean Architecture
```

## 🚀 Development Setup

### Voraussetzungen

- macOS 13.0+ (Ventura oder neuer)
- Xcode 15.0+
- Swift 5.9+
- iPad Pro mit LiDAR (für volle Funktionalität)

### Installation

1. **Xcode Projekt öffnen**
   ```bash
   cd ios-app/RT60Scanner
   open RT60Scanner.xcodeproj
   ```

2. **Signing konfigurieren**
   - In Xcode: Select Target "RT60Scanner"
   - Signing & Capabilities → Team auswählen
   - Bundle Identifier anpassen (z.B. `com.yourcompany.rt60scanner`)

3. **Build & Run**
   - iPad Simulator oder physisches iPad anschließen
   - ⌘R (Run)

### Backend-Verbindung konfigurieren

```swift
// Services/APIClient.swift

// Development (lokales Backend)
let baseURL = "http://localhost:8000"

// Production
// let baseURL = "https://api.rt60-app.com"
```

## 📖 API Integration

### Materialien laden

```swift
let client = APIClient()
let materials = try await client.getMaterials()
```

### RT60 berechnen

```swift
let request = RT60CalculationRequest(
    room: Room(length: 10.0, width: 8.0, height: 3.0),
    surfaces: [
        Surface(type: "floor", materialId: "mat_005", area: 80.0),
        Surface(type: "ceiling", materialId: "mat_004", area: 80.0),
        Surface(type: "walls", materialId: "mat_002", area: 108.0)
    ],
    targetUsage: "office"
)

let result = try await client.calculateRT60(request)
print("RT60 bei 500Hz: \(result.rt60Values[500] ?? 0)s")
```

## 🧪 Testing

```bash
# Unit Tests ausführen
⌘U in Xcode

# Oder via Command Line
xcodebuild test -scheme RT60Scanner -destination 'platform=iOS Simulator,name=iPad Pro (12.9-inch) (6th generation)'
```

## 🎨 UI/UX Design

### Color Scheme

```swift
// Primärfarben
Primary: #007AFF (Blue)
Secondary: #34C759 (Green)
Warning: #FF9500 (Orange)
Error: #FF3B30 (Red)

// DIN 18041 Status
Compliant: Green
TooShort: Orange
TooLong: Red
```

### Typography

- **Headlines:** SF Pro Display (Bold, 28pt)
- **Body:** SF Pro Text (Regular, 17pt)
- **Caption:** SF Pro Text (Regular, 13pt)

## 🔐 Permissions

### Info.plist Einträge

```xml
<key>NSCameraUsageDescription</key>
<string>Wir benötigen Zugriff auf die Kamera für Raum-Fotos in PDF-Reports.</string>

<key>NSMicrophoneUsageDescription</key>
<string>Wir benötigen Zugriff auf das Mikrofon für RT60-Messungen.</string>

<key>NSLocalNetworkUsageDescription</key>
<string>Wir benötigen Netzwerk-Zugriff zur Kommunikation mit dem Backend-Server.</string>
```

## 📦 Dependencies

### Swift Package Manager

- **Alamofire** (Optional): Netzwerk-Layer
- **Charts**: Daten-Visualisierung (RT60-Kurven)

### Manual Dependencies

Aktuell: **Keine** - Pure SwiftUI + URLSession

## 🗺️ Roadmap

### ✅ Phase 1 (MVP) - Aktuell
- [x] Projekt-Setup
- [x] API-Client Implementierung
- [x] Manuelle Raum-Eingabe UI
- [x] Material-Auswahl
- [x] Ergebnis-Anzeige
- [x] DIN 18041 Status-Anzeige

### 🚧 Phase 2
- [ ] LiDAR-Scanner (RoomPlan Integration)
- [ ] Kamera-Integration (Raum-Fotos)
- [ ] Offline-Modus (lokale Berechnung)
- [ ] PDF-Export

### 🔮 Phase 3
- [ ] Mikrofon-Messung (AVFoundation)
- [ ] Audio-DSP (T20/T30 Berechnung)
- [ ] Cloud-Sync
- [ ] Projekt-Verwaltung

## 🐛 Troubleshooting

### Problem: Backend nicht erreichbar

**Simulator:**
```swift
// localhost funktioniert nicht im Simulator!
// Stattdessen:
let baseURL = "http://127.0.0.1:8000"
```

**Physisches Gerät:**
```bash
# Backend muss im gleichen Netzwerk erreichbar sein
# Finde deine lokale IP:
ifconfig | grep inet

# Verwende z.B.:
let baseURL = "http://192.168.1.100:8000"
```

### Problem: Signing-Fehler

1. Xcode → Preferences → Accounts
2. Apple ID hinzufügen
3. Team auswählen in Signing & Capabilities

## 📞 Support

- **Issues:** GitHub Issues
- **Docs:** [README.md](../../README.md)
- **API Docs:** http://localhost:8000/docs

---

**Version:** 0.1.0
**Minimum iOS:** 16.0
**Target Devices:** iPad Pro (3rd Gen+) mit LiDAR

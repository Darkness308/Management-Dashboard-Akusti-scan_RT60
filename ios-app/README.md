# RT60Scanner iOS App

> **Status:** Placeholder - Implementierung ausstehend

## Technologie-Stack

- **Framework:** SwiftUI (iOS 16.0+)
- **Hardware:** iPad Pro mit LiDAR Scanner (erforderlich)
- **Audio:** AVFoundation für Mikrofon-Aufnahme
- **3D Scanning:** RoomPlan / ARKit
- **Networking:** URLSession (REST API Client)

## Geplante Features

### Phase 1 (MVP)
- [ ] Manuelle Raum-Eingabe (Länge, Breite, Höhe)
- [ ] Material-Auswahl (Dropdown aus Backend-Datenbank)
- [ ] API-Integration (RT60 Berechnung)
- [ ] Ergebnis-Anzeige

### Phase 2
- [ ] LiDAR-Scanner Integration (RoomPlan)
- [ ] Kamera-Aufnahme für Foto-Dokumentation
- [ ] Mikrofon-Messung (Impulsantwort)
- [ ] PDF-Report-Export

### Phase 3
- [ ] Offline-Modus mit lokaler Berechnung
- [ ] Projekt-Verwaltung (Speichern/Laden)
- [ ] Cloud-Sync (optional)

## Projektstruktur

```
RT60Scanner/
├── Views/              # SwiftUI Views
│   ├── RoomInputView.swift
│   ├── ScanView.swift
│   ├── ResultsView.swift
│   └── ReportView.swift
├── Models/             # Datenmodelle
│   ├── Room.swift
│   ├── Material.swift
│   └── RT60Result.swift
├── Services/           # Business Logic
│   ├── APIClient.swift
│   ├── AudioRecorder.swift
│   └── LiDARScanner.swift
└── Utils/              # Helpers
    ├── Constants.swift
    └── Extensions.swift
```

## Entwicklungsumgebung

- **Xcode:** 15.0+
- **Swift:** 5.9+
- **Deployment Target:** iOS 16.0+
- **Devices:** iPad Pro (3. Generation oder neuer mit LiDAR)

## Next Steps

1. Xcode-Projekt anlegen
2. SwiftUI-Basis-Views erstellen
3. API-Client implementieren
4. UI-Prototyp testen

---

**Hinweis:** Diese App erfordert ein physisches iPad Pro mit LiDAR-Scanner für die volle Funktionalität.

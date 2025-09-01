# 🧠 Raumakustik-Analyse-App – Funktionsübersicht und Erweiterungskonzept

## 1. 🎯 Zielsetzung
Die geplante iPad-Pro-App dient zur automatisierten Analyse raumakustischer Eigenschaften. Sie richtet sich an Planer, Akustiker und Ingenieurbüros, die schnell und normgerecht Räume analysieren und Maßnahmen zur akustischen Optimierung ableiten möchten.

---

## 2. 🧰 Hauptfunktionen

### 2.1 📏 Automatische Raumerfassung
- Nutzung von iPad Pro Kamera und LiDAR
- Erstellung eines 3D-Modells zur Flächen- und Volumenberechnung
- Erkennung von Raumgeometrien und Wandflächen

### 2.2 🧮 Theoretische Nachhallberechnung
- Auswahl von Raumtypen (z. B. Büro, Konzertsaal)
- Materialdatenbank mit Absorptionskoeffizienten
- Berechnung nach DIN 18041 und ISO 3382-1
- Visualisierung der Nachhallzeitkurve (RT60)

### 2.3 🎤 Akustische Echtmessung (optional)
- Integration von Messmikrofonen (z. B. über USB oder Bluetooth)
- Anregung über Knall, Claps oder Burstsignale
- Reale Messung der Nachhallzeit zur Validierung

---

## 3. 🧩 Erweiterungsfunktionen (essentiell)

### 3.1 🔁 Live-Feedback & Simulation
- Direkte Simulation akustischer Veränderungen bei Materialauswahl
- Echtzeitvisualisierung und -wiedergabe geplanter Maßnahmen
- VST-Anbindung für hörbare Raumtransformation

### 3.2 👤 Benutzerdefinierte Raumprofile
- Speichern und Wiederverwenden typischer Raumkonfigurationen
- Vergleich von Messdaten historischer Räume

### 3.3 📤 Report- und Dokumentenexport
- Automatisierte PDF-Berichte mit Bildern, Messkurven und Empfehlungen
- QR-Code oder Link-Generierung für Kundenfreigabe

### 3.4 🧠 Adaptive Lernfunktion (ML-Basis)
- System lernt mit jeder Messung
- Empfehlungen werden auf Grundlage vergangener Erfolge immer präziser
- Nutzung von anonymisierten Datensätzen zur Optimierung des Maßnahmenkatalogs

---

## 4. 🛠️ Materialdatenbank & Maßnahmenkatalog

- Materialien: Mineralwolle, Holz, Akustikschaum, PET, Stoffe, Naturmaterialien
- Eingruppierung nach: Frequenzbereich, Umweltfreundlichkeit, Brandschutz, Optik
- Maßnahmen: Wandabsorber, Deckenbaffeln, Teppiche, Vorhänge, Deckensegel
- Empfehlungen erfolgen KI-gestützt und kontextsensitiv (z. B. Raumvolumen, Nutzung)

---

## 5. 📡 Normen & Konformität
- **DIN 18041:** Hörsamkeit in kleinen/mittleren Räumen
- **ISO 3382-1:** Messung der Nachhallzeit in Performance-Räumen
- Optional erweiterbar für internationale Normen (EN, ASTM, etc.)

---

## 6. 🧭 Zukunftsperspektive

- VST-Plugin zur Echtzeit-Akustiksimulation (vor/nach Behandlung)
- Cloud-Synchronisierung für Teamprojekte
- Open-Source-Kompatibilität & Community-Erweiterungen
- Integration mit CAD-Systemen und akustischer BIM-Schnittstelle

---

> 🔄 **Modularer Entwicklungsansatz**: Jeder Funktionsblock ist als separat aktivierbares Modul konzipiert – ideal für Pilotkunden, Beta-Tests und individuelle Workflows.

> 📚 **Nächste Schritte**: Ausarbeitung des Prototyp-UIs, Definition der Datenformate, Auswahl des Frameworks (z. B. Swift + CoreML, Unity, TensorFlow Lite) und Aufbau einer Testmaterialdatenbank mit gemessenen Werten.

---

**Letzte Änderung:** 18.08.2025
**Autor:** @schulze.ralf
**Version:** v1.0 Entwurf


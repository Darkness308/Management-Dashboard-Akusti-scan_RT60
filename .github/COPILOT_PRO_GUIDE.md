# Copilot Pro+ Integration Guide

## 🤖 Aktivierung der personalisierten Agenten

Dieses Repository ist **vollständig für Copilot Pro+ optimiert** mit personalisierten Agenten und Self-Healing Workflows!

---

## 🎯 Verfügbare Agenten

### 1. **dashboard-architect** 🏗️
**Spezialist für:** Agent-System Design, React Architektur, Event-Driven Systems

**Nutze diesen Agent für:**
- Neue Agenten erstellen
- Architektur-Entscheidungen
- Code-Reviews
- System-Design

**Aktivierung:**
```
@dashboard-architect create a new agent for handling reports
```

---

### 2. **build-fixer** 🔧
**Spezialist für:** Build-Fehler beheben, Dependencies, Linting

**Nutze diesen Agent für:**
- Build-Fehler diagnostizieren und beheben
- Dependency-Probleme lösen
- ESLint-Fehler fixen
- TypeScript-Fehler beheben

**Aktivierung:**
```
@build-fixer the build is failing with module not found error
```

**Automatisch aktiv bei:**
- Build-Failures (via Self-Healing Workflow)
- Issues mit Label `auto-fix-needed`

---

### 3. **module-builder** 📦
**Spezialist für:** Dashboard-Module, Charts, UI-Komponenten

**Nutze diesen Agent für:**
- Neue Module erstellen
- Charts integrieren
- UI-Komponenten bauen
- Styling mit TailwindCSS

**Aktivierung:**
```
@module-builder create a new financial reporting module with charts
```

---

### 4. **data-specialist** 📊
**Spezialist für:** Daten-Parsing, Transformation, Export

**Nutze diesen Agent für:**
- Excel/CSV Import
- Daten-Validierung
- Export-Funktionen (JSON, Excel, PDF)
- Daten-Transformation

**Aktivierung:**
```
@data-specialist add PDF export functionality
```

---

## 🔄 Self-Healing Workflow

### Wie funktioniert es?

1. **Build schlägt fehl** → CI/CD erkennt Fehler
2. **Issue wird erstellt** mit Label `auto-fix-needed`
3. **Self-Healing startet** automatisch
4. **build-fixer Agent** analysiert Fehler
5. **Fixes werden angewendet** (Dependencies, Lint, etc.)
6. **Build wird wiederholt** (max. 3x)
7. **Bei Erfolg**: Issue wird automatisch geschlossen
8. **Bei Fehler**: Manual intervention erforderlich

### Manuelle Aktivierung

Wenn du einen Build-Fix erzwingen möchtest:

```bash
# Via GitHub Actions
gh workflow run self-healing.yml --raw-field max_retries=5

# Via Issue-Label
# Erstelle ein Issue und füge Label "auto-fix-needed" hinzu
```

---

## 📋 Workflows

### 1. **Neues Modul erstellen**

```
@module-builder create a new customer analytics module

Requirements:
- Customer data visualization
- Charts for revenue, growth
- Export to Excel
```

**Der Agent wird:**
1. Datenmodell in `src/data/customerData.js` erstellen
2. Modul-Komponente in `src/components/modules/CustomerModule.jsx` erstellen
3. Charts integrieren
4. Zu `App.jsx` hinzufügen
5. Testen

---

### 2. **Neuen Agent erstellen**

```
@dashboard-architect create a new ReportAgent

Responsibilities:
- Generate PDF reports
- Schedule automatic reports
- Email distribution
```

**Der Agent wird:**
1. `src/agents/ReportAgent.js` erstellen (extends BaseAgent)
2. Event-Listener registrieren
3. Zum Orchestrator hinzufügen
4. Dokumentation aktualisieren

---

### 3. **Build-Problem beheben**

```
@build-fixer the build is failing with "Cannot find module '@/utils/helper'"

Error log:
[paste error log here]
```

**Der Agent wird:**
1. Error-Log analysieren
2. Root-Cause identifizieren (fehlender Import, falsche Path-Alias, etc.)
3. Fix anwenden
4. Build erneut ausführen
5. Erfolg verifizieren

---

### 4. **Daten-Export erweitern**

```
@data-specialist add Word document export

Requirements:
- Export dashboard data to .docx
- Include charts as images
- Proper formatting
```

**Der Agent wird:**
1. `docx.js` Library integrieren
2. Export-Funktion in `exportUtils.js` erstellen
3. In UI einbinden
4. Testen

---

## 🎨 Best Practices für Agent-Nutzung

### ✅ **DO:**

```
// Klar und spezifisch
@module-builder create InvoiceModule with chart showing monthly revenue

// Mit Kontext
@build-fixer build failing with ESLint errors in App.jsx lines 45-50

// Mit Requirements
@data-specialist add CSV export with following columns: date, amount, customer
```

### ❌ **DON'T:**

```
// Zu vage
@module-builder make it better

// Ohne Kontext
@build-fixer fix it

// Zu viele Aufgaben gleichzeitig
@module-builder create 5 modules with all features
```

---

## 🔍 Agent-Kontext verstehen

Jeder Agent hat Zugriff auf spezifische Dateien:

### dashboard-architect
```
- src/agents/**/*.js
- src/App.jsx
- docs/agents.md
```

### build-fixer
```
- package.json
- vite.config.js
- tailwind.config.js
- .eslintrc.json
- Error logs
```

### module-builder
```
- src/components/modules/**/*.jsx
- src/data/**/*.js
- src/components/charts/**/*.jsx
```

### data-specialist
```
- src/utils/dataParser.js
- src/utils/exportUtils.js
- src/agents/DataIntegrationAgent.js
```

---

## 🚀 Schnellstart

1. **Aktiviere Copilot Pro+** in deinem Editor (VS Code/Cursor)

2. **Lade das Repository**
```bash
git clone <repo-url>
cd Management-Dashboard-Akusti-scan_RT60
npm install
```

3. **Teste einen Agent**
```
@build-fixer check if the build configuration is correct
```

4. **Erstelle etwas Neues**
```
@module-builder create a simple HelloWorld module
```

5. **Beobachte Self-Healing**
```bash
# Breche absichtlich etwas
# Pushe zum Repo
# Warte auf Self-Healing Workflow
```

---

## 🔐 GitHub Actions Secrets

Für Self-Healing benötigst du:

```yaml
# Automatisch verfügbar in GitHub Actions:
GITHUB_TOKEN  # Für Issue-Erstellung und Kommentare
```

Keine zusätzlichen Secrets erforderlich! ✅

---

## 📊 Monitoring

### Build-Status überwachen

```bash
# Aktuelle Workflows ansehen
gh workflow list

# Workflow-Runs ansehen
gh run list --workflow=ci.yml

# Self-Healing Status
gh run list --workflow=self-healing.yml
```

### Issue-Labels

- `build-failure` - Build ist fehlgeschlagen
- `auto-fix-needed` - Self-Healing soll aktiviert werden
- `auto-fixed` - Wurde automatisch behoben
- `retry-1`, `retry-2`, `retry-3` - Retry-Zähler

---

## 🤝 Zusammenarbeit

### Multi-AI Workflow

1. **Claude Code** erstellt Architektur und Agenten
2. **Copilot Pro+** implementiert Features mit spezialisierten Agenten
3. **GPT Codex** generiert Boilerplate und Tests
4. **Self-Healing** behebt automatisch Build-Probleme

### Beispiel-Workflow

```
Claude: "Erstelle Event-Bus System"
└─> EventBus implementiert

Copilot: "@dashboard-architect create AnalyticsAgent"
└─> Agent erstellt und integriert

GPT: "Generiere Unit-Tests für AnalyticsAgent"
└─> Tests erstellt

Build fails → Self-Healing aktiviert → Build fixed ✅
```

---

## 📚 Weitere Ressourcen

- **Agent-System Dokumentation**: `docs/agents.md`
- **Copilot Instructions**: `.github/copilot-instructions.md`
- **CI/CD Workflow**: `.github/workflows/ci.yml`
- **Self-Healing**: `.github/workflows/self-healing.yml`

---

## 💡 Tipps & Tricks

### 1. **Agent-Kombination**

Du kannst mehrere Agenten kombinieren:

```
@module-builder @data-specialist create CustomerModule with Excel export
```

### 2. **Kontext bereitstellen**

Verweise auf spezifische Dateien:

```
@build-fixer error in src/App.jsx line 45 - module not found
```

### 3. **Iteratives Arbeiten**

```
@module-builder create basic structure
// Review
@module-builder add charts to the module
// Review
@data-specialist add export functionality
```

### 4. **Self-Healing manuell triggern**

```bash
# Via GitHub CLI
gh workflow run self-healing.yml \
  --raw-field max_retries=5
```

---

**Viel Erfolg mit Copilot Pro+ und dem Agent-System!** 🚀

Bei Fragen: Erstelle ein Issue oder nutze `@dashboard-architect` für Hilfe!

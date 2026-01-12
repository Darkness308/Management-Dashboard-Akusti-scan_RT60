# Management Dashboard - Akusti-Scan RT60

Konsolidiertes Management Dashboard für Akusti-Scan RT60 mit React, TailwindCSS und Chart.js.

## Features

- **Dashboard Übersicht** - KPIs, Marktwachstum, Zielgruppen
- **Innovation Mapping** - Cross-Sektor-Synergien & Wachstumsfelder
- **Marktanalyse** - TAM/SAM/SOM Berechnungen & Prognosen
- **Business Strategie** - Preisstrategie & Wettbewerbsanalyse
- **KI-System** - 20 KI-Techniken, Workflows & Templates
- **Technik & Normen** - DIN, ISO, VDI Standards
- **Vertrieb** - Zielgruppen-Segmentierung & Kanäle
- **Datenintegration** - Excel/CSV Upload & Analyse
- **Analytics** - Performance-Tracking & Metriken

## Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 5.2
- **Styling**: TailwindCSS 3.4
- **Charts**: Chart.js 4.4 + react-chartjs-2
- **Data**: SheetJS (XLSX) 0.18
- **Language**: JavaScript (ES6+)

## Installation

### Voraussetzungen

- Node.js 18+ (empfohlen: LTS-Version)
- npm 9+ oder yarn 1.22+

### Setup

```bash
# Repository klonen
git clone https://github.com/Darkness308/Management-Dashboard-Akusti-scan_RT60.git
cd Management-Dashboard-Akusti-scan_RT60

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Der Dev-Server läuft auf `http://localhost:3000` und öffnet sich automatisch im Browser.

## Verfügbare Scripts

| Script | Beschreibung |
|--------|--------------|
| `npm run dev` | Startet den Development Server (Vite) |
| `npm run build` | Erstellt Production Build in `/dist` |
| `npm run preview` | Vorschau des Production Builds |
| `npm run lint` | Führt ESLint aus |

## Projektstruktur

```
Management-Dashboard-Akusti-scan_RT60/
│
├── src/
│   ├── components/           # React-Komponenten
│   │   ├── layout/          # Header, Navigation, Footer
│   │   ├── dashboard/       # Overview, KPICard, ModuleGrid
│   │   ├── modules/         # Innovation, Market, Business, etc.
│   │   └── charts/          # LineChart, BarChart, DoughnutChart
│   │
│   ├── data/                # Datenmodelle
│   │   ├── kpiData.js
│   │   ├── marketData.js
│   │   ├── innovationData.js
│   │   ├── businessData.js
│   │   ├── kiSystemData.js
│   │   ├── technikData.js
│   │   ├── vertriebData.js
│   │   └── analyticsData.js
│   │
│   ├── utils/               # Helper-Funktionen
│   │   ├── dataParser.js    # Excel/CSV Parsing
│   │   ├── chartHelpers.js  # Chart.js Konfigurationen
│   │   └── exportUtils.js   # Export-Funktionen
│   │
│   ├── styles/              # CSS/TailwindCSS
│   │   └── index.css
│   │
│   ├── App.jsx              # Haupt-App-Komponente
│   └── main.jsx             # Entry Point
│
├── public/                  # Statische Assets
│   └── vite.svg
│
├── docs/                    # Dokumentation
│   ├── agents.md            # Agent-System Dokumentation
│   ├── design-system.md     # Design-System Guide
│   └── architecture.md      # Architektur-Übersicht
│
├── index.html               # HTML Template
├── package.json             # Dependencies & Scripts
├── vite.config.js           # Vite Konfiguration
├── tailwind.config.js       # TailwindCSS Konfiguration
├── postcss.config.js        # PostCSS Konfiguration
├── .eslintrc.json           # ESLint Konfiguration
├── .gitignore               # Git Ignore Rules
└── README.md                # Diese Datei
```

## Design System

Das Projekt verwendet ein konsistentes Design-System basierend auf TailwindCSS:

- **Primärfarben**: Blue (#667eea), Purple (#764ba2)
- **Sekundärfarben**: Green (#22c55e), Yellow (#eab308)
- **Komponenten**: Cards, Buttons, Badges, Tables
- **Animationen**: Fade-in, Slide-up
- **Responsive**: Mobile-First mit Breakpoints

Details: [docs/design-system.md](./docs/design-system.md)

## Agent-System

Das Dashboard nutzt ein Agent-basiertes Architektur-Modell:

- **DashboardOrchestrator** - Haupt-Agent (Koordination)
- **8 Sub-Agenten** - Spezialisiert auf Daten & UI/UX
  - InnovationAgent, MarketAnalysisAgent, BusinessStrategyAgent
  - KISystemAgent, TechnikAgent, VertriebAgent
  - DataIntegrationAgent, AnalyticsAgent

Details: [docs/agents.md](./docs/agents.md)

## Deployment

### Production Build

```bash
# Build erstellen
npm run build

# Output: dist/
# - index.html
# - assets/
#   - index-[hash].js
#   - index-[hash].css
```

### Deployment-Optionen

**1. Vercel (empfohlen)**
```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel
```

**2. Netlify**
```bash
# Build Settings:
# Build command: npm run build
# Publish directory: dist
```

**3. GitHub Pages**
```bash
# vite.config.js anpassen:
# base: '/Management-Dashboard-Akusti-scan_RT60/'

npm run build
# dist/ Ordner zu gh-pages Branch pushen
```

**4. Statisches Hosting**
- Einfach `/dist` Ordner auf beliebigen Webserver hochladen

## Datenintegration

### Excel/CSV Upload

Das Dashboard unterstützt Upload und Analyse von Excel- und CSV-Dateien:

```javascript
import { parseExcel, parseCSV } from '@utils/dataParser'

// Excel parsen
const data = await parseExcel(file)
// { headers: [...], rows: [[...], [...]] }

// CSV parsen
const data = await parseCSV(file)
// { headers: [...], rows: [[...], [...]] }
```

### Export-Funktionen

```javascript
import { exportJSON, exportMarkdown, exportExcel } from '@utils/exportUtils'

// JSON Export
exportJSON(data)

// Markdown Export
exportMarkdown(data)

// Excel Export
exportExcel(data, 'dashboard_export.xlsx')
```

## Entwicklung

### Code Style

- **ESLint**: Automatische Code-Qualitätsprüfung
- **Prettier**: Code-Formatierung (empfohlen)
- **Konventionen**:
  - Komponenten in PascalCase (`KPICard.jsx`)
  - Utils/Daten in camelCase (`dataParser.js`)
  - CSS Classes mit Tailwind

### Path Aliases

Vite ist konfiguriert mit praktischen Path-Aliases:

```javascript
import KPICard from '@components/dashboard/KPICard'
import { marketData } from '@data/marketData'
import { parseCSV } from '@utils/dataParser'
```

## Troubleshooting

For detailed troubleshooting, see [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

### Quick Fixes

**Problem**: `Module not found` Fehler

```bash
# Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Vite Port bereits in Verwendung

```bash
# Anderen Port verwenden
npm run dev -- --port 3001
```

**Problem**: Build schlägt fehl

```bash
# Cache leeren und neu bauen
rm -rf node_modules/.vite dist
npm install
npm run build
```

## Documentation

- 📖 [Debugging Guide](docs/DEBUGGING.md) - Comprehensive debugging instructions
- 🔧 [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions
- 🏗️ [Architecture](docs/agents.md) - Agent-based architecture documentation
- 🎨 [Design System](docs/design-system.md) - UI components and styling guidelines

## Logging System

The application uses a centralized logger utility that automatically handles development vs production logging:

```javascript
import { logger } from '@utils/logger'

// Different log levels
logger.debug('Debug information')  // Only in development
logger.info('General info')
logger.warn('Warning message')
logger.error('Error occurred')     // Always logged

// Structured logging
logger.log('ComponentName', 'Action', { data })
```

⚠️ **Never use `console.log()` directly** - always use the logger utility!

### Performance

**Problem**: Langsames Rendering bei großen Datensätzen

- Chart-Daten limitieren (max. 1000 Datenpunkte)
- Lazy-Loading für Module aktivieren
- React.memo() für Chart-Komponenten

## Ressourcen

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **TailwindCSS**: https://tailwindcss.com
- **Chart.js**: https://www.chartjs.org
- **SheetJS**: https://sheetjs.com

## Contributing

Beiträge sind willkommen! Bitte:

1. Fork des Repositories erstellen
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## Lizenz

MIT License - siehe [LICENSE](./LICENSE) für Details

## Autor

**Darkness308**

- GitHub: [@Darkness308](https://github.com/Darkness308)

## Acknowledgments

- Raumakustik-Projekt Team
- React & Vite Communities
- TailwindCSS & Chart.js Maintainer

---

**Version**: 1.0.0
**Letztes Update**: November 2025
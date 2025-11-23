# Agents System - Management Dashboard Akusti-Scan RT60

## 🎯 Architektur-Übersicht

Das Dashboard verwendet eine **Agent-basierte Architektur**, bei der spezialisierte Sub-Agenten unterschiedliche Aufgabenbereiche verwalten und vom Haupt-Agent orchestriert werden.

```
┌─────────────────────────────────────────────┐
│        DashboardOrchestrator (Haupt)        │
│  - Koordiniert alle Sub-Agenten             │
│  - Verwaltet globalen State                 │
│  - Routing & Navigation                     │
└─────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
   ┌────▼────┐              ┌─────▼─────┐
   │ Data    │              │ UI/UX     │
   │ Agents  │              │ Agents    │
   └─────────┘              └───────────┘
        │                         │
   ┌────┴─────┬─────┬─────┐      ├────┬────┬────┐
   │          │     │     │      │    │    │    │
   ▼          ▼     ▼     ▼      ▼    ▼    ▼    ▼
```

---

## 🤖 Haupt-Agent

### **DashboardOrchestrator**

**Verantwortlichkeiten:**
- Koordination aller Sub-Agenten
- Globales State Management (Tab-Auswahl, Data-State)
- Routing zwischen Modulen
- Event-Bus für Agent-Kommunikation

**Technische Implementation:**
```jsx
// src/App.jsx - Main Orchestrator
function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [globalData, setGlobalData] = useState({})

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab, globalData }}>
      <Header />
      <Navigation />
      <MainContent />
      <Footer />
    </DashboardContext.Provider>
  )
}
```

**API:**
- `switchTab(tabName)` - Navigation zwischen Modulen
- `updateGlobalData(data)` - Globale Daten aktualisieren
- `exportDashboard(format)` - Export-Funktionalität
- `loadUserPreferences()` - Benutzereinstellungen laden

---

## 📊 Data Agents (Daten-Schicht)

### 1. **InnovationAgent**

**Aufgabe:** Verwaltung von Innovation Mapping & Cross-Sektor-Synergien

**Datenmodell:**
```javascript
{
  sectors: [
    {
      id: 'raumakustik',
      name: 'Raumakustik / Bauphysik',
      emergingTech: 'Smart-Building, IoT, Sensorintegration',
      potential: 'Automatisierte RT60-Messungen',
      relevance: 5
    }
    // ...weitere Sektoren
  ]
}
```

**Funktionen:**
- `getSectors()` - Alle Sektoren abrufen
- `filterByRelevance(minScore)` - Nach Relevanz filtern
- `calculateSynergies()` - Cross-Sektor-Synergien berechnen
- `exportInnovationMap()` - Export als CSV/Excel

**Datei:** `src/data/innovationData.js`

---

### 2. **MarketAnalysisAgent**

**Aufgabe:** TAM/SAM/SOM Berechnungen & Marktwachstums-Prognosen

**Datenmodell:**
```javascript
{
  tam: 63841,           // Total Addressable Market
  sam: 19152,           // Serviceable Available Market (30%)
  som: 958,             // Serviceable Obtainable Market (5%)
  revenuePerCustomer: 1500,
  marketGrowth: [
    { year: 2022, volume: 150 },
    { year: 2023, volume: 210 },
    // ...
  ],
  targetGroups: [
    { name: 'Architekturbüros', percentage: 35 },
    { name: 'Schulen', percentage: 25 },
    // ...
  ]
}
```

**Funktionen:**
- `calculateTAM()` - Gesamtmarkt berechnen
- `calculateSAM(percentage)` - Adressierbaren Markt berechnen
- `calculateSOM(percentage)` - Erreichbaren Markt berechnen
- `forecastRevenue(years)` - Umsatzprognose erstellen
- `getMarketGrowthRate()` - Wachstumsrate berechnen

**Datei:** `src/data/marketData.js`

---

### 3. **BusinessStrategyAgent**

**Aufgabe:** Preisstrategie, Wettbewerbsanalyse & Umsatzmodellierung

**Datenmodell:**
```javascript
{
  pricing: {
    basic: 49,
    professional: 125,
    enterprise: 'custom'
  },
  competitors: [
    { name: 'Autodesk Forma', price: 185, hasAI: true },
    { name: 'PlanRadar', price: '26-129', hasAI: true },
    // ...
  ],
  revenueProjections: [
    { year: 1, revenue: 360000 },
    { year: 2, revenue: 720000 },
    // ...
  ]
}
```

**Funktionen:**
- `compareCompetitors()` - Wettbewerber vergleichen
- `optimizePricing()` - Preisoptimierung vorschlagen
- `calculateLTV()` - Lifetime Value berechnen
- `calculateCAC()` - Customer Acquisition Cost berechnen

**Datei:** `src/data/businessData.js`

---

### 4. **KISystemAgent**

**Aufgabe:** Verwaltung von KI-Optimierungs-Strategien, Workflows & Templates

**Datenmodell:**
```javascript
{
  techniques: [
    {
      id: '002',
      name: 'Progressive Komplexitäts-Steigerung',
      successRate: 93,
      duration: 5,
      status: 'Flagship',
      description: '4-Stufen-Modell für optimale Verständlichkeit und Kontext-Persistenz'
    },
    {
      id: '007',
      name: 'Adaptive Sprach-Optimierung',
      successRate: 95,
      duration: 2,
      status: 'Bewährt',
      description: 'Konsistente Sprachmuster für präzise KI-Ausgaben'
    }
    // ...weitere Optimierungs-Strategien (insgesamt 20)
  ],
  workflows: [
    {
      id: 'ki-optimization',
      name: 'KI-Optimierungs-Workflow',
      duration: 19,
      successRate: 91,
      description: 'Systematische Verbesserung der KI-Ausgabe-Qualität',
      steps: ['#002', '#007', '#011']
    },
    {
      id: 'efficiency-boost',
      name: 'Effizienz-Optimierung',
      duration: 18,
      successRate: 87,
      description: 'Maximale Kosteneffizienz bei hoher Qualität',
      steps: ['#016', '#003', '#013']
    }
    // ...weitere Workflows
  ],
  templates: [
    { id: 'business-enhancement', name: 'Business-Enhancement', /* ... */ }
    // ...
  ]
}
```

**Funktionen:**
- `getTopTechniques(count)` - Top-Strategien nach Erfolgsrate abrufen
- `getRecommendedWorkflow(goal)` - Workflow-Empfehlung (optimization, business, efficiency)
- `getTechniquesByCategory(category)` - Strategien nach Kategorie filtern
- `exportTemplate(templateId)` - Template exportieren

**Kategorien:**
- **Strukturierung:** Prompt-Engineering, Komplexitäts-Management
- **Qualität:** Meta-Reflexion, Output-Format-Standardisierung
- **Effizienz:** API-Optimierung, Context-Window-Maximierung
- **Sprachsteuerung:** Adaptive Sprach-Optimierung

**Datei:** `src/data/kiSystemData.js`

---

### 5. **TechnikAgent**

**Aufgabe:** Verwaltung technischer Anforderungen & Normen (DIN, ISO, VDI)

**Datenmodell:**
```javascript
{
  hardware: [
    { name: 'iPad Pro mit LiDAR Scanner', required: true },
    { name: 'iOS 15+', required: true },
    // ...
  ],
  software: [
    { name: 'Swift / SwiftUI', required: true },
    { name: 'ARKit für Raumerfassung', required: true },
    // ...
  ],
  standards: [
    {
      id: 'DIN-18041',
      name: 'DIN 18041',
      description: 'Hörsamkeit in Räumen',
      category: 'Raumakustik'
    },
    {
      id: 'ISO-3382',
      name: 'ISO 3382',
      description: 'Messung von Raumakustischen Parametern',
      category: 'Messung'
    }
    // ...
  ]
}
```

**Funktionen:**
- `getRequiredHardware()` - Hardware-Anforderungen abrufen
- `getRequiredSoftware()` - Software-Anforderungen abrufen
- `getRelevantStandards()` - Relevante Normen abrufen
- `checkCompliance(config)` - Compliance prüfen

**Datei:** `src/data/technikData.js`

---

### 6. **VertriebAgent**

**Aufgabe:** Zielgruppen-Segmentierung & Vertriebskanal-Management

**Datenmodell:**
```javascript
{
  targetGroups: [
    {
      name: 'Architekturbüros',
      percentage: 35,
      size: 'Large',
      priority: 'High',
      channels: ['Direktvertrieb', 'Partner-Netzwerk']
    }
    // ...
  ],
  salesChannels: [
    {
      name: 'Direktvertrieb',
      description: 'Sales Team für große Kunden',
      effectiveness: 85,
      cost: 'High'
    }
    // ...
  ]
}
```

**Funktionen:**
- `segmentTargetGroups()` - Zielgruppen segmentieren
- `optimizeChannelMix()` - Kanal-Mix optimieren
- `calculateConversionRates()` - Conversion-Raten berechnen
- `generateLeadScore(lead)` - Lead-Scoring

**Datei:** `src/data/vertriebData.js`

---

### 7. **DataIntegrationAgent**

**Aufgabe:** Excel/CSV Upload, Parsing & Daten-Transformation

**Funktionen:**
- `parseCSV(file)` - CSV-Datei parsen
- `parseExcel(file)` - Excel-Datei parsen (via SheetJS)
- `validateData(data)` - Daten validieren
- `transformData(data, schema)` - Daten transformieren
- `detectColumns(data)` - Spalten automatisch erkennen
- `exportData(format)` - Daten exportieren (JSON, CSV, Excel)

**Datei:** `src/utils/dataParser.js`

**Technische Details:**
```javascript
// Verwendet SheetJS (xlsx) für Excel-Parsing
import * as XLSX from 'xlsx'

export const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      resolve({
        headers: json[0],
        rows: json.slice(1)
      })
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
```

---

### 8. **AnalyticsAgent**

**Aufgabe:** Performance-Tracking, Nutzungsstatistiken & Dashboard-Analytics

**Datenmodell:**
```javascript
{
  moduleUsage: {
    innovation: 15,
    market: 18,
    business: 20,
    kiSystem: 22,
    technik: 10,
    vertrieb: 8,
    data: 7
  },
  featureActivity: {
    charts: 95,
    upload: 75,
    export: 85,
    kiTools: 88,
    analytics: 92
  },
  performance: {
    dataIntegration: 95,
    visualization: 100,
    kiFeatures: 88,
    exportFunctions: 92
  }
}
```

**Funktionen:**
- `trackModuleUsage(moduleName)` - Modul-Nutzung tracken
- `getPerformanceMetrics()` - Performance-Metriken abrufen
- `generateAnalyticsReport()` - Analytics-Report erstellen
- `getTopFeatures()` - Meistgenutzte Features

**Datei:** `src/data/analyticsData.js`

---

## 🎨 UI/UX Agents (Präsentations-Schicht)

### 9. **ChartAgent**

**Aufgabe:** Chart-Konfiguration & Visualisierung (Chart.js)

**Funktionen:**
- `createLineChart(data, options)` - Linien-Chart erstellen
- `createBarChart(data, options)` - Balken-Chart erstellen
- `createDoughnutChart(data, options)` - Donut-Chart erstellen
- `createPieChart(data, options)` - Pie-Chart erstellen
- `updateChartData(chartRef, newData)` - Chart-Daten aktualisieren

**Datei:** `src/utils/chartHelpers.js`

**Standard-Konfiguration:**
```javascript
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
        }
      }
    }
  }
}
```

---

### 10. **ExportAgent**

**Aufgabe:** Dashboard-Export in verschiedenen Formaten

**Funktionen:**
- `exportJSON(data)` - JSON-Export
- `exportMarkdown(data)` - Markdown-Export
- `exportPDF(data)` - PDF-Export (via jsPDF)
- `exportExcel(data)` - Excel-Export (via SheetJS)

**Datei:** `src/utils/exportUtils.js`

---

## 🔄 Agent-Kommunikation

### Event-Bus System

Agenten kommunizieren über ein Event-Bus System:

```javascript
// src/utils/eventBus.js
class EventBus {
  constructor() {
    this.events = {}
  }

  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data))
    }
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  }

  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback)
    }
  }
}

export const eventBus = new EventBus()
```

### Verwendung:

```javascript
// Agent 1: Emit Event
eventBus.emit('data:uploaded', { fileName: 'data.xlsx', rows: 100 })

// Agent 2: Listen to Event
eventBus.on('data:uploaded', (data) => {
  console.log(`Received ${data.rows} rows from ${data.fileName}`)
  // Trigger re-render or update state
})
```

---

## 📋 Agent-Lifecycle

### 1. Initialisierung
```javascript
// App.jsx
useEffect(() => {
  // Initialize all agents
  InnovationAgent.init()
  MarketAnalysisAgent.init()
  // ...
}, [])
```

### 2. Daten-Laden
```javascript
const loadData = async () => {
  const marketData = await MarketAnalysisAgent.loadData()
  const innovationData = await InnovationAgent.loadData()
  setGlobalData({ market: marketData, innovation: innovationData })
}
```

### 3. Update-Zyklus
```javascript
eventBus.on('data:changed', (newData) => {
  // Update relevant components
  MarketAnalysisAgent.updateData(newData)
})
```

### 4. Cleanup
```javascript
useEffect(() => {
  return () => {
    // Cleanup on unmount
    eventBus.off('data:changed')
  }
}, [])
```

---

## 🚀 Best Practices

### 1. **Single Responsibility**
Jeder Agent hat genau **eine klar definierte Aufgabe**.

### 2. **Loose Coupling**
Agenten kommunizieren über **Events**, nicht direkt.

### 3. **Data Immutability**
Daten werden **niemals direkt mutiert**, sondern kopiert.

```javascript
// ❌ Bad
agent.data.push(newItem)

// ✅ Good
agent.data = [...agent.data, newItem]
```

### 4. **Error Handling**
Jeder Agent hat **eigene Error-Handling-Logik**.

```javascript
try {
  const data = await loadData()
} catch (error) {
  eventBus.emit('error:occurred', { agent: 'MarketAnalysis', error })
}
```

### 5. **Testing**
Agenten sind **isoliert testbar**.

```javascript
// tests/agents/MarketAnalysisAgent.test.js
describe('MarketAnalysisAgent', () => {
  it('should calculate TAM correctly', () => {
    expect(MarketAnalysisAgent.calculateTAM()).toBe(63841)
  })
})
```

---

## 📚 Weitere Dokumentation

- [Design System](./design-system.md)
- [Architektur-Übersicht](./architecture.md)
- [API-Dokumentation](./api.md)

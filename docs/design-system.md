# Design System - Management Dashboard Akusti-Scan RT60

## 🎨 Farbpalette

### Primärfarben
- **Primary Blue**: `#667eea` - Hauptakzentfarbe für Navigation, CTAs
- **Primary Purple**: `#764ba2` - Sekundärer Akzent für Gradients

### Sekundärfarben
- **Secondary Green**: `#22c55e` - Erfolg, positive Metriken
- **Secondary Yellow**: `#eab308` - Warnung, Aufmerksamkeit

### Grauskala
- **Gray 50**: `#f9fafb` - Hintergrund
- **Gray 100**: `#f3f4f6` - Leichte Hintergründe
- **Gray 200-800**: Standard-Graustufen
- **Gray 900**: `#111827` - Haupttext

### Gradients
```css
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--gradient-success: linear-gradient(135deg, #22c55e 0%, #16a34a 100%)
--gradient-metric: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)
```

## 📐 Spacing System

| Name | Value | Usage |
|------|-------|-------|
| xs   | 0.25rem (4px) | Sehr enge Abstände |
| sm   | 0.5rem (8px) | Icons, kleine Gaps |
| md   | 1rem (16px) | Standard-Spacing |
| lg   | 1.5rem (24px) | Sektion-Abstände |
| xl   | 2rem (32px) | Große Abstände |
| 2xl  | 3rem (48px) | Sektion-Trennung |

## 🔤 Typografie

### Schrift
- **Font Family**: System Font Stack (font-sans)
  - `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...`

### Font Sizes
- **h1**: `text-4xl` (2.25rem / 36px)
- **h2**: `text-3xl` (1.875rem / 30px)
- **h3**: `text-2xl` (1.5rem / 24px)
- **h4**: `text-xl` (1.25rem / 20px)
- **Body**: `text-base` (1rem / 16px)
- **Small**: `text-sm` (0.875rem / 14px)
- **XSmall**: `text-xs` (0.75rem / 12px)

### Font Weights
- **Regular**: `400`
- **Semibold**: `600`
- **Bold**: `700`

## 📦 Komponenten

### Cards

#### Standard Card
```jsx
<div className="card">
  {/* Content */}
</div>
```
- **Background**: White
- **Border Radius**: `rounded-xl` (12px)
- **Shadow**: Medium
- **Padding**: 1.5rem (24px)

#### Hover Card
```jsx
<div className="card card-hover">
  {/* Content */}
</div>
```
- Hebt sich bei Hover leicht an (`-translate-y-1`)
- Shadow verstärkt sich

#### Metric Card
```jsx
<div className="metric-card">
  {/* Metric Content */}
</div>
```
- Gradient-Hintergrund
- Für KPI-Anzeigen

### Buttons

#### Primary Button
```jsx
<button className="btn btn-primary">
  Button Text
</button>
```
- Gradient-Hintergrund (Blue → Purple)
- White Text
- Hover: Shadow-Verstärkung

#### Secondary Button
```jsx
<button className="btn btn-secondary">
  Button Text
</button>
```
- Gray Background
- Dark Gray Text
- Hover: Darker Gray

### Navigation

#### Navigation Button
```jsx
<button className="nav-btn">Tab</button>
<button className="nav-btn active">Active Tab</button>
```
- **Default**: Gray Background
- **Active**: Gradient Background, White Text, Shadow

### Badges

```jsx
<span className="badge badge-blue">5</span>
<span className="badge badge-purple">4</span>
<span className="badge badge-green">Success</span>
<span className="badge badge-yellow">Warning</span>
```

### Tables

```jsx
<table className="w-full">
  <thead className="table-header">
    <tr>
      <th className="px-4 py-3 text-left">Header</th>
    </tr>
  </thead>
  <tbody>
    <tr className="table-row">
      <td className="px-4 py-3">Data</td>
    </tr>
  </tbody>
</table>
```

## 🎭 Icons & Emojis

Wir verwenden Unicode-Emojis für schnelle, plattformübergreifende Icons:

| Kontext | Emoji | Unicode |
|---------|-------|---------|
| Dashboard | 📊 | U+1F4CA |
| Übersicht | 🏠 | U+1F3E0 |
| Innovation | 🚀 | U+1F680 |
| Markt | 🌍 | U+1F30D |
| Business | 💼 | U+1F4BC |
| KI-System | 🤖 | U+1F916 |
| Technik | ⚙️ | U+2699 |
| Vertrieb | 📈 | U+1F4C8 |
| Daten | 📂 | U+1F4C2 |
| Analytics | 📊 | U+1F4CA |
| Export | 📥 | U+1F4E5 |
| Erfolg | ✅ | U+2705 |
| Ziel | 🎯 | U+1F3AF |
| Geld | 💰 | U+1F4B0 |

## 🌊 Animationen

### Fade In
```jsx
<div className="animate-fade-in">
  {/* Content */}
</div>
```
- Dauer: 300ms
- Easing: ease-in

### Slide Up
```jsx
<div className="animate-slide-up">
  {/* Content */}
</div>
```
- Dauer: 300ms
- Easing: ease-out
- Start: 10px unten, Opacity 0

## 📱 Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| sm | 640px | Small tablets |
| md | 768px | Tablets |
| lg | 1024px | Desktops |
| xl | 1280px | Large desktops |
| 2xl | 1536px | Extra large |

### Responsive Patterns

#### Grid Layouts
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cards */}
</div>
```

#### Flex Layouts
```jsx
<div className="flex flex-wrap justify-between items-center">
  {/* Items */}
</div>
```

## ♿ Accessibility

### Kontrast-Ratios
- **Text auf White**: Minimum 4.5:1 (WCAG AA)
- **Large Text**: Minimum 3:1

### Focus States
Alle interaktiven Elemente haben sichtbare Focus-States:
```css
:focus {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}
```

### Keyboard Navigation
- Alle Buttons und Links sind per Tab erreichbar
- Enter/Space aktiviert Buttons
- Escape schließt Modals

## 🎨 Usage Guidelines

### Do's ✅
- Verwende Gradient für Header und Hero-Bereiche
- Nutze Metric Cards für KPI-Anzeigen
- Halte Cards konsistent mit 24px Padding
- Verwende Hover-Effects sparsam für wichtige CTAs
- Nutze Badges für Status und Kategorien

### Don'ts ❌
- Keine zu vielen verschiedenen Farben mischen
- Keine Text-Gradients auf farbigen Hintergründen
- Keine zu kleinen Touch-Targets (<44px)
- Keine zu langen Animationen (>500ms)
- Keine reine Icon-Navigation ohne Labels

## 📚 Ressourcen

- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **Chart.js Docs**: https://www.chartjs.org/docs
- **React Docs**: https://react.dev

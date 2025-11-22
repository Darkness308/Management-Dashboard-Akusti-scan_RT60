# Copilot Instructions - Management Dashboard

## 🎯 Project Overview

This is a **React-based Management Dashboard** for "Akusti-Scan RT60" with an **Agent-based architecture**.

**Tech Stack:**
- React 18.3 + Vite 5.2
- TailwindCSS 3.4
- Chart.js 4.4
- Agent-based architecture for modularity

---

## 🤖 Agent System Architecture

The project uses an **event-driven agent system** for clean separation of concerns.

### Available Agents

| Agent | Location | Responsibility |
|-------|----------|----------------|
| `DashboardOrchestrator` | `src/agents/DashboardOrchestrator.js` | Main coordinator, manages global state |
| `DataIntegrationAgent` | `src/agents/DataIntegrationAgent.js` | Excel/CSV upload & parsing |
| `AnalyticsAgent` | `src/agents/AnalyticsAgent.js` | Performance tracking & metrics |

### Event-Bus System

Communication between agents uses the Event-Bus pattern:

```javascript
import { eventBus, EVENTS } from '@utils/eventBus'

// Emit an event
eventBus.emit(EVENTS.DATA_UPLOADED, { fileName: 'data.xlsx' })

// Listen to an event
eventBus.on(EVENTS.DATA_UPLOADED, (data) => {
  console.log('File uploaded:', data.fileName)
})
```

### Common Event Names

```javascript
EVENTS.DATA_UPLOADED      // File uploaded
EVENTS.DATA_CHANGED       // Data modified
EVENTS.MODULE_CHANGED     // User switched module
EVENTS.ANALYTICS_TRACKED  // Analytics event
EVENTS.ERROR_OCCURRED     // Error happened
```

---

## 📁 Project Structure

```
src/
├── agents/                  # Agent system
│   ├── BaseAgent.js         # Base class for agents
│   ├── DashboardOrchestrator.js
│   ├── DataIntegrationAgent.js
│   ├── AnalyticsAgent.js
│   └── index.js             # Central exports
│
├── components/
│   ├── layout/              # Header, Navigation, Footer
│   ├── dashboard/           # Overview, KPICard, ModuleGrid
│   ├── modules/             # 9 feature modules
│   └── charts/              # Chart components
│
├── data/                    # Data models & mock data
├── utils/                   # Helper functions
│   ├── eventBus.js          # Event system
│   ├── dataParser.js        # File parsing
│   ├── chartHelpers.js      # Chart configs
│   └── exportUtils.js       # Export functions
│
├── styles/                  # TailwindCSS
├── App.jsx                  # Main app with agent initialization
└── main.jsx                 # Entry point
```

---

## 🔧 Coding Guidelines

### 1. **Creating New Agents**

When creating a new agent, extend `BaseAgent`:

```javascript
import { BaseAgent } from './BaseAgent'
import { EVENTS } from '@utils/eventBus'

export class MyNewAgent extends BaseAgent {
  constructor() {
    super('MyNewAgent')
  }

  async init() {
    await super.init()
    // Your initialization logic
    this.setupEventListeners()
  }

  setupEventListeners() {
    this.on(EVENTS.SOME_EVENT, (data) => {
      this.handleEvent(data)
    })
  }

  handleEvent(data) {
    this.log('Handling event:', data)
    // Your logic here
  }
}

export const myNewAgent = new MyNewAgent()
export default myNewAgent
```

### 2. **Register New Agents**

Add to `src/agents/index.js`:

```javascript
export { MyNewAgent, myNewAgent } from './MyNewAgent'

// In initializeAgentSystem():
orchestrator.registerAgent(myNewAgent)
```

### 3. **Component Patterns**

All modules follow this pattern:

```javascript
export default function MyModule() {
  return (
    <section className="space-y-6">
      <h2 className="text-4xl font-bold section-header">
        🔥 Module Title
      </h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Content */}
      </div>
    </section>
  )
}
```

### 4. **TailwindCSS Utility Classes**

Use these predefined classes:

- **Cards**: `.card`, `.card-hover`, `.metric-card`
- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`
- **Navigation**: `.nav-btn`, `.nav-btn.active`
- **Badges**: `.badge`, `.badge-blue`, `.badge-purple`, etc.
- **Headers**: `.section-header`

### 5. **Chart Components**

```javascript
import LineChart from '@components/charts/LineChart'

<LineChart
  labels={['2022', '2023', '2024']}
  datasets={[{
    label: 'Revenue',
    data: [100, 200, 300],
    borderColor: '#667eea'
  }]}
/>
```

---

## 🐛 Error Handling

All agents should handle errors gracefully:

```javascript
try {
  const data = await parseFile(file)
  this.emit(EVENTS.DATA_UPLOADED, data)
} catch (error) {
  this.error('File parsing failed', error)
  // Error event is automatically emitted by BaseAgent.error()
}
```

---

## 🔄 Self-Healing Workflow

The repo has **automatic build fixing**:

1. **CI/CD Pipeline** (`ci.yml`) runs on every push
2. If build fails, creates an issue with label `auto-fix-needed`
3. **Self-Healing Workflow** (`self-healing.yml`) triggers
4. Attempts common fixes (dependencies, lint, imports)
5. Retries build up to 3 times
6. If successful, closes issue automatically

### Common Build Fixes

```bash
# Missing dependencies
npm install --save-dev @vitejs/plugin-react

# ESLint errors
npm run lint -- --fix

# Type errors
npm install --save-dev @types/react @types/react-dom
```

---

## 📊 Data Models

All data is modular and located in `src/data/`:

- `kpiData.js` - Dashboard KPIs
- `marketData.js` - Market analysis (TAM/SAM/SOM)
- `innovationData.js` - Innovation sectors
- `businessData.js` - Pricing & competitors
- `kiSystemData.js` - AI techniques
- `technikData.js` - Technical requirements
- `vertriebData.js` - Sales channels
- `analyticsData.js` - Performance metrics

---

## 🚀 Quick Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Production
npm run build        # Create production build
npm run preview      # Preview production build

# Quality
npm run lint         # Run ESLint
```

---

## 🎨 Design System

See `docs/design-system.md` for complete design guidelines.

**Color Palette:**
- Primary: `#667eea` (blue), `#764ba2` (purple)
- Secondary: `#22c55e` (green), `#eab308` (yellow)

**Spacing:** Use Tailwind's spacing scale (4px increments)

**Breakpoints:**
- `sm`: 640px (tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (desktops)
- `xl`: 1280px (large desktops)

---

## 🤝 Collaboration Guidelines

### For Copilot Pro+

1. **Respect Agent Boundaries**: Each agent has specific responsibilities
2. **Use Events**: Communicate via Event-Bus, not direct calls
3. **Follow Patterns**: Match existing code style
4. **Test Changes**: Ensure builds pass before committing
5. **Document**: Update docs when adding features

### For Claude Code

- Focus on architecture and system design
- Create comprehensive documentation
- Implement complex algorithms

### For GPT Codex

- Generate boilerplate code
- Implement utility functions
- Write tests

---

## 📚 Additional Resources

- **Architecture**: `docs/agents.md`
- **Design**: `docs/design-system.md`
- **README**: Root README.md for setup

---

## 🎯 Current Priorities

1. ✅ All 9 modules implemented
2. ✅ Agent system operational
3. ⏳ PDF/Word export (pending)
4. ⏳ PWA support (pending)
5. ⏳ Performance optimizations (pending)

---

**Remember:** This is a **collaborative codebase**. Always check existing patterns before implementing new features!

# Debugging Guide

This guide helps you debug and troubleshoot issues in the Management Dashboard application.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Logging System](#logging-system)
3. [Common Issues](#common-issues)
4. [Debugging Tools](#debugging-tools)
5. [Performance Debugging](#performance-debugging)
6. [Agent System Debugging](#agent-system-debugging)

---

## Development Setup

### Prerequisites

- Node.js 16+ and npm
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
npm install
```

### Running in Development Mode

```bash
npm run dev
```

The app will start at `http://localhost:3000`

---

## Logging System

The application uses a centralized logging system (`src/utils/logger.js`) that automatically disables logs in production.

### Usage

```javascript
import { logger } from '@utils/logger'

// Different log levels
logger.debug('Detailed debugging information')
logger.info('General information')
logger.warn('Warning messages')
logger.error('Error messages')

// With additional data
logger.log('ComponentName', 'Action performed', { data })

// Grouping logs
logger.group('Component Initialization')
logger.info('Step 1')
logger.info('Step 2')
logger.groupEnd()

// Performance measurement
logger.time('operation')
// ... do something
logger.timeEnd('operation')
```

### Configuration

In development, all logs are enabled. To change log level:

```javascript
import { logger } from '@utils/logger'

// Set level: DEBUG, INFO, WARN, ERROR, NONE
logger.setLevel('WARN') // Only warnings and errors
```

### Console Statements

⚠️ **Do NOT use `console.log()` directly!** Always use the logger utility:

- ❌ `console.log('message')`
- ✅ `logger.info('message')`

The build system automatically removes console statements in production, but using the logger is more maintainable.

---

## Common Issues

### Build Fails

**Issue:** `npm run build` fails

**Solutions:**

1. Clean install dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check for missing imports or syntax errors:
   ```bash
   npm run lint
   ```

3. Ensure index.html exists in root directory

### Module Not Found

**Issue:** Import error like `Cannot find module '@utils/logger'`

**Solutions:**

1. Check path alias in `vite.config.js`:
   ```javascript
   resolve: {
     alias: {
       '@': path.resolve(__dirname, './src'),
       '@utils': path.resolve(__dirname, './src/utils'),
       // ...
     }
   }
   ```

2. Restart dev server after config changes

### Linter Errors

**Issue:** ESLint reports errors

**Solutions:**

```bash
# View all errors
npm run lint

# Auto-fix where possible
npm run lint -- --fix
```

### Agent System Not Initializing

**Issue:** Agents fail to initialize

**Solutions:**

1. Check browser console for errors
2. Enable debug logging:
   ```javascript
   import { eventBus } from '@utils/eventBus'
   eventBus.setDebug(true)
   ```

3. Verify agent initialization in `src/agents/index.js`

---

## Debugging Tools

### Browser DevTools

**React DevTools:**
- Install [React DevTools](https://react.dev/learn/react-developer-tools)
- Inspect component tree, props, and state

**Performance Tab:**
- Record page load and interactions
- Analyze render times and bottlenecks

**Network Tab:**
- Check API calls and resource loading
- Verify file sizes and load times

### Vite Debug Mode

See detailed build information:

```bash
DEBUG=vite:* npm run build
```

### Source Maps

Source maps are enabled in development and production builds for easier debugging.

In browser DevTools:
1. Go to Sources tab
2. Navigate to `webpack://` or `vite://`
3. View original source code

---

## Performance Debugging

### Measuring Component Performance

```javascript
import { measurePerformance } from '@utils/performance'

// Measure async operation
const result = await measurePerformance('LoadData', async () => {
  return await fetchData()
})

// Measure component render
import { monitorComponentPerformance } from '@utils/performance'

function MyComponent() {
  useEffect(() => {
    const cleanup = monitorComponentPerformance('MyComponent')
    return cleanup
  }, [])
  
  // ...
}
```

### View Performance Metrics

```javascript
import { logPerformanceMetrics } from '@utils/performance'

// In development only
logPerformanceMetrics()
```

### Bundle Analysis

Analyze bundle size:

```bash
npm run build -- --mode=production

# Bundle details will be printed to console
```

Check for:
- Large chunks (>500KB)
- Duplicate dependencies
- Unnecessary imports

### React Performance

**Check for unnecessary re-renders:**

1. Use React DevTools Profiler
2. Look for components with memo() wrapper
3. Ensure proper dependency arrays in useMemo/useCallback

**Optimize:**

```javascript
import { memo, useMemo, useCallback } from 'react'

// Memoize component
export default memo(MyComponent)

// Memoize expensive calculations
const result = useMemo(() => expensiveCalculation(data), [data])

// Memoize callbacks
const handleClick = useCallback(() => {
  // handle click
}, [dependency])
```

---

## Agent System Debugging

### Enable Debug Mode

```javascript
import { eventBus } from '@utils/eventBus'

// Enable debug logging for all events
eventBus.setDebug(true)
```

### Check Agent Status

```javascript
import { orchestrator } from './agents'

// Get agent system state
const state = orchestrator.getState()
console.log('Active module:', state.activeModule)
console.log('Registered agents:', state.agents.map(a => a.name))
```

### Monitor Events

```javascript
import { eventBus, EVENTS } from '@utils/eventBus'

// Listen to all module changes
eventBus.on(EVENTS.MODULE_CHANGED, (data) => {
  logger.info('Module changed:', data)
})

// Listen to errors
eventBus.on(EVENTS.ERROR_OCCURRED, (data) => {
  logger.error('Error occurred:', data)
})
```

### Track Event Listeners

```javascript
import { eventBus } from '@utils/eventBus'

// Get all registered events
const events = eventBus.getEvents()
logger.info('Registered events:', events)

// Get listener count for an event
const count = eventBus.getListenerCount(EVENTS.MODULE_CHANGED)
logger.info('Listeners:', count)
```

### Common Agent Issues

**Agent not receiving events:**

1. Check if agent is registered:
   ```javascript
   orchestrator.registerAgent(myAgent)
   ```

2. Verify event listener setup:
   ```javascript
   this.on(EVENTS.SOME_EVENT, (data) => {
     // handler
   })
   ```

3. Ensure agent is initialized:
   ```javascript
   await myAgent.init()
   ```

**Memory leaks:**

Always clean up listeners in destroy():

```javascript
destroy() {
  this.listeners.forEach(unsubscribe => unsubscribe())
  this.listeners = []
}
```

---

## Troubleshooting Checklist

- [ ] Clear browser cache and reload
- [ ] Check browser console for errors
- [ ] Verify all dependencies installed (`npm install`)
- [ ] Run linter (`npm run lint`)
- [ ] Check Node.js version (16+)
- [ ] Try clean install (`rm -rf node_modules && npm install`)
- [ ] Check if dev server is running (`npm run dev`)
- [ ] Verify index.html exists in root
- [ ] Check network tab for failed requests
- [ ] Enable debug logging
- [ ] Check React DevTools for component issues

---

## Getting Help

If you're still stuck:

1. Check [GitHub Issues](https://github.com/Darkness308/Management-Dashboard-Akusti-scan_RT60/issues)
2. Review [Documentation](../docs/)
3. Check commit history for recent changes
4. Create a new issue with:
   - Error messages
   - Steps to reproduce
   - Browser and Node.js versions
   - Screenshots if applicable

---

**Last Updated:** January 2026

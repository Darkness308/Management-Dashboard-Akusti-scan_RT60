# Troubleshooting Guide

Common issues and their solutions for the Management Dashboard.

## Quick Fixes

### Application Won't Start

**Symptom:** `npm run dev` fails or shows errors

**Solutions:**

```bash
# 1. Clean install
rm -rf node_modules package-lock.json dist
npm install

# 2. Check Node version (must be 16+)
node --version

# 3. Clear Vite cache
rm -rf node_modules/.vite

# 4. Verify port 3000 is available
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000 (macOS/Linux)
```

---

## Build Issues

### Build Fails with "Cannot resolve entry module"

**Error:**
```
Could not resolve entry module "index.html"
```

**Solution:**

Ensure `index.html` exists in project root (not in dist/ or public/):

```bash
# Check if index.html exists
ls -la index.html

# If missing, it should contain:
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Management Dashboard - Akusti-Scan RT60</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### Import Path Errors

**Error:**
```
Cannot find module '@utils/logger'
```

**Solution:**

1. Check `vite.config.js` has path aliases:

```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@utils': path.resolve(__dirname, './src/utils'),
    '@components': path.resolve(__dirname, './src/components'),
    '@data': path.resolve(__dirname, './src/data')
  }
}
```

2. Restart dev server after config changes

3. Verify file exists:
```bash
ls src/utils/logger.js
```

### Large Bundle Size Warning

**Warning:**
```
Some chunks are larger than 500 KiB
```

**Solution:**

This is normal for this application. The build is optimized with:
- Code splitting (lazy-loaded modules)
- Tree shaking
- Terser minification
- Separate vendor chunks

To reduce further:
1. Check for unused dependencies
2. Use dynamic imports for heavy libraries
3. Optimize images and assets

---

## Runtime Issues

### White Screen on Load

**Symptom:** Application shows blank white screen

**Debugging Steps:**

1. Open browser DevTools console (F12)
2. Look for JavaScript errors
3. Common causes:
   - Import errors
   - Initialization failures
   - Missing dependencies

**Solutions:**

```bash
# Check for build errors
npm run build

# Clear browser cache
# Chrome: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Check if service worker is causing issues
# In DevTools: Application > Service Workers > Unregister
```

### Module/Component Not Loading

**Symptom:** Specific module shows loading spinner forever

**Solutions:**

1. Check browser console for errors
2. Verify module file exists:
   ```bash
   ls src/components/modules/[ModuleName].jsx
   ```

3. Check for import errors in the module file

4. Verify lazy loading:
   ```javascript
   const MyModule = lazy(() => import('./components/modules/MyModule'))
   ```

### Error Boundary Triggered

**Symptom:** "Etwas ist schiefgelaufen" error screen

**Solutions:**

1. Check browser console for error details
2. Look at component stack trace (in development mode)
3. Common causes:
   - Missing props
   - Null/undefined data
   - Invalid prop types
   - Render errors

**Prevention:**

```javascript
// Always validate props
MyComponent.propTypes = {
  data: PropTypes.object.isRequired
}

// Use optional chaining
const value = data?.property?.nested

// Provide defaults
const { items = [] } = props
```

---

## Data Issues

### CSV/Excel Upload Fails

**Symptom:** File upload shows error message

**Common Errors:**

1. **"Datei ist zu groß"**
   - Maximum file size: 10MB
   - Solution: Reduce file size or split data

2. **"Ungültiges Dateiformat"**
   - Only .csv, .xlsx, .xls supported
   - Solution: Convert file to supported format

3. **"Zu viele Zeilen"**
   - Maximum rows: 10,000
   - Solution: Reduce data or paginate

**Debug File Parsing:**

```javascript
import { logger } from '@utils/logger'

// Check file details
logger.info('File size:', file.size)
logger.info('File name:', file.name)
logger.info('File type:', file.type)
```

### LocalStorage Data Lost

**Symptom:** Uploaded data disappears after refresh

**Causes:**

1. Browser's LocalStorage is full (5-10MB limit)
2. Private/Incognito mode
3. Browser settings blocking storage

**Solutions:**

```bash
# Check LocalStorage in DevTools:
# Application > Local Storage > localhost:3000

# Clear storage to free space:
localStorage.clear()
```

**Workarounds:**

- Reduce data size before upload
- Re-upload file after refresh
- Export data regularly

---

## Performance Issues

### Slow Page Load

**Symptoms:**
- Long initial load time
- Blank screen for several seconds

**Solutions:**

1. **Check Network Tab:**
   - Large bundle files (normal: <3MB total)
   - Slow network connection
   - Failed resource loading

2. **Optimize:**
   ```bash
   # Build with optimization
   npm run build
   
   # Serve optimized build
   npm run preview
   ```

3. **Enable caching:**
   - Service Worker should cache assets
   - Check: DevTools > Application > Service Workers

### Slow Module Switching

**Symptom:** Delay when switching between modules

**Solutions:**

1. Modules are lazy-loaded (intended behavior)
2. Improve load time:
   - Use faster network
   - Enable service worker caching
   - Preload critical modules

**Advanced: Preload modules:**

```javascript
// In App.jsx
const preloadModule = (module) => {
  import(`./components/modules/${module}`)
}

// Preload on hover
<button onMouseEnter={() => preloadModule('DataModule')}>
  Data
</button>
```

### High Memory Usage

**Symptom:** Browser tab uses lots of RAM

**Common Causes:**

1. Large uploaded datasets
2. Memory leaks in components
3. Too many event listeners

**Solutions:**

1. **Clear uploaded data:**
   ```javascript
   // In DataModule
   clearData()
   ```

2. **Check for leaks:**
   - Use Chrome DevTools > Memory > Take Heap Snapshot
   - Look for detached DOM nodes
   - Ensure cleanup in useEffect:

   ```javascript
   useEffect(() => {
     // Setup
     const subscription = subscribe()
     
     // Cleanup
     return () => {
       subscription.unsubscribe()
     }
   }, [])
   ```

3. **Monitor agent listeners:**
   ```javascript
   import { eventBus } from '@utils/eventBus'
   
   // Check listener count
   eventBus.getListenerCount('event:name')
   ```

---

## Browser-Specific Issues

### Safari Issues

**Issue:** Features not working in Safari

**Solutions:**

1. Update Safari to latest version
2. Enable JavaScript: Safari > Preferences > Security
3. Clear cache: Safari > Clear History
4. Check for Safari-specific CSS issues

### Firefox Issues

**Issue:** Layout problems in Firefox

**Solutions:**

1. Check browser console for errors
2. Disable add-ons temporarily
3. Verify flexbox/grid compatibility
4. Test in Firefox Developer Edition

### Mobile Browser Issues

**Issue:** Responsive layout problems

**Solutions:**

1. Test in actual devices (not just DevTools)
2. Check viewport meta tag in index.html:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```
3. Verify touch events work
4. Test with mobile Safari and Chrome

---

## Agent System Issues

### Events Not Firing

**Symptom:** Agent doesn't receive events

**Debug:**

```javascript
import { eventBus, EVENTS } from '@utils/eventBus'

// Enable debug mode
eventBus.setDebug(true)

// Manually test event
eventBus.emit(EVENTS.MODULE_CHANGED, { module: 'test' })

// Check listener count
console.log('Listeners:', eventBus.getListenerCount(EVENTS.MODULE_CHANGED))
```

**Common Fixes:**

1. Agent not registered:
   ```javascript
   orchestrator.registerAgent(myAgent)
   ```

2. Event listener not set up:
   ```javascript
   this.on(EVENTS.MODULE_CHANGED, this.handleModuleChange)
   ```

3. Agent not initialized:
   ```javascript
   await myAgent.init()
   ```

### Agent Initialization Fails

**Error in console:**
```
Failed to initialize agent system
```

**Solutions:**

1. Check agent constructors for errors
2. Verify all agents export properly:
   ```javascript
   export const myAgent = new MyAgent()
   export default myAgent
   ```

3. Check `src/agents/index.js` for registration:
   ```javascript
   export async function initializeAgentSystem() {
     await orchestrator.init()
     orchestrator.registerAgent(dataIntegrationAgent)
     // ...
   }
   ```

---

## Development Environment

### Hot Module Replacement (HMR) Not Working

**Symptom:** Changes don't appear without manual refresh

**Solutions:**

```bash
# 1. Restart dev server
npm run dev

# 2. Clear Vite cache
rm -rf node_modules/.vite

# 3. Check vite.config.js has HMR enabled (should be default)

# 4. Check file is being watched
# Ensure file is not in .gitignore or outside src/
```

### Linter False Positives

**Symptom:** ESLint reports errors that seem incorrect

**Solutions:**

```bash
# Update ESLint config in .eslintrc.json
{
  "rules": {
    "rule-name": "off"  // Disable specific rule
  }
}

# Ignore specific line
// eslint-disable-next-line rule-name

# Fix auto-fixable issues
npm run lint -- --fix
```

---

## Getting Additional Help

### Logs to Include

When reporting issues, include:

```bash
# System info
node --version
npm --version

# Browser console errors (F12)
# Network tab failures
# Screenshots of errors

# Build output
npm run build 2>&1 | tee build.log

# Lint output
npm run lint > lint.log
```

### Useful Commands

```bash
# Full diagnostic
npm run lint
npm run build
npm run preview

# Check dependencies
npm outdated
npm audit

# Clean everything
rm -rf node_modules package-lock.json dist .vite
npm install
```

---

## Preventive Measures

### Best Practices

1. ✅ Always use logger instead of console
2. ✅ Add PropTypes to components
3. ✅ Clean up in useEffect
4. ✅ Validate data before use
5. ✅ Handle errors gracefully
6. ✅ Test in multiple browsers
7. ✅ Monitor bundle size
8. ✅ Review build warnings
9. ✅ Keep dependencies updated
10. ✅ Run linter before commit

### Regular Maintenance

```bash
# Weekly
npm outdated           # Check for updates
npm audit              # Security check
npm run lint           # Code quality

# Monthly
npm update             # Update dependencies
npm run build          # Verify build works
```

---

**Still having issues?** Create a [GitHub Issue](https://github.com/Darkness308/Management-Dashboard-Akusti-scan_RT60/issues) with:
- Detailed error messages
- Steps to reproduce
- Environment details (OS, browser, Node version)
- Screenshots or screen recordings

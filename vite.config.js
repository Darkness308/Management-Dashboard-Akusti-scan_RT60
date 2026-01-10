import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@data': path.resolve(__dirname, './src/data'),
      '@styles': path.resolve(__dirname, './src/styles')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }

          // Chart.js and related
          if (id.includes('node_modules/chart.js') || id.includes('node_modules/react-chartjs-2')) {
            return 'chart-vendor'
          }

          // XLSX library for Excel handling
          if (id.includes('node_modules/xlsx')) {
            return 'xlsx-vendor'
          }

          // State management (Zustand)
          if (id.includes('node_modules/zustand')) {
            return 'zustand-vendor'
          }

          // Icons library (Lucide React)
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor'
          }

          // PDF/Word export libraries
          if (id.includes('node_modules/jspdf') || id.includes('node_modules/docx') || id.includes('node_modules/html2canvas')) {
            return 'export-vendor'
          }

          // Module-specific chunks (only loaded when module is accessed)
          if (id.includes('src/components/modules/InnovationModule')) {
            return 'innovation-module'
          }
          if (id.includes('src/components/modules/MarketModule')) {
            return 'market-module'
          }
          if (id.includes('src/components/modules/BusinessModule')) {
            return 'business-module'
          }
          if (id.includes('src/components/modules/KISystemModule')) {
            return 'ki-system-module'
          }
          if (id.includes('src/components/modules/TechnikModule')) {
            return 'technik-module'
          }
          if (id.includes('src/components/modules/VertriebModule')) {
            return 'vertrieb-module'
          }
          if (id.includes('src/components/modules/DataModule')) {
            return 'data-module'
          }
          if (id.includes('src/components/modules/AnalyticsModule')) {
            return 'analytics-module'
          }

          // Agent system
          if (id.includes('src/agents')) {
            return 'agent-system'
          }

          // Data models
          if (id.includes('src/data')) {
            return 'data-models'
          }

          // Shared components (charts, layout)
          if (id.includes('src/components/charts') || id.includes('src/components/layout')) {
            return 'shared-components'
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Enable minification and tree-shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // Remove console.logs only in production
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.debug'] : []
      },
      format: {
        comments: false
      }
    }
  }
}))

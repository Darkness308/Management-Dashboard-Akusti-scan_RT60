import { useState } from 'react'
import usePWA from '@/hooks/usePWA'

/**
 * PWA Install Prompt Component
 * Shows installation banner when app is installable
 */
export default function PWAInstallPrompt() {
  const { installPrompt, isInstalled, install } = usePWA()
  const [dismissed, setDismissed] = useState(false)

  // Don't show if already installed or dismissed
  if (isInstalled || dismissed || !installPrompt) {
    return null
  }

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      setDismissed(true)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    // Store in localStorage to persist dismissal
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-lg shadow-2xl p-4 z-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-3xl">
          📱
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">
            App installieren
          </h3>
          <p className="text-sm opacity-90 mb-3">
            Installiere das Dashboard als App für schnellen Zugriff und Offline-Funktionalität.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-primary-blue px-4 py-2 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-all"
            >
              Installieren
            </button>
            <button
              onClick={handleDismiss}
              className="bg-white bg-opacity-20 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-opacity-30 transition-all"
            >
              Später
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
          aria-label="Schließen"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import usePWA from '@/hooks/usePWA'
import { RefreshCw } from 'lucide-react'

/**
 * PWA Status Component
 * Shows online/offline status and service worker update notifications
 */
export default function PWAStatus() {
  const { isOnline, updateAvailable, update } = usePWA()
  const [showOffline, setShowOffline] = useState(false)
  const [showUpdate, setShowUpdate] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setShowOffline(true)
    } else {
      // Auto-hide after 3 seconds when connection restored
      const timer = setTimeout(() => setShowOffline(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline])

  useEffect(() => {
    setShowUpdate(updateAvailable)
  }, [updateAvailable])

  const handleUpdate = async () => {
    await update()
    setShowUpdate(false)
  }

  const handleDismissUpdate = () => {
    setShowUpdate(false)
  }

  return (
    <>
      {/* Offline Status Banner */}
      {showOffline && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
            isOnline ? 'bg-green-500' : 'bg-orange-500'
          } text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3`}
        >
          <span className="text-xl">
            {isOnline ? '🌐' : '📡'}
          </span>
          <span className="font-semibold">
            {isOnline ? 'Verbindung wiederhergestellt' : 'Offline-Modus aktiv'}
          </span>
          {isOnline && (
            <button
              onClick={() => setShowOffline(false)}
              className="ml-2 hover:text-gray-200"
              aria-label="Schließen"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Update Available Banner */}
      {showUpdate && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg max-w-md">
          <div className="flex items-start gap-3">
            <RefreshCw size={24} className="mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold mb-1">Update verfügbar</h4>
              <p className="text-sm opacity-90 mb-3">
                Eine neue Version der App ist verfügbar. Aktualisiere jetzt für die neuesten Features.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-all"
                >
                  Jetzt aktualisieren
                </button>
                <button
                  onClick={handleDismissUpdate}
                  className="bg-white bg-opacity-20 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-opacity-30 transition-all"
                >
                  Später
                </button>
              </div>
            </div>
            <button
              onClick={handleDismissUpdate}
              className="flex-shrink-0 hover:text-gray-200"
              aria-label="Schließen"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}

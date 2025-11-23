import { useState, useEffect } from 'react'

/**
 * Custom Hook for PWA functionality
 * Provides online/offline status, installation prompt, and service worker updates
 */
export function usePWA() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Online/Offline Status
    const handleOnline = () => {
      console.log('🌐 Connection restored')
      setIsOnline(true)
    }

    const handleOffline = () => {
      console.log('📡 Connection lost - Working offline')
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Install Prompt
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      console.log('💾 Install prompt ready')
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // App Installed
    const handleAppInstalled = () => {
      console.log('✅ PWA installed successfully')
      setIsInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    // Service Worker Update Detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 Update available')
              setUpdateAvailable(true)
            }
          })
        })
      })

      // Listen for controller change (new service worker activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 New service worker activated')
        setUpdateAvailable(false)
      })
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  /**
   * Trigger PWA installation
   */
  const install = async () => {
    if (!installPrompt) {
      console.warn('Install prompt not available')
      return false
    }

    try {
      // Show the install prompt
      installPrompt.prompt()

      // Wait for the user's response
      const { outcome } = await installPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt')
        setInstallPrompt(null)
        return true
      } else {
        console.log('❌ User dismissed the install prompt')
        return false
      }
    } catch (error) {
      console.error('Install error:', error)
      return false
    }
  }

  /**
   * Update the service worker
   */
  const update = async () => {
    if (!registration) {
      console.warn('Service Worker registration not available')
      return false
    }

    try {
      const newRegistration = await registration.update()

      if (newRegistration.waiting) {
        // Tell the waiting service worker to skip waiting
        newRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })

        // Reload the page to activate the new service worker
        window.location.reload()
        return true
      }

      return false
    } catch (error) {
      console.error('Update error:', error)
      return false
    }
  }

  /**
   * Check for service worker updates manually
   */
  const checkForUpdates = async () => {
    if (!registration) {
      console.warn('Service Worker registration not available')
      return
    }

    try {
      await registration.update()
      console.log('✅ Checked for updates')
    } catch (error) {
      console.error('Check for updates error:', error)
    }
  }

  /**
   * Cache specific URLs
   */
  const cacheUrls = async (urls) => {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported')
      return false
    }

    try {
      const controller = navigator.serviceWorker.controller
      if (controller) {
        controller.postMessage({
          type: 'CACHE_URLS',
          urls
        })
        console.log('✅ URLs queued for caching:', urls)
        return true
      }
      return false
    } catch (error) {
      console.error('Cache URLs error:', error)
      return false
    }
  }

  return {
    isOnline,
    isInstalled,
    installPrompt: !!installPrompt,
    updateAvailable,
    install,
    update,
    checkForUpdates,
    cacheUrls
  }
}

/**
 * Hook to detect PWA display mode
 */
export function useDisplayMode() {
  const [displayMode, setDisplayMode] = useState(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return 'standalone'
    }
    if (window.matchMedia('(display-mode: fullscreen)').matches) {
      return 'fullscreen'
    }
    if (window.matchMedia('(display-mode: minimal-ui)').matches) {
      return 'minimal-ui'
    }
    return 'browser'
  })

  useEffect(() => {
    const mediaQueries = [
      { query: '(display-mode: standalone)', mode: 'standalone' },
      { query: '(display-mode: fullscreen)', mode: 'fullscreen' },
      { query: '(display-mode: minimal-ui)', mode: 'minimal-ui' }
    ]

    const listeners = mediaQueries.map(({ query, mode }) => {
      const mq = window.matchMedia(query)
      const listener = (e) => {
        if (e.matches) {
          setDisplayMode(mode)
        }
      }
      mq.addEventListener('change', listener)
      return { mq, listener }
    })

    return () => {
      listeners.forEach(({ mq, listener }) => {
        mq.removeEventListener('change', listener)
      })
    }
  }, [])

  return {
    displayMode,
    isStandalone: displayMode === 'standalone' || displayMode === 'fullscreen',
    isPWA: displayMode !== 'browser'
  }
}

export default usePWA

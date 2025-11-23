/**
 * A11y Announcer Component
 * Live region for screen reader announcements
 * Automatically announces route changes and important updates
 */
import { useEffect, useState } from 'react'

export default function A11yAnnouncer() {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    // Listen for custom announcement events
    const handleAnnouncement = (event) => {
      setAnnouncement(event.detail.message)
      // Clear after announcement
      setTimeout(() => setAnnouncement(''), 1000)
    }

    window.addEventListener('a11y-announce', handleAnnouncement)

    return () => {
      window.removeEventListener('a11y-announce', handleAnnouncement)
    }
  }, [])

  return (
    <>
      {/* Polite announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Assertive announcements (for errors) */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </>
  )
}

/**
 * Trigger announcement
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announce = (message, priority = 'polite') => {
  window.dispatchEvent(
    new CustomEvent('a11y-announce', {
      detail: { message, priority }
    })
  )
}

/**
 * Accessibility Utilities
 * Helper functions for improving accessibility
 */

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Set focus to element
 * @param {string} selector - CSS selector
 * @param {number} delay - Delay in ms before focusing
 */
export const setFocusTo = (selector, delay = 0) => {
  setTimeout(() => {
    const element = document.querySelector(selector)
    if (element) {
      element.focus()
    }
  }, delay)
}

/**
 * Trap focus within container
 * @param {HTMLElement} container - Container element
 * @returns {Function} Cleanup function
 */
export const trapFocus = (container) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  container.addEventListener('keydown', handleTabKey)

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey)
  }
}

/**
 * Get accessible label for element
 * @param {HTMLElement} element - Element to get label for
 * @returns {string} Accessible label
 */
export const getAccessibleLabel = (element) => {
  return (
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.textContent ||
    element.getAttribute('title') ||
    ''
  )
}

/**
 * Check if element is visible
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if visible
 */
export const isElementVisible = (element) => {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  )
}

/**
 * Get contrast ratio between two colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number} Contrast ratio
 */
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff

    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)

  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Check if contrast ratio meets WCAG standards
 * @param {number} ratio - Contrast ratio
 * @param {string} level - 'AA' or 'AAA'
 * @param {boolean} isLargeText - Whether text is large (>= 18pt or >= 14pt bold)
 * @returns {boolean} True if meets standard
 */
export const meetsWCAGContrast = (ratio, level = 'AA', isLargeText = false) => {
  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7
  }
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

/**
 * Add keyboard navigation support
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Options
 * @returns {Function} Cleanup function
 */
export const addKeyboardNavigation = (container, options = {}) => {
  const {
    vertical = false,
    horizontal = true,
    loop = true,
    selector = '[role="tab"], [role="menuitem"], button'
  } = options

  const handleKeyDown = (e) => {
    const items = Array.from(container.querySelectorAll(selector))
    const currentIndex = items.indexOf(document.activeElement)

    if (currentIndex === -1) return

    let nextIndex = currentIndex

    if ((horizontal && e.key === 'ArrowRight') || (vertical && e.key === 'ArrowDown')) {
      e.preventDefault()
      nextIndex = currentIndex + 1
      if (nextIndex >= items.length) {
        nextIndex = loop ? 0 : items.length - 1
      }
    } else if ((horizontal && e.key === 'ArrowLeft') || (vertical && e.key === 'ArrowUp')) {
      e.preventDefault()
      nextIndex = currentIndex - 1
      if (nextIndex < 0) {
        nextIndex = loop ? items.length - 1 : 0
      }
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = items.length - 1
    }

    if (nextIndex !== currentIndex && items[nextIndex]) {
      items[nextIndex].focus()
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

export default {
  announceToScreenReader,
  setFocusTo,
  trapFocus,
  getAccessibleLabel,
  isElementVisible,
  getContrastRatio,
  meetsWCAGContrast,
  addKeyboardNavigation
}

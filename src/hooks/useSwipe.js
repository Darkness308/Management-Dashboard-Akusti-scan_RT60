import { useState, useEffect, useRef } from 'react'

/**
 * Custom Hook for Swipe Gestures
 * Detects swipe left/right/up/down on touch devices
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  minSwipeDistance = 50
} = {}) {
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const handleTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y

    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)

    if (isHorizontalSwipe) {
      if (Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0) {
          // Swipe left
          onSwipeLeft?.()
        } else {
          // Swipe right
          onSwipeRight?.()
        }
      }
    } else {
      if (Math.abs(distanceY) > minSwipeDistance) {
        if (distanceY > 0) {
          // Swipe up
          onSwipeUp?.()
        } else {
          // Swipe down
          onSwipeDown?.()
        }
      }
    }
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}

/**
 * Hook to detect if device supports touch
 */
export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      )
    }

    checkTouch()
  }, [])

  return isTouch
}

/**
 * Hook for long press gesture
 */
export function useLongPress(
  callback,
  { delay = 500, shouldPreventDefault = true } = {}
) {
  const [longPressTriggered, setLongPressTriggered] = useState(false)
  const timeout = useRef()
  const target = useRef()

  const start = (event) => {
    if (shouldPreventDefault && event.target) {
      event.target.addEventListener('touchend', preventDefault, { passive: false })
      target.current = event.target
    }

    timeout.current = setTimeout(() => {
      callback()
      setLongPressTriggered(true)
    }, delay)
  }

  const clear = (event, shouldTriggerClick = true) => {
    timeout.current && clearTimeout(timeout.current)
    shouldTriggerClick && !longPressTriggered && click()

    setLongPressTriggered(false)

    if (shouldPreventDefault && target.current) {
      target.current.removeEventListener('touchend', preventDefault)
    }
  }

  const preventDefault = (event) => {
    if (!('touches' in event)) return

    if (event.touches.length < 2 && event.preventDefault) {
      event.preventDefault()
    }
  }

  const click = () => {
    // Optional: handle click event
  }

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onMouseLeave: (e) => clear(e, false),
    onTouchEnd: (e) => clear(e)
  }
}

export default useSwipe

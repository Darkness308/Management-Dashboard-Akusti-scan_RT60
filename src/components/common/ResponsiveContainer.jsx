import { memo } from 'react'
import useResponsive from '@/hooks/useResponsive'

/**
 * Responsive Container Component
 * Adapts layout based on device type
 */
function ResponsiveContainer({ children, className = '' }) {
  const { isMobile, isTablet, isDesktop } = useResponsive()

  // Base container classes
  const baseClasses = 'w-full mx-auto'

  // Responsive padding
  const paddingClasses = isMobile
    ? 'px-4 py-4'
    : isTablet
      ? 'px-6 py-5'
      : 'px-6 py-6'

  // Max width based on device
  const maxWidthClasses = isDesktop ? 'max-w-7xl' : 'max-w-full'

  return (
    <div className={`${baseClasses} ${paddingClasses} ${maxWidthClasses} ${className}`}>
      {children}
    </div>
  )
}

export default memo(ResponsiveContainer)

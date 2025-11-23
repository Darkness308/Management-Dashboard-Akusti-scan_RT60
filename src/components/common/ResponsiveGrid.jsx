import { memo } from 'react'
import useResponsive from '@/hooks/useResponsive'

/**
 * Responsive Grid Component
 * Automatically adjusts columns based on screen size
 */
function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  className = ''
}) {
  const { isMobile, isTablet } = useResponsive()

  // Determine number of columns
  const numCols = isMobile
    ? cols.mobile
    : isTablet
      ? cols.tablet
      : cols.desktop

  // Grid column classes
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }[numCols] || 'grid-cols-1'

  // Gap classes
  const gapClass = `gap-${gap}`

  return (
    <div className={`grid ${gridColsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  )
}

export default memo(ResponsiveGrid)

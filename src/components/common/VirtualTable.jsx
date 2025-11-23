import { useState, useEffect, useRef, memo } from 'react'

/**
 * Virtual Table Component with Virtual Scrolling
 * Only renders visible rows for optimal performance with large datasets
 */
function VirtualTable({
  data = [],
  columns = [],
  rowHeight = 50,
  containerHeight = 600,
  className = ''
}) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef(null)

  // Calculate visible range
  const totalHeight = data.length * rowHeight
  const startIndex = Math.floor(scrollTop / rowHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / rowHeight) + 1,
    data.length
  )

  // Visible data slice
  const visibleData = data.slice(startIndex, endIndex)

  // Handle scroll
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop)
  }

  // Offset for visible rows
  const offsetY = startIndex * rowHeight

  return (
    <div className={`relative ${className}`}>
      {/* Table container with fixed header */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-blue to-primary-purple text-white sticky top-0 z-10">
          <div className="flex">
            {columns.map((column, index) => (
              <div
                key={index}
                className="px-4 py-3 font-semibold text-sm flex-1 min-w-[120px]"
                style={{
                  width: column.width || 'auto',
                  minWidth: column.minWidth || '120px'
                }}
              >
                {column.header}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable body with virtual scrolling */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="overflow-y-auto bg-white"
          style={{ height: containerHeight }}
        >
          {/* Spacer to maintain total height */}
          <div style={{ height: totalHeight, position: 'relative' }}>
            {/* Visible rows */}
            <div
              style={{
                transform: `translateY(${offsetY}px)`,
                position: 'absolute',
                width: '100%'
              }}
            >
              {visibleData.map((row, rowIndex) => {
                const actualIndex = startIndex + rowIndex

                return (
                  <div
                    key={actualIndex}
                    className={`flex border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      actualIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                    style={{ height: rowHeight }}
                  >
                    {columns.map((column, colIndex) => {
                      const cellValue = column.accessor
                        ? column.accessor(row, actualIndex)
                        : row[column.key]

                      const cellContent = column.render
                        ? column.render(cellValue, row, actualIndex)
                        : cellValue

                      return (
                        <div
                          key={colIndex}
                          className="px-4 py-3 text-sm text-gray-700 flex items-center flex-1 min-w-[120px]"
                          style={{
                            width: column.width || 'auto',
                            minWidth: column.minWidth || '120px'
                          }}
                        >
                          {cellContent}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 border-t border-gray-200">
          Zeige {startIndex + 1} bis {Math.min(endIndex, data.length)} von {data.length} Zeilen
        </div>
      </div>
    </div>
  )
}

export default memo(VirtualTable)

"use client"

import type React from "react"

interface ConnectionLineProps {
  startPoint: { x: number; y: number }
  endPoint: { x: number; y: number }
  isActive?: boolean
  connectionId?: string
  onDelete?: (id: string) => void
}

export function ConnectionLine({
  startPoint,
  endPoint,
  isActive = false,
  connectionId,
  onDelete,
}: ConnectionLineProps) {
  // Calculate control points for a curved line
  const dx = Math.abs(endPoint.x - startPoint.x)
  const offset = Math.min(dx * 0.5, 150)

  // Calculate midpoint for the delete button
  const midX = (startPoint.x + endPoint.x) / 2
  const midY = (startPoint.y + endPoint.y) / 2 - 15 // Offset slightly above the line

  // Create SVG path
  const path = `
    M ${startPoint.x},${startPoint.y}
    C ${startPoint.x + offset},${startPoint.y}
      ${endPoint.x - offset},${endPoint.y}
      ${endPoint.x},${endPoint.y}
  `

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (connectionId && onDelete) {
      onDelete(connectionId)
    }
  }

  return (
    <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
      <path
        d={path}
        fill="none"
        stroke={isActive ? "#3b82f6" : "#64748b"}
        strokeWidth={2}
        strokeDasharray={isActive ? "5,5" : "none"}
        className={connectionId ? "hover:stroke-red-500 hover:stroke-[3px] cursor-pointer" : "pointer-events-none"}
        onClick={connectionId && onDelete ? handleDelete : undefined}
      />

      {/* Arrow at the end of the line */}
      <circle cx={endPoint.x} cy={endPoint.y} r={4} fill={isActive ? "#3b82f6" : "#64748b"} />

      {/* Delete button that appears on hover */}
      {connectionId && onDelete && (
        <g
          className="opacity-0 hover:opacity-100 cursor-pointer"
          onClick={handleDelete}
          style={{ transition: "opacity 0.2s" }}
        >
          <circle cx={midX} cy={midY} r={10} fill="white" stroke="#ef4444" strokeWidth={1.5} />
          <line x1={midX - 4} y1={midY - 4} x2={midX + 4} y2={midY + 4} stroke="#ef4444" strokeWidth={1.5} />
          <line x1={midX - 4} y1={midY + 4} x2={midX + 4} y2={midY - 4} stroke="#ef4444" strokeWidth={1.5} />
        </g>
      )}
    </svg>
  )
}

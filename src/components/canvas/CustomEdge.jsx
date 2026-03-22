/**
 * CustomEdge colors wires based on signal state:
 *   GREEN = HIGH (1) — signal is active
 *   GRAY  = LOW  (0) — signal is inactive
 */

import { getBezierPath, EdgeLabelRenderer } from 'reactflow'
import { WIRE_COLORS } from '../../utils/constants'

export default function CustomEdge({
  id,
  sourceX,    // X coordinate of source handle — provided by React Flow
  sourceY,    // Y coordinate of source handle 
  targetX,    // X coordinate of target handle 
  targetY,    // Y coordinate of target handle 
  sourcePosition, // which side source handle is on 
  targetPosition, // which side target handle is on 
  data,           // our custom data — contains signal value
  selected,       // whether this edge is selected 
}) {

  //        Compute Bezier Path 
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  //        Signal State 
  const signal = data?.signal ?? 0
  const isHigh = signal === 1

  // Wire Color 
  const wireColor = isHigh ? WIRE_COLORS.HIGH : WIRE_COLORS.LOW

  // Wire Thickness 
  const strokeWidth = selected ? 3 : 2

  return (
    <>
      {/* Wire Path */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={strokeWidth}
        stroke={wireColor}
        fill="none"
        style={{ transition: 'stroke 0.15s ease' }}
      />

      {/* Signal Label  */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${(sourceX + targetX) / 2}px, ${(sourceY + targetY) / 2}px)`,
            pointerEvents: 'none', // label should not interfere with clicks
          }}
        >
          <span
            className={`
              text-xs font-mono font-bold px-1 rounded
              ${isHigh
                ? 'text-green-400 bg-green-900/50'
                : 'text-slate-500 bg-slate-900/50'
              }
            `}
          >
            {isHigh ? '1' : '0'}
          </span>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
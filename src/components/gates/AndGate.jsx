/**
 * SVG visual representation of the AND logic gate.
 * Standard IEEE symbol.
 */

import { Handle, Position } from 'reactflow'
import { WIRE_COLORS } from '../../utils/constants'

export default function AndGate({ data, selected }) {
  const { inputs = [0, 0], output = 0 } = data

  return (
    <div className={`relative ${selected ? 'opacity-100' : 'opacity-90'}`}>
      <svg width="80" height="60" viewBox="0 0 80 60">
        {/* Gate body */}
        <path
          d="M10,10 L40,10 Q70,10 70,30 Q70,50 40,50 L10,50 Z"
          fill={selected ? '#1e3a5f' : '#0f172a'}
          stroke={selected ? '#60a5fa' : '#3b82f6'}
          strokeWidth="2"
        />
        {/* Gate label */}
        <text
          x="35"
          y="34"
          textAnchor="middle"
          fill="#93c5fd"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="bold"
        >
          AND
        </text>
      </svg>

      {/* Input Handle — Top */}
      <Handle
        type="target"
        position={Position.Left}
        id="input-0"
        style={{
          top: '33%',
          background: inputs[0] === 1
            ? WIRE_COLORS.HIGH
            : WIRE_COLORS.LOW,
          width: 10,
          height: 10,
          border: '2px solid #1e293b'
        }}
      />

      {/* Input Handle — Bottom */}
      <Handle
        type="target"
        position={Position.Left}
        id="input-1"
        style={{
          top: '67%',
          background: inputs[1] === 1
            ? WIRE_COLORS.HIGH
            : WIRE_COLORS.LOW,
          width: 10,
          height: 10,
          border: '2px solid #1e293b'
        }}
      />

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          background: output === 1
            ? WIRE_COLORS.HIGH
            : WIRE_COLORS.LOW,
          width: 10,
          height: 10,
          border: '2px solid #1e293b'
        }}
      />
    </div>
  )
}
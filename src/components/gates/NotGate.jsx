
import { Handle, Position } from 'reactflow'
import { WIRE_COLORS } from '../../utils/constants'

export default function NotGate({ data, selected }) {
  const { inputs = [0], output = 0 } = data

  return (
    <div className={`relative ${selected ? 'opacity-100' : 'opacity-90'}`}>
      <svg width="80" height="60" viewBox="0 0 80 60">
        {/* Triangle body */}
        <path
          d="M10,10 L10,50 L60,30 Z"
          fill={selected ? '#1e3a5f' : '#0f172a'}
          stroke={selected ? '#60a5fa' : '#3b82f6'}
          strokeWidth="2"
        />
        {/* Bubble at output */}
        <circle
          cx="65"
          cy="30"
          r="5"
          fill={selected ? '#1e3a5f' : '#0f172a'}
          stroke={selected ? '#60a5fa' : '#3b82f6'}
          strokeWidth="2"
        />
        {/* Gate label */}
        <text
          x="28"
          y="34"
          textAnchor="middle"
          fill="#93c5fd"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="bold"
        >
          NOT
        </text>
      </svg>

      {/* Single input handle — centered */}
      <Handle
        type="target"
        position={Position.Left}
        id="input-0"
        style={{
          top: '50%',
          background: inputs[0] === 1 ? WIRE_COLORS.HIGH : WIRE_COLORS.LOW,
          width: 10, height: 10, border: '2px solid #1e293b'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          background: output === 1 ? WIRE_COLORS.HIGH : WIRE_COLORS.LOW,
          width: 10, height: 10, border: '2px solid #1e293b'
        }}
      />
    </div>
  )
}
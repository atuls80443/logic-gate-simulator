
import { Handle, Position } from 'reactflow'
import { WIRE_COLORS } from '../../utils/constants'

export default function NorGate({ data, selected }) {
  const { inputs = [0, 0], output = 0 } = data

  return (
    <div className={`relative ${selected ? 'opacity-100' : 'opacity-90'}`}>
      <svg width="80" height="60" viewBox="0 0 80 60">
        {/* Gate body — same as OR */}
        <path
          d="M10,10 Q25,30 10,50 Q40,50 60,30 Q40,10 10,10 Z"
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
        <text
          x="33"
          y="34"
          textAnchor="middle"
          fill="#93c5fd"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="bold"
        >
          NOR
        </text>
      </svg>

      <Handle
        type="target"
        position={Position.Left}
        id="input-0"
        style={{
          top: '33%',
          background: inputs[0] === 1 ? WIRE_COLORS.HIGH : WIRE_COLORS.LOW,
          width: 10, height: 10, border: '2px solid #1e293b'
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="input-1"
        style={{
          top: '67%',
          background: inputs[1] === 1 ? WIRE_COLORS.HIGH : WIRE_COLORS.LOW,
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
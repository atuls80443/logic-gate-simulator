
import { Handle, Position } from 'reactflow'
import { WIRE_COLORS } from '../../utils/constants'

export default function NandGate({ data, selected }) {
  const { inputs = [0, 0], output = 0 } = data

  return (
    <div className={`relative ${selected ? 'opacity-100' : 'opacity-90'}`}>
      <svg width="80" height="60" viewBox="0 0 80 60">
        {/* Gate body — same as AND */}
        <path
          d="M10,10 L40,10 Q65,10 65,30 Q65,50 40,50 L10,50 Z"
          fill={selected ? '#1e3a5f' : '#0f172a'}
          stroke={selected ? '#60a5fa' : '#3b82f6'}
          strokeWidth="2"
        />
        {/* Bubble at output */}
        <circle
          cx="70"
          cy="30"
          r="5"
          fill={selected ? '#1e3a5f' : '#0f172a'}
          stroke={selected ? '#60a5fa' : '#3b82f6'}
          strokeWidth="2"
        />
        <text
          x="35"
          y="34"
          textAnchor="middle"
          fill="#93c5fd"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="bold"
        >
          NAND
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
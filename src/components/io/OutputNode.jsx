
// Displays the final computed output of the circuit.

import { Handle, Position } from 'reactflow'
import { WIRE_COLORS }      from '../../utils/constants'

export default function OutputNode({ data, selected }) {
  //        Current Signal Value 
  const isHigh = data.inputs[0] === 1

  return (
    <div className="relative flex flex-col items-center">

      {/* Target Handle Only */}
      <Handle
        type="target"
        position={Position.Left}
        id="input-0"
        style={{
          background: isHigh ? WIRE_COLORS.HIGH : WIRE_COLORS.LOW,
          width: 10,
          height: 10,
          border: '2px solid #1e293b'
        }}
      />

      {/* LED Indicator */}       
      <div
        className={`
          w-16 h-16 rounded-full border-2 flex items-center justify-center
          font-mono font-bold text-lg transition-all duration-150
          ${isHigh
            ? 'bg-green-500 border-green-300 text-white shadow-green-500/50 shadow-lg'
            : 'bg-slate-800 border-slate-600 text-slate-500'
          }
          ${selected ? 'ring-2 ring-blue-400' : ''}
        `}
      >
        {isHigh ? '1' : '0'}
      </div>

      {/* Node Label  */}
      <div className="text-center text-xs text-slate-400 mt-1 font-mono">
        {data.label || 'OUT'}
      </div>
    </div>
  )
}

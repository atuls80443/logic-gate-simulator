/**
 * User clicks to toggle between 0 and 1.
 * Triggers full BFS propagation through the circuit.
 */

import { Handle, Position } from 'reactflow'
import { useCircuitStore }  from '../../store/circuitStore'
import { WIRE_COLORS }      from '../../utils/constants'

export default function InputNode({ id, data, selected }) {
  //        Store Connection 
  const toggleInputAction = useCircuitStore(
    state => state.toggleInputAction
  )

  //        Current Signal Value 
  const isHigh = data.output === 1

  //        Click Handler 
  const handleClick = () => {
    toggleInputAction(id)
  }

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={handleClick}
        className={`
          w-16 h-16 rounded-lg border-2 font-mono font-bold text-lg
          transition-all duration-150 cursor-pointer select-none
          ${isHigh
            ? 'bg-green-500 border-green-300 text-white shadow-green-500/50 shadow-lg'
            : 'bg-slate-700 border-slate-500 text-slate-300'
          }
          ${selected ? 'ring-2 ring-blue-400' : ''}
        `}
      >
        {isHigh ? '1' : '0'}
      </button>

      {/* Node Label  */}
      <div className="text-center text-xs text-slate-400 mt-1 font-mono">
        IN
      </div>

      {/* Source Handle Only  */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          background: isHigh ? WIRE_COLORS.HIGH : WIRE_COLORS.LOW,
          width: 10,
          height: 10,
          border: '2px solid #1e293b'
        }}
      />
    </div>
  )
}

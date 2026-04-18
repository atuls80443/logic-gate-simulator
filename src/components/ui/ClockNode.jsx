import { Handle, Position } from 'reactflow'
import { useCallback } from 'react'
import { useCircuitStore } from '../../store/circuitStore'
import { WIRE_COLORS } from '../../utils/constants'

export default function ClockNode({ id, data, selected }) {
  const tickClockAction = useCircuitStore(state => state.tickClockAction)

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    tickClockAction(id)
  }, [id, tickClockAction])

  return (
    <div
      onClick={handleClick}
      className={`relative flex flex-col items-center justify-center w-14 h-14 rounded cursor-pointer border-2 ${selected ? 'border-yellow-400' : 'border-gray-600'}`}
      style={{ background: data.output === 1 ? '#f59e0b' : '#1f2937' }}
    >
      <span className="text-[10px] font-bold text-white select-none">CLK</span>
      <span className="text-[9px] text-gray-300 font-mono">{data.output}</span>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          background: data.output === 1 ? WIRE_COLORS.HIGH : WIRE_COLORS.LOW,
          width: 10,
          height: 10,
          border: '2px solid #1e293b'
        }}
      />
    </div>
  )
}
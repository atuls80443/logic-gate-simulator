// imports must ALWAYS be at the very top — before anything else
import { useCircuitStore }   from '../../store/circuitStore'
import { GATE_CATEGORIES }   from '../../utils/constants'
import { CIRCUIT_TEMPLATES } from '../../utils/circuitTemplates'

// ─── constants defined here are fine — they are NOT hooks ────────────────────
const GATE_COLORS = {
  AND:    'border-blue-500   bg-blue-900/30   text-blue-300   hover:bg-blue-800/50',
  OR:     'border-purple-500 bg-purple-900/30 text-purple-300 hover:bg-purple-800/50',
  NOT:    'border-yellow-500 bg-yellow-900/30 text-yellow-300 hover:bg-yellow-800/50',
  NAND:   'border-red-500    bg-red-900/30    text-red-300    hover:bg-red-800/50',
  NOR:    'border-orange-500 bg-orange-900/30 text-orange-300 hover:bg-orange-800/50',
  XOR:    'border-green-500  bg-green-900/30  text-green-300  hover:bg-green-800/50',
  XNOR:   'border-teal-500   bg-teal-900/30   text-teal-300   hover:bg-teal-800/50',
  INPUT:  'border-green-400  bg-green-900/40  text-green-200  hover:bg-green-800/60',
  OUTPUT: 'border-blue-400   bg-blue-900/40   text-blue-200   hover:bg-blue-800/60',
}

const GATE_DESCRIPTIONS = {
  AND:    'Output HIGH only when ALL inputs HIGH',
  OR:     'Output HIGH when ANY input is HIGH',
  NOT:    'Inverts single input',
  NAND:   'Opposite of AND',
  NOR:    'Opposite of OR',
  XOR:    'HIGH when inputs are DIFFERENT',
  XNOR:   'HIGH when inputs are SAME',
  INPUT:  'User controlled signal source',
  OUTPUT: 'Displays circuit result',
}

// ─── GateButton — no hooks here, only drag behavior ──────────────────────────
function GateButton({ gateType }) {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/gateType', gateType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      title={GATE_DESCRIPTIONS[gateType]}
      className={`
        border rounded-lg p-2 cursor-grab active:cursor-grabbing
        transition-all duration-150 select-none
        ${GATE_COLORS[gateType]}
      `}
    >
      <div className="font-mono font-bold text-sm text-center">
        {gateType}
      </div>
      <div className="text-xs text-center mt-1 opacity-70">
        drag to canvas
      </div>
    </div>
  )
}

// ─── Toolbar Component ────────────────────────────────────────────────────────
export default function Toolbar() {

  // ── ALL useCircuitStore calls MUST be inside this function body ───────────
  // WHY: React hooks cannot be called outside a component function
  // The three lines below were incorrectly placed outside in your file
  const resetCircuitAction = useCircuitStore(state => state.resetCircuitAction)
  const clearCircuitAction = useCircuitStore(state => state.clearCircuitAction)
  const loadTemplateAction = useCircuitStore(state => state.loadTemplateAction)

  return (
    <div className="w-52 h-full bg-slate-900 border-r border-slate-700 flex flex-col overflow-y-auto">

      {/* Header */}
      <div className="p-3 border-b border-slate-700">
        <h2 className="text-slate-200 font-bold font-mono text-sm">
          Logic Gates
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          Drag gates onto canvas
        </p>
      </div>

      {/* Basic Gates */}
      <div className="p-3 border-b border-slate-700">
        <h3 className="text-slate-400 text-xs font-mono uppercase mb-2">
          Basic Gates
        </h3>
        <div className="flex flex-col gap-2">
          {GATE_CATEGORIES.BASIC.map(gateType => (
            <GateButton key={gateType} gateType={gateType} />
          ))}
        </div>
      </div>

      {/* Input / Output */}
      <div className="p-3 border-b border-slate-700">
        <h3 className="text-slate-400 text-xs font-mono uppercase mb-2">
          Input / Output
        </h3>
        <div className="flex flex-col gap-2">
          {GATE_CATEGORIES.IO.map(gateType => (
            <GateButton key={gateType} gateType={gateType} />
          ))}
        </div>
      </div>

      {/* Templates */}
      <div className="p-3 border-b border-slate-700">
        <h3 className="text-slate-400 text-xs font-mono uppercase mb-2">
          Templates
        </h3>
        <div className="flex flex-col gap-2">
          {CIRCUIT_TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => loadTemplateAction(template.create)}
              className="
                border rounded-lg p-2 text-left
                border-slate-500 bg-slate-800/50 text-slate-300
                hover:bg-slate-700/50 hover:border-slate-400
                font-mono text-sm transition-all duration-150
              "
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 mt-auto border-t border-slate-700">
        <h3 className="text-slate-400 text-xs font-mono uppercase mb-2">
          Controls
        </h3>
        <button
          onClick={resetCircuitAction}
          className="
            w-full py-2 px-3 rounded border border-yellow-600
            bg-yellow-900/30 text-yellow-300 hover:bg-yellow-800/50
            font-mono text-sm transition-all duration-150 mb-2
          "
        >
          Reset Inputs
        </button>
        <button
          onClick={clearCircuitAction}
          className="
            w-full py-2 px-3 rounded border border-red-600
            bg-red-900/30 text-red-300 hover:bg-red-800/50
            font-mono text-sm transition-all duration-150
          "
        >
          Clear Canvas
        </button>
      </div>

    </div>
  )
}

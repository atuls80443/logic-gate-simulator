import AndGate from './AndGate'
import OrGate from './OrGate'
import NotGate from './NotGate'
import NandGate from './NandGate'
import NorGate from './NorGate'
import XorGate from './XorGate'
import XnorGate from './XnorGate'

const GATE_COMPONENTS = {
  AND: AndGate,
  OR: OrGate,
  NOT: NotGate,
  NAND: NandGate,
  NOR: NorGate,
  XOR: XorGate,
  XNOR: XnorGate,
}

export default function GateNode({ data, selected }) {
  const GateComponent = GATE_COMPONENTS[data.gateType]

  if (!GateComponent) {
    console.warn(`Unknown gate type: ${data.gateType}`)
    return (
      <div className="px-2 py-1 bg-red-900/50 border border-red-500 text-red-300 text-xs rounded">
        {data.gateType}
      </div>
    )
  }

  return <GateComponent data={data} selected={selected} />
}

// GateNode.jsx - Dynamically renders the correct gate component based on passed data

import AndGate  from './AndGate'
import OrGate   from './OrGate'
import NotGate  from './NotGate'
import NandGate from './NandGate'
import NorGate  from './NorGate'
import XorGate  from './XorGate'
import XnorGate from './XnorGate'

//      Component Map 
const GATE_COMPONENTS = {
  AND:  AndGate,
  OR:   OrGate,
  NOT:  NotGate,
  NAND: NandGate,
  NOR:  NorGate,
  XOR:  XorGate,
  XNOR: XnorGate,
}

//      GateNode Component 
/**
 * @param {Object} data     - Passed by React Flow from the node data field
 * @param {boolean} selected - Passed by React Flow when node is selected
 */
export default function GateNode({ data, selected }) {
  //        Dispatcher 
  const GateComponent = GATE_COMPONENTS[data.gateType]

  //        Fallback instead or crashing on unknown type
  if (!GateComponent) {
    console.warn(`Unknown gate type: ${data.gateType}`)
    return null
  }

  //        Render the correct gate component with passed data and selection 
  return (
    <GateComponent
      data={data}
      selected={selected}
    />
  )
}

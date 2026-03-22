/**
 * WHY THIS FILE EXISTS:
 * React Flow requires ONE registered component per node type.
 * Instead of registering all 7 gates separately, GateNode acts
 * as a single dispatcher
 */

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
 * data contains:
 *   gateType: string  - which gate to render (AND, OR, NOT...)
 *   inputs:   array   - current input values [0,1] etc
 *   output:   number  - current output value 0 or 1
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

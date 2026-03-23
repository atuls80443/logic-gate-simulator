
//  This is the main interactive circuit building area.

import { useCallback, useRef }  from 'react'
import ReactFlow, {
  Background,       
  Controls,         
  MiniMap,          
  useReactFlow,     
} from 'reactflow'
import 'reactflow/dist/style.css'        

//      Custom Components 
import GateNode    from '../gates/GateNode'
import InputNode   from '../io/InputNode'
import OutputNode  from '../io/OutputNode'
import CustomEdge  from './CustomEdge'

//      Store and Constants 
import { useCircuitStore } from '../../store/circuitStore'
import { CANVAS } from '../../utils/constants'

// ─── Node and Edge Type Registration ─────────────────────────────────────────
// WHY defined OUTSIDE component:
// If defined inside, React creates new objects every render
// React Flow sees new objects = re-renders entire canvas = very slow
// Defined outside = same object reference always = no unnecessary re-renders
const nodeTypes = {
  gateNode:   GateNode,    
  inputNode:  InputNode,   
  outputNode: OutputNode,  
}

const edgeTypes = {
  customEdge: CustomEdge,  
}

//      CircuitCanvas Component 
export default function CircuitCanvas() {
  //    React Flow Instance - for coordinate conversions
  const { screenToFlowPosition } = useReactFlow()

  //    Store State and Actions 
  const nodes               = useCircuitStore(state => state.nodes)
  const edges               = useCircuitStore(state => state.edges)
  const addGateAction       = useCircuitStore(state => state.addGateAction)
  const connectGatesAction  = useCircuitStore(state => state.connectGatesAction)
  const removeGateAction    = useCircuitStore(state => state.removeGateAction)
  const disconnectGatesAction = useCircuitStore(state => state.disconnectGatesAction)
  const updateNodePositions = useCircuitStore(state => state.updateNodePositions)

  //    onConnect 
  const onConnect = useCallback((connection) => {
    const { source, target, targetHandle } = connection

    const inputIndex = parseInt(targetHandle.split('-')[1])

    connectGatesAction(source, target, inputIndex)
  }, [connectGatesAction])

  //    onNodesChange 
  const onNodesChange = useCallback((changes) => {
    // only care about position changes for updating the store
    const positionChanges = changes.filter(
      change => change.type === 'position'
    )

    if (positionChanges.length > 0) {
      updateNodePositions(
        nodes.map(node => {
          const change = positionChanges.find(c => c.id === node.id)
          // only update nodes that actually moved
          return change?.position
            ? { ...node, position: change.position }
            : node
        })
      )
    }
  }, [nodes, updateNodePositions])

  //    onEdgesDelete 
  const onEdgesDelete = useCallback((deletedEdges) => {
    deletedEdges.forEach(edge => {
      const inputIndex = parseInt(edge.targetHandle.split('-')[1])
      disconnectGatesAction(edge.source, edge.target, inputIndex)
    })
  }, [disconnectGatesAction])

  //    onNodesDelete 
  const onNodesDelete = useCallback((deletedNodes) => {
    deletedNodes.forEach(node => {
      removeGateAction(node.id)
    })
  }, [removeGateAction])

  //    onDragOver without this browser rejects drop events
  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // onDrop user drops a gate from Toolbar onto canvas
  const onDrop = useCallback((event) => {
    event.preventDefault()

    // gateType is set in Toolbar's onDragStart handler
    const gateType = event.dataTransfer.getData('application/gateType')

    //user might drop something else on canvas
    if (!gateType) return

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    })

    // Add the gate at the correct canvas position
    addGateAction(gateType, position)
  }, [screenToFlowPosition, addGateAction])

  //    Render 
  return (
    <div className="w-full h-full">
      <ReactFlow
        //      Data 
        nodes={nodes}              // from Zustand store
        edges={edges}              // from Zustand store

        //      Custom Components 
        nodeTypes={nodeTypes}      // our gate components
        edgeTypes={edgeTypes}      // our CustomEdge

        //      Event Handlers 
        onConnect={onConnect}           // wire drawing
        onNodesChange={onNodesChange}   // node dragging
        onEdgesDelete={onEdgesDelete}   // wire deletion
        onNodesDelete={onNodesDelete}   // node deletion
        onDragOver={onDragOver}         // allow dropping
        onDrop={onDrop}                 // gate dropped from toolbar

        // Default Edge Settings 
        defaultEdgeOptions={{ type: 'customEdge' }}

        // Connection Settings 
        // prevents connecting input to input or output to output
        connectionMode="strict"

        // Viewport Settings 
        minZoom={CANVAS.MIN_ZOOM}
        maxZoom={CANVAS.MAX_ZOOM}
        defaultViewport={{ x: 0, y: 0, zoom: CANVAS.DEFAULT_ZOOM }}

        // Delete Key allows user to delete selected nodes/edges 
        deleteKeyCode="Delete"
      >
        {/* Background visual grid helps users align gates */}
        <Background
          color={CANVAS.GRID_COLOR}
          gap={20}
          size={1}
        />

        {/* zoom buttons */}
        <Controls />

        {/* MiniMap helps users navigate large circuits */}
        <MiniMap
          nodeColor={(node) =>
            node.type === 'inputNode'  ? '#22c55e' :
            node.type === 'outputNode' ? '#3b82f6' :
            '#1e3a5f'
          }
          style={{ background: '#0f172a' }}
        />
      </ReactFlow>
    </div>
  )
}

/**
 * Global Zustand store for the Logic Gate Simulator.
 * This is the bridge between the UI layer and the engine layer.
 * Components never call engine functions directly — they call
 * store actions which call engine functions internally.
 */

import { create } from 'zustand'
import {
  createCircuit,
  addGate,
  removeGate,
  connectGates,
  disconnectGates,
  toggleInput,
  setInputValue,
  resetCircuit,
  clearCircuit,
  runSimulation
} from '../simulator/engine'
import { generateUniqueGateId } from '../utils/idGenerator'
import { GATE_INPUT_COUNTS, SIMULATION } from '../utils/constants'

//      Initial State 
const initialState = {
  // The circuit data — gates and their connections
  circuit: createCircuit(),

  // React Flow visual state — nodes and edges for rendering
  nodes: [],
  edges: [],

  // Simulation running state
  isSimulating: false,

  // Currently selected gate ID on canvas
  selectedGateId: null,
}

//      Convert Circuit Gates to React Flow Nodes 
/**
 * React Flow needs nodes in its own format to render them on the canvas.
 * @param {Object[]} gates - Array of gate objects from the engine
 * @returns {Object[]} - Array of React Flow node objects
 */
function gatesToNodes(gates) {
  return gates.map(gate => ({
    id: gate.id,
    type: gate.type === 'INPUT'
      ? 'inputNode'
      : gate.type === 'OUTPUT'
        ? 'outputNode'
        : 'gateNode',
    position: gate.position || SIMULATION.DEFAULT_POSITION,
    data: {
      gateType:  gate.type,
      inputs:    gate.inputs,
      output:    gate.output,
      label:     gate.type,
    }
  }))
}

//      Convert Circuit Connections to React Flow Edges 
/**
 * @param {Object[]} gates - Array of gate objects from the engine
 * @returns {Object[]} - Array of React Flow edge objects
 */
function connectionsToEdges(gates) {
  const edges = []

  gates.forEach(gate => {
    gate.connectedTo.forEach(connection => {
      edges.push({
        id:           `wire_${gate.id}_to_${connection.gateId}_${connection.inputIndex}`,
        source:       gate.id,
        target:       connection.gateId,
        targetHandle: `input-${connection.inputIndex}`,
        type:         'customEdge',
        data: {
          signal: gate.output,
        }
      })
    })
  })
  return edges
}

//      Sync React Flow State With Circuit State 
/**
 * After every engine operation, we must sync the React Flow with the updated circuit state.
 * This is what triggers React to re-render the canvas.
 * @param {Object} circuit - Updated circuit from engine
 * @returns {Object} - { nodes, edges } for React Flow
 */
function syncReactFlow(circuit) {
  return {
    nodes: gatesToNodes(circuit.gates),
    edges: connectionsToEdges(circuit.gates),
  }
}

//      Zustand Store 
export const useCircuitStore = create((set, get) => ({
  ...initialState,

  //       Add Gate Action 
  /**
   * Adds a new gate to the circuit at a given canvas position.
   * @param {string} gateType - Type of gate to add (AND, OR, NOT, etc.)
   * @param {Object} position - {x, y} position on canvas
   */
  addGateAction: (gateType, position) => {
    const { circuit } = get()

    // Generate a unique readable ID for this gate
    const id = generateUniqueGateId(gateType, circuit.gates)

    // Get the correct input count for this gate type
    const inputCount = GATE_INPUT_COUNTS[gateType] || 2

    // Add gate to circuit using engine
    const updatedCircuit = addGate(
      circuit,
      id,
      gateType,
      inputCount,
      position
    )

    // Sync React Flow nodes and edges
    const { nodes, edges } = syncReactFlow(updatedCircuit)

    set({ circuit: updatedCircuit, nodes, edges })
  },

  //    Remove Gate Action 
  /**
   * Removes a gate and all its connections from the circuit.
   * @param {string} gateId - ID of the gate to remove
   */
  removeGateAction: (gateId) => {
    const { circuit } = get()
    const updatedCircuit = removeGate(circuit, gateId)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges, selectedGateId: null })
  },

  //    Connect Gates Action 
  /**
   * Connects two gates with a wire.
   * @param {string} fromGateId - Source gate ID
   * @param {string} toGateId - Target gate ID
   * @param {number} toInputIndex - Target input slot index
   */
  connectGatesAction: (fromGateId, toGateId, toInputIndex) => {
    const { circuit } = get()
    const updatedCircuit = connectGates(circuit, fromGateId, toGateId, toInputIndex)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges })
  },

  //    Disconnect Gates Action 
  /**
   * Removes a wire connection between two gates.
   * @param {string} fromGateId - Source gate ID
   * @param {string} toGateId - Target gate ID
   * @param {number} toInputIndex - Input slot to disconnect
   */
  disconnectGatesAction: (fromGateId, toGateId, toInputIndex) => {
    const { circuit } = get()
    const updatedCircuit = disconnectGates(circuit, fromGateId, toGateId, toInputIndex)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges })
  },

  //    Toggle Input Action 
  /**
   * @param {string} gateId - ID of the INPUT gate to toggle
   */
  toggleInputAction: (gateId) => {
    const { circuit } = get()
    const updatedCircuit = toggleInput(circuit, gateId)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges })
  },

  //    Set Input Value Action 
  /**
   * @param {string} gateId - ID of the INPUT gate
   * @param {number} value - 0 or 1
   */
  setInputValueAction: (gateId, value) => {
    const { circuit } = get()
    const updatedCircuit = setInputValue(circuit, gateId, value)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges })
  },

  //    Reset Circuit Action 
  /**
   * Resets all INPUT nodes to 0.
   * Keeps gates and connections intact.
   */
  resetCircuitAction: () => {
    const { circuit } = get()
    const updatedCircuit = resetCircuit(circuit)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges })
  },

  //    Clear Circuit Action 
  clearCircuitAction: () => {
    const updatedCircuit = clearCircuit()
    set({
      circuit: updatedCircuit,
      nodes: [],
      edges: [],
      selectedGateId: null
    })
  },

  //    Run Simulation Action 
  runSimulationAction: () => {
    const { circuit } = get()
    const updatedCircuit = runSimulation(circuit)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges, isSimulating: true })
  },

  //    Select Gate Action 
  /**
   * Used to highlight a gate and show its properties in sidebar.
   * @param {string|null} gateId - ID of selected gate or null to deselect
   */
  selectGateAction: (gateId) => {
    set({ selectedGateId: gateId })
  },

  //    Update Node Positions 
  /**
   * @param {Object[]} updatedNodes - React Flow nodes with new positions
   */
  updateNodePositions: (updatedNodes) => {
    const { circuit } = get()

    const updatedGates = circuit.gates.map(gate => {
      const node = updatedNodes.find(n => n.id === gate.id)
      return node ? { ...gate, position: node.position } : gate
    })

    set({
      circuit: { ...circuit, gates: updatedGates },
      nodes: updatedNodes
    })
  },
}))

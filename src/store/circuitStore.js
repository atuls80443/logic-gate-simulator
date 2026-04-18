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
import { evaluateFullCircuit } from '../simulator/propagation'

const initialState = {
  circuit: createCircuit(),
  nodes: [],
  edges: [],
  isSimulating: false,
  selectedGateId: null,
}

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
      gateType: gate.type,
      inputs: gate.inputs,
      output: gate.output,
      label: gate.type,
    }
  }))
}

function connectionsToEdges(gates) {
  const edges = []
  gates.forEach(gate => {
    gate.connectedTo.forEach(connection => {
      edges.push({
        id: `wire_${gate.id}_to_${connection.gateId}_${connection.inputIndex}`,
        source: gate.id,
        target: connection.gateId,
        targetHandle: `input-${connection.inputIndex}`,
        type: 'customEdge',
        data: {
          signal: gate.output,
        }
      })
    })
  })
  return edges
}

function syncReactFlow(circuit) {
  return {
    nodes: gatesToNodes(circuit.gates),
    edges: connectionsToEdges(circuit.gates),
  }
}

export const useCircuitStore = create((set, get) => ({
  ...initialState,

  addGateAction: (gateType, position) => {
    const { circuit } = get()
    const id = generateUniqueGateId(gateType, circuit.gates)
    const inputCount = GATE_INPUT_COUNTS[gateType] || 2
    const updatedCircuit = addGate(circuit, id, gateType, inputCount, position)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges })
  },

  removeGateAction: (gateId) => {
    const { circuit } = get()
    const updatedCircuit = removeGate(circuit, gateId)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges, selectedGateId: null })
  },

  connectGatesAction: (fromGateId, toGateId, toInputIndex) => {
    const { circuit } = get()
    const updatedCircuit = { ...circuit }
    connectGates(updatedCircuit, fromGateId, toGateId, toInputIndex)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges })
  },

  disconnectGatesAction: (fromGateId, toGateId, toInputIndex) => {
    const { circuit } = get()
    const updatedCircuit = { ...circuit }
    disconnectGates(updatedCircuit, fromGateId, toGateId, toInputIndex)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges })
  },

  toggleInputAction: (gateId) => {
    const { circuit } = get()
    const updatedCircuit = { ...circuit }
    toggleInput(updatedCircuit, gateId)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges })
  },

  setInputValueAction: (gateId, value) => {
    const { circuit } = get()
    const updatedCircuit = { ...circuit }
    setInputValue(updatedCircuit, gateId, value)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges })
  },

  resetCircuitAction: () => {
    const { circuit } = get()
    const updatedCircuit = { ...circuit }
    resetCircuit(updatedCircuit)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges })
  },

  clearCircuitAction: () => {
    const updatedCircuit = clearCircuit()
    set({
      circuit: updatedCircuit,
      nodes: [],
      edges: [],
      selectedGateId: null
    })
  },

  runSimulationAction: () => {
    const { circuit } = get()
    const updatedCircuit = { ...circuit }
    runSimulation(updatedCircuit)
    const { nodes, edges } = syncReactFlow(updatedCircuit)
    set({ circuit: updatedCircuit, nodes, edges, isSimulating: true })
  },

  loadTemplateAction: (templateFactory) => {
    const template = templateFactory()
    const circuit = { gates: template.gates }
    const evaluatedCircuit = evaluateFullCircuit(circuit)
    const { nodes, edges } = syncReactFlow(evaluatedCircuit)
    set({
      circuit: evaluatedCircuit,
      nodes,
      edges,
      selectedGateId: null
    })
  },

  selectGateAction: (gateId) => {
    set({ selectedGateId: gateId })
  },

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
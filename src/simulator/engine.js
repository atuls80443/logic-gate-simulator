import { GATE_TYPES, SIMULATION } from '../utils/constants'
import { propagate, updateGateInput, evaluateFullCircuit } from './propagation'

export function createCircuit() {
  return { gates: [] }
}

export function addGate(circuit, id, type, inputCount, position = { x: 0, y: 0 }) {
  const exists = circuit.gates.some(gate => gate.id === id)
  if (exists) {
    console.warn(`Gate with ID ${id} already exists`)
    return circuit
  }

  const newGate = {
    id,
    type,
    inputs: new Array(inputCount).fill(0),
    output: 0,
    position,
    connectedTo: []
  }

  return {
    ...circuit,
    gates: [...circuit.gates, newGate]
  }
}

export function removeGate(circuit, gateId) {
  const updatedGates = circuit.gates
    .filter(gate => gate.id !== gateId)
    .map(gate => ({
      ...gate,
      inputs: [...gate.inputs],
      connectedTo: gate.connectedTo.filter(
        conn => conn.gateId !== gateId
      )
    }))

  return {
    ...circuit,
    gates: updatedGates
  }
}

export function connectGates(circuit, fromGateId, toGateId, toInputIndex) {
  const fromGate = circuit.gates.find(gate => gate.id === fromGateId)
  if (!fromGate) {
    console.warn(`Source gate ${fromGateId} not found`)
    return circuit
  }

  const toGate = circuit.gates.find(gate => gate.id === toGateId)
  if (!toGate) {
    console.warn(`Target gate ${toGateId} not found`)
    return circuit
  }

  const alreadyConnected = fromGate.connectedTo.some(
    conn => conn.gateId === toGateId && conn.inputIndex === toInputIndex
  )
  if (alreadyConnected) {
    console.warn(`Connection already exists from ${fromGateId} to ${toGateId}[${toInputIndex}]`)
    return circuit
  }

  fromGate.connectedTo.push({
    gateId: toGateId,
    inputIndex: toInputIndex
  })

  toGate.inputs[toInputIndex] = fromGate.output

  return propagate(circuit, fromGateId)
}

export function disconnectGates(circuit, fromGateId, toGateId, toInputIndex) {
  const fromGate = circuit.gates.find(gate => gate.id === fromGateId)
  if (!fromGate) {
    console.warn(`Source gate ${fromGateId} not found`)
    return circuit
  }

  fromGate.connectedTo = fromGate.connectedTo.filter(
    conn => !(conn.gateId === toGateId && conn.inputIndex === toInputIndex)
  )

  const toGate = circuit.gates.find(gate => gate.id === toGateId)
  if (toGate) {
    toGate.inputs[toInputIndex] = 0
  }

  return propagate(circuit, toGateId)
}

export function toggleInput(circuit, gateId) {
  const gate = circuit.gates.find(g => g.id === gateId)

  if (!gate) {
    console.warn(`Gate ${gateId} not found`)
    return circuit
  }

  if (gate.type !== GATE_TYPES.INPUT) {
    console.warn(`Gate ${gateId} is not an INPUT node`)
    return circuit
  }

  const newValue = gate.output === 0 ? 1 : 0
  return updateGateInput(circuit, gateId, 0, newValue)
}

export function setInputValue(circuit, gateId, value) {
  const gate = circuit.gates.find(g => g.id === gateId)

  if (!gate) {
    console.warn(`Gate ${gateId} not found`)
    return circuit
  }

  if (gate.type !== GATE_TYPES.INPUT) {
    console.warn(`Gate ${gateId} is not an INPUT node`)
    return circuit
  }

  return updateGateInput(circuit, gateId, 0, value)
}

export function resetCircuit(circuit) {
  circuit.gates.forEach(gate => {
    if (gate.type === GATE_TYPES.INPUT) {
      gate.inputs = [0]
      gate.output = 0
    }
  })
  return evaluateFullCircuit(circuit)
}

export function clearCircuit() {
  return createCircuit()
}

export function getGateOutput(circuit, gateId) {
  const gate = circuit.gates.find(g => g.id === gateId)
  return gate ? gate.output : null
}

export function runSimulation(circuit) {
  return evaluateFullCircuit(circuit)
}
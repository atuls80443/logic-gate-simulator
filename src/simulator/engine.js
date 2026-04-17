/**
 * Orchestrates the simulation. Responsible for:
 * Creating and removing gates
 * Connecting and disconnecting wires
 * Triggering signal propagation
 * Resetting the circuit
 */

import { GATE_TYPES, SIMULATION } from '../utils/constants'
import { propagate, updateGateInput, evaluateFullCircuit } from './propagation'

/**
 * @returns {Object} - Empty circuit state
 */
export function createCircuit() {
  return {
    gates: []
  }
}

/**
 * Adds a new gate to the circuit and gate is initialized with all inputs set to 0.
 * @param {Object} circuit - The current circuit state
 * @param {string} id - Unique ID for the new gate
 * @param {string} type - Gate type: AND, OR, NOT, NAND, NOR, XOR, XNOR, INPUT
 * @param {number} inputCount - How many inputs this gate has
 * @param {Object} position - {x, y} position on canvas
 * @returns {Object} - New circuit with new gate added
 */
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

/**
 * @param {Object} circuit - The current circuit state
 * @param {string} gateId - ID of the gate to remove
 * @returns {Object} - Updated circuit with gate removed
 */
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

/**
 * Connects the output of one gate to an input of another gate.
 * After connecting, propagates the signal immediately.
 * Mutates the circuit in-place.
 * @param {Object} circuit - The current circuit state
 * @param {string} fromGateId - ID of the gate whose OUTPUT we connect from
 * @param {string} toGateId - ID of the gate whose INPUT we connect to
 * @param {number} toInputIndex - Which input slot on the target gate (0, 1, 2...)
 * @returns {Object} - The same circuit object, mutated
 */
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

/**
 * Removes a connection between two gates.
 * Mutates the circuit in-place.
 * @param {Object} circuit - The current circuit state
 * @param {string} fromGateId - ID of the source gate
 * @param {string} toGateId - ID of the target gate
 * @param {number} toInputIndex - Which input slot to disconnect
 * @returns {Object} - The same circuit object, mutated
 */
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

/**
 * Toggles an INPUT node between 0 and 1.
 * Triggers full signal propagation after the toggle.
 * @param {Object} circuit - The current circuit state
 * @param {string} gateId - ID of the INPUT gate to toggle
 * @returns {Object} - Updated circuit after propagation
 */
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

/**
 * Sets an INPUT node to a specific value (0 or 1).
 * @param {Object} circuit - The current circuit state
 * @param {string} gateId - ID of the INPUT gate
 * @param {number} value - The value to set (0 or 1)
 * @returns {Object} - Updated circuit after propagation
 */
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

/**
 * Resets all INPUT nodes to 0 and re-evaluates the circuit.
 * Mutates the circuit in-place.
 * @param {Object} circuit - The current circuit state
 * @returns {Object} - The same circuit object, mutated
 */
export function resetCircuit(circuit) {
  circuit.gates.forEach(gate => {
    if (gate.type === GATE_TYPES.INPUT) {
      gate.inputs = [0]
      gate.output = 0
    }
  })
  return evaluateFullCircuit(circuit)
}

/**
 * Completely clears the circuit — removes all gates and connections.
 * @returns {Object} - Empty circuit state
 */
export function clearCircuit() {
  return createCircuit()
}

/**
 * Returns the current output value of a specific gate.
 * @param {Object} circuit - The current circuit state
 * @param {string} gateId - ID of the gate
 * @returns {number|null} - Output value (0 or 1) or null if not found
 */
export function getGateOutput(circuit, gateId) {
  const gate = circuit.gates.find(g => g.id === gateId)
  return gate ? gate.output : null
}

/**
 * Runs a full simulation of the circuit from scratch.
 * @param {Object} circuit - The current circuit state
 * @returns {Object} - Fully evaluated circuit state
 */
export function runSimulation(circuit) {
  return evaluateFullCircuit(circuit)
}
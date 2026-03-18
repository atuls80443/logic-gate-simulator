/**
 * Orchestrates the simulation. Responsible for:
 *  Creating and removing gates
 *  Connecting and disconnecting wires
 *  Triggering signal propagation
 *  Resetting the circuit
 */

import { propagate, updateGateInput, deepCopyGates, evaluateFullCircuit } from './propagation'
import { evaluateGate } from './gateLogic'

//      Create Empty Circuit Starting Point 
/**
 * @returns {Object} - Empty circuit state
 */
export function createCircuit() {
  return {
    gates: []
  }
}

//      Add Gate 
/**
 * Adds a new gate to the circuit and gate is initialized with all inputs set to 0.
 * @param {Object} circuit - The current circuit state
 * @param {string} id - Unique ID for the new gate
 * @param {string} type - Gate type: AND, OR, NOT, NAND, NOR, XOR, XNOR, INPUT
 * @param {number} inputCount - How many inputs this gate has
 * @param {Object} position - {x, y} position on canvas
 * @returns {Object} - Updated circuit with new gate added
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

//      Remove Gate 
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
      // Remove any connections pointing to the deleted gate
      connectedTo: gate.connectedTo.filter(
        conn => conn.gateId !== gateId
      )
    }))

  return {
    ...circuit,
    gates: updatedGates
  }
}

//      Connect Gates 
/**
 * Connects the output of one gate to an input of another gate.
 * After connecting, propagates the signal immediately.
 * @param {Object} circuit - The current circuit state
 * @param {string} fromGateId - ID of the gate whose OUTPUT we connect from
 * @param {string} toGateId - ID of the gate whose INPUT we connect to
 * @param {number} toInputIndex - Which input slot on the target gate (0, 1, 2...)
 * @returns {Object} - Updated circuit with connection added
 */
export function connectGates(circuit, fromGateId, toGateId, toInputIndex) {
  const updatedGates = deepCopyGates(circuit.gates)

  // Find source gate
  const fromGate = updatedGates.find(gate => gate.id === fromGateId)
  if (!fromGate) {
    console.warn(`Source gate ${fromGateId} not found`)
    return circuit
  }

  // Find target gate
  const toGate = updatedGates.find(gate => gate.id === toGateId)
  if (!toGate) {
    console.warn(`Target gate ${toGateId} not found`)
    return circuit
  }

  // Check if connection already exists
  const alreadyConnected = fromGate.connectedTo.some(
    conn => conn.gateId === toGateId && conn.inputIndex === toInputIndex
  )
  if (alreadyConnected) {
    console.warn(`Connection already exists from ${fromGateId} to ${toGateId}[${toInputIndex}]`)
    return circuit
  }

  // Add the connection to the source gate
  fromGate.connectedTo.push({
    gateId: toGateId,
    inputIndex: toInputIndex
  })

  // Immediately update the target gate's input with source gate's current output
  toGate.inputs[toInputIndex] = fromGate.output

  const updatedCircuit = { ...circuit, gates: updatedGates }

  // Propagate signal through the new connection
  return propagate(updatedCircuit, fromGateId)
}

//      Disconnect Gates - Removes a connection between two gates.
/**
 * @param {Object} circuit - The current circuit state
 * @param {string} fromGateId - ID of the source gate
 * @param {string} toGateId - ID of the target gate
 * @param {number} toInputIndex - Which input slot to disconnect
 * @returns {Object} - Updated circuit with connection removed
 */
export function disconnectGates(circuit, fromGateId, toGateId, toInputIndex) {
  const updatedGates = deepCopyGates(circuit.gates)

  // Remove connection from source gate
  const fromGate = updatedGates.find(gate => gate.id === fromGateId)
  if (!fromGate) {
    console.warn(`Source gate ${fromGateId} not found`)
    return circuit
  }

  fromGate.connectedTo = fromGate.connectedTo.filter(
    conn => !(conn.gateId === toGateId && conn.inputIndex === toInputIndex)
  )

  // Reset target gate's input to 0
  const toGate = updatedGates.find(gate => gate.id === toGateId)
  if (toGate) {
    toGate.inputs[toInputIndex] = 0
  }

  const updatedCircuit = { ...circuit, gates: updatedGates }

  // Re-evaluate target gate with reset input
  return propagate(updatedCircuit, toGateId)
}

//      Toggle Input 
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

  if (gate.type !== 'INPUT') {
    console.warn(`Gate ${gateId} is not an INPUT node`)
    return circuit
  }

  // Toggle the current output value
  const newValue = gate.output === 0 ? 1 : 0

  // Update the input and trigger propagation
  return updateGateInput(circuit, gateId, 0, newValue)
}

//      Set Input Value 
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

  if (gate.type !== 'INPUT') {
    console.warn(`Gate ${gateId} is not an INPUT node`)
    return circuit
  }

  return updateGateInput(circuit, gateId, 0, value)
}

//      Reset Circuit 
/**
 * Resets all INPUT nodes to 0 and re-evaluates the circuit.
 * @param {Object} circuit - The current circuit state
 * @returns {Object} - Circuit with all inputs reset to 0
 */
export function resetCircuit(circuit) {
  const updatedGates = deepCopyGates(circuit.gates)

  // Reset all INPUT nodes to 0
  updatedGates.forEach(gate => {
    if (gate.type === 'INPUT') {
      gate.inputs = [0]
      gate.output = 0
    }
  })

  const updatedCircuit = { ...circuit, gates: updatedGates }

  // Re-evaluate full circuit with reset inputs
  return evaluateFullCircuit(updatedCircuit)
}

//      Clear Circuit 
/**
 * Completely clears the circuit — removes all gates and connections.
 * @returns {Object} - Empty circuit state
 */
export function clearCircuit() {
  return createCircuit()
}

//       Get Gate Output 
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

//      Run Simulation 
/**
 * Runs a full simulation of the circuit from scratch.
 * @param {Object} circuit - The current circuit state
 * @returns {Object} - Fully evaluated circuit state
 */
export function runSimulation(circuit) {
  return evaluateFullCircuit(circuit)
}
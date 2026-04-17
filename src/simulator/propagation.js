/**
 * Implements the event-driven BFS signal propagation algorithm.
 * When an input changes, this module propagates that change
 * through the circuit until steady state is reached.
 * LOOKUP STRATEGY: Map.get() — O(1) per lookup.
 */

// Import constants.js
import { GATE_TYPES } from '../utils/constants'

import { evaluateGate } from './gateLogic'

const MAX_ITERATIONS = 1000

/**
 * Converts gates array into a Map for O(1) lookups.
 * @param {Object[]} gates - Array of gate objects
 * @returns {Map} - Map of gateId → gate object
 */
export function buildGateMap(gates) {
  const map = new Map()
  gates.forEach(gate => map.set(gate.id, gate))
  return map
}

/**
 * Propagates signal changes through the circuit using BFS.
 * @param {Object} circuit - The current circuit state
 * @param {string} startGateId - ID of the gate whose output just changed
 * @returns {Object} - Updated circuit state with new output values
 */
export function propagate(circuit, startGateId) {
  const updatedGates = deepCopyGates(circuit.gates)

  // Build Map ONCE — O(n). All lookups inside the loop are O(1)
  const gateMap = buildGateMap(updatedGates)

  const queue = [startGateId]
  const pending = new Set([startGateId])
  let iterations = 0

  while (queue.length > 0 && iterations < MAX_ITERATIONS) {
    iterations++

    const currentGateId = queue.shift()
    pending.delete(currentGateId)

    // O(1) lookup — no array scanning
    const currentGate = gateMap.get(currentGateId)
    if (!currentGate) continue

    const previousOutput = currentGate.output
    const newOutput = evaluateGate(currentGate.type, currentGate.inputs)
    currentGate.output = newOutput

    const shouldPropagate =
      newOutput !== previousOutput || currentGateId === startGateId

    if (shouldPropagate && currentGate.connectedTo?.length > 0) {
      currentGate.connectedTo.forEach(connection => {
        // O(1) lookup — no array scanning
        const targetGate = gateMap.get(connection.gateId)

        if (targetGate) {
          targetGate.inputs[connection.inputIndex] = newOutput

          if (!pending.has(connection.gateId)) {
            queue.push(connection.gateId)
            pending.add(connection.gateId)
          }
        }
      })
    }
  }

  if (iterations >= MAX_ITERATIONS) {
    console.warn(
      'Propagation hit MAX_ITERATIONS limit. ' +
      'Circuit may contain an oscillating feedback loop.'
    )
  }

  return { ...circuit, gates: updatedGates }
}

/**
 * Updates a specific gate's input value and triggers propagation.
 * This is the entry point called when a user toggles an INPUT node.
 * @param {Object} circuit - The current circuit state
 * @param {string} gateId - ID of the gate whose input changed
 * @param {number} inputIndex - Which input slot changed (0, 1, 2...)
 * @param {number} newValue - The new input value (0 or 1)
 * @returns {Object} - Updated circuit state after propagation
 */
export function updateGateInput(circuit, gateId, inputIndex, newValue) {
  const updatedGates = deepCopyGates(circuit.gates)

  // Build Map for O(1) lookup
  const gateMap = buildGateMap(updatedGates)
  const targetGate = gateMap.get(gateId)

  if (!targetGate) {
    console.warn(`Gate with ID ${gateId} not found`)
    return circuit
  }

  targetGate.inputs[inputIndex] = newValue

  const updatedCircuit = { ...circuit, gates: updatedGates }
  return propagate(updatedCircuit, gateId)
}

/**
 * Finds a gate by ID from an array using Array.find().
 * @param {Object[]} gates - Array of gate objects
 * @param {string} id - The gate ID to search for
 * @returns {Object|null}
 */
export function findGateById(gates, id) {
  return gates.find(gate => gate.id === id) || null
}

/**
 * Creates a deep copy of the gates array.
 * @param {Object[]} gates - Array of gate objects to copy
 * @returns {Object[]}
 */
export function deepCopyGates(gates) {
  return gates.map(gate => ({
    ...gate,
    inputs: [...gate.inputs],
    connectedTo: gate.connectedTo
      ? gate.connectedTo.map(conn => ({ ...conn }))
      : []
  }))
}

/**
 * Evaluates every gate in the circuit from scratch.
 * Used when loading a saved circuit or resetting simulation.
 * @param {Object} circuit - The circuit state to evaluate
 * @returns {Object}
 */
export function evaluateFullCircuit(circuit) {
  const updatedGates = deepCopyGates(circuit.gates)
  const inputNodes = updatedGates.filter(gate => gate.type === GATE_TYPES.INPUT)
  let currentCircuit = { ...circuit, gates: updatedGates }

  inputNodes.forEach(inputNode => {
    currentCircuit = propagate(currentCircuit, inputNode.id)
  })

  return currentCircuit
}
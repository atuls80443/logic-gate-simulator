/**
 * Implements the event-driven BFS signal propagation algorithm.
 * When an input changes, this module propagates that change
 * through the circuit until steady state is reached.
 *
 * LOOKUP STRATEGY: Array.find() — O(n) per lookup.
 * Simple and readable. Suitable for Phase 1-3 circuit sizes.
 * Can be upgraded to Map version in Phase 5 if performance is needed.
 */

import { evaluateGate } from './gateLogic'

const MAX_ITERATIONS = 1000

/**
 * Propagates signal changes through the circuit using BFS.
 *
 * NOTE ON visited Set:
 * Correctly prevents infinite loops in combinational circuits (Phases 1-3).
 * Will be refactored in Phase 4 for sequential feedback circuits.
 *
 * NOTE ON shouldPropagate:
 * startGateId always propagates to connected gates regardless of whether
 * its own output changed. This fixes the stale initial state bug where
 * a gate's output may not match its inputs on first load.
 *
 * @param {Object} circuit - The current circuit state
 * @param {string} startGateId - ID of the gate whose output just changed
 * @returns {Object} - Updated circuit state with new output values
 */
export function propagate(circuit, startGateId) {
  const updatedGates = deepCopyGates(circuit.gates)
  const queue = [startGateId]
  const visited = new Set()
  let iterations = 0

  while (queue.length > 0 && iterations < MAX_ITERATIONS) {
    iterations++

    const currentGateId = queue.shift()

    if (visited.has(currentGateId)) continue
    visited.add(currentGateId)

    // O(n) lookup — scans array until gate is found
    const currentGate = findGateById(updatedGates, currentGateId)
    if (!currentGate) continue

    const previousOutput = currentGate.output
    const newOutput = evaluateGate(currentGate.type, currentGate.inputs)
    currentGate.output = newOutput

    const shouldPropagate =
      newOutput !== previousOutput || currentGateId === startGateId

    if (shouldPropagate && currentGate.connectedTo?.length > 0) {
      currentGate.connectedTo.forEach(connection => {
        // O(n) lookup for each connected gate
        const targetGate = findGateById(updatedGates, connection.gateId)

        if (targetGate) {
          targetGate.inputs[connection.inputIndex] = newOutput

          if (!visited.has(connection.gateId)) {
            queue.push(connection.gateId)
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
 *
 * @param {Object} circuit - The current circuit state
 * @param {string} gateId - ID of the gate whose input changed
 * @param {number} inputIndex - Which input slot changed (0, 1, 2...)
 * @param {number} newValue - The new input value (0 or 1)
 * @returns {Object} - Updated circuit state after propagation
 */
export function updateGateInput(circuit, gateId, inputIndex, newValue) {
  const updatedGates = deepCopyGates(circuit.gates)
  const targetGate = findGateById(updatedGates, gateId)

  if (!targetGate) {
    console.warn(`Gate with ID ${gateId} not found`)
    return circuit
  }

  targetGate.inputs[inputIndex] = newValue

  const updatedCircuit = { ...circuit, gates: updatedGates }
  return propagate(updatedCircuit, gateId)
}

/**
 * Finds a gate by ID using Array.find().
 * Time complexity: O(n)
 *
 * @param {Object[]} gates - Array of gate objects
 * @param {string} id - The gate ID to search for
 * @returns {Object|null}
 */
export function findGateById(gates, id) {
  return gates.find(gate => gate.id === id) || null
}

/**
 * Creates a deep copy of the gates array.
 * Immutability is critical for React state management and undo/redo.
 *
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
 *
 * @param {Object} circuit - The circuit state to evaluate
 * @returns {Object}
 */
export function evaluateFullCircuit(circuit) {
  const updatedGates = deepCopyGates(circuit.gates)
  const inputNodes = updatedGates.filter(gate => gate.type === 'INPUT')
  let currentCircuit = { ...circuit, gates: updatedGates }

  inputNodes.forEach(inputNode => {
    currentCircuit = propagate(currentCircuit, inputNode.id)
  })

  return currentCircuit
}
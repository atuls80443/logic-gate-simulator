/**
 * Generates unique IDs for gates 
 * and wires in the circuit.
 * Generates a random alphanumeric string of given length.
 */

import { GATE_TYPES } from './constants'

//      Random String Generator 
/**
 * @param {number} length - Length of random string (default: 6)
 * @returns {string} - Random alphanumeric string
 */
function generateRandomString(length = 6) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

//      Gate ID Generator 
/**
 * Generates a unique readable ID for a gate.
 * @param {string} gateType - The type of gate (AND, OR, NOT, etc.)
 * @returns {string} - Unique gate ID
 * Examples: generateGateId('AND')    → 'and_a3f9b2'
 */
export function generateGateId(gateType) {
  if (!gateType) {
    console.warn('generateGateId called without gateType')
    return `gate_${generateRandomString()}`
  }

  const prefix = gateType.toLowerCase()
  const suffix = generateRandomString()
  return `${prefix}_${suffix}`
}

//      Wire ID Generator 
/**
 * @param {string} fromGateId - ID of the source gate
 * @param {string} toGateId - ID of the target gate
 * @returns {string} - Unique wire ID
 */
export function generateWireId(fromGateId, toGateId) {
  const suffix = generateRandomString(4)
  return `wire_${fromGateId}_to_${toGateId}_${suffix}`
}

//      Validate ID 
/**
 * Checks whether a given ID already exists in the circuit.
 * @param {string} id - The ID to check
 * @param {Object[]} gates - Current array of gates in circuit
 * @returns {boolean} - true if ID is unique, false if it already exists
 */
export function isUniqueId(id, gates) {
  return !gates.some(gate => gate.id === id)
}

//      Safe Gate ID Generator 
/**
 * Generates a guaranteed unique gate ID by checking against
 * existing gates in the circuit. Retries if collision occurs.
 * @param {string} gateType - The type of gate
 * @param {Object[]} gates - Current gates array to check against
 * @returns {string} - Guaranteed unique gate ID
 */
export function generateUniqueGateId(gateType, gates) {
  let id = generateGateId(gateType)
  let attempts = 0
  const MAX_ATTEMPTS = 10

  while (!isUniqueId(id, gates) && attempts < MAX_ATTEMPTS) {
    id = generateGateId(gateType)
    attempts++
  }

  if (attempts >= MAX_ATTEMPTS) {
    console.warn('ID generation hit MAX_ATTEMPTS. Using timestamp fallback.')
    return `${gateType.toLowerCase()}_${Date.now()}`
  }

  return id
}
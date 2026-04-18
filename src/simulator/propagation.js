import { GATE_TYPES } from '../utils/constants'
import { evaluateGate } from './gateLogic'

const MAX_ITERATIONS = 1000

export function buildGateMap(gates) {
  const map = new Map()
  gates.forEach(gate => map.set(gate.id, gate))
  return map
}

export function propagate(circuit, startGateId) {
  const gateMap = buildGateMap(circuit.gates)

  const queue = [startGateId]
  const pending = new Set([startGateId])
  let iterations = 0

  while (queue.length > 0 && iterations < MAX_ITERATIONS) {
    iterations++

    const currentGateId = queue.shift()
    pending.delete(currentGateId)

    const currentGate = gateMap.get(currentGateId)
    if (!currentGate) continue

    const previousOutput = currentGate.output
    const newOutput = evaluateGate(currentGate.type, currentGate.inputs)
    currentGate.output = newOutput

    const shouldPropagate =
      newOutput !== previousOutput || currentGateId === startGateId

    if (shouldPropagate && currentGate.connectedTo?.length > 0) {
      currentGate.connectedTo.forEach(connection => {
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

  return circuit
}

export function updateGateInput(circuit, gateId, inputIndex, newValue) {
  const gateMap = buildGateMap(circuit.gates)
  const targetGate = gateMap.get(gateId)

  if (!targetGate) {
    console.warn(`Gate with ID ${gateId} not found`)
    return circuit
  }

  targetGate.inputs[inputIndex] = newValue

  return propagate(circuit, gateId)
}

export function findGateById(gates, id) {
  return gates.find(gate => gate.id === id) || null
}

export function deepCopyGates(gates) {
  return gates.map(gate => ({
    ...gate,
    inputs: [...gate.inputs],
    connectedTo: gate.connectedTo
      ? gate.connectedTo.map(conn => ({ ...conn }))
      : []
  }))
}

export function evaluateFullCircuit(circuit) {
  const inputNodes = circuit.gates.filter(gate => gate.type === GATE_TYPES.INPUT)
  inputNodes.forEach(inputNode => {
    propagate(circuit, inputNode.id)
  })
  return circuit
}
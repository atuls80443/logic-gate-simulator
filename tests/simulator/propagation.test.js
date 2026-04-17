/**
 * Tests for the BFS signal propagation algorithm.
 * We simulate small circuits and verify outputs are correct.
 */

import { describe, it, expect } from 'vitest'
import {
  propagate,
  updateGateInput,
  findGateById,
  evaluateFullCircuit
} from '../../src/simulator/propagation'

//    Build a simple 2-input AND circuit 
//    INPUT_A && INPUT_B -> OUTPUT_NODE
function buildAndCircuit(inputA = 0, inputB = 0) {
  return {
    gates: [
      {
        id: 'input_a',
        type: 'INPUT',
        inputs: [inputA],
        output: inputA,
        connectedTo: [{ gateId: 'and_gate', inputIndex: 0 }]
      },
      {
        id: 'input_b',
        type: 'INPUT',
        inputs: [inputB],
        output: inputB,
        connectedTo: [{ gateId: 'and_gate', inputIndex: 1 }]
      },
      {
        id: 'and_gate',
        type: 'AND',
        inputs: [inputA, inputB],
        output: 0,
        connectedTo: [{ gateId: 'output_node', inputIndex: 0 }]
      },
      {
        id: 'output_node',
        type: 'INPUT',
        inputs: [0],
        output: 0,
        connectedTo: []
      }
    ]
  }
}

//     findGateById Tests 
describe('findGateById', () => {
  it('finds a gate by its ID', () => {
    const circuit = buildAndCircuit()
    const gate = findGateById(circuit.gates, 'and_gate')
    expect(gate).not.toBeNull()
    expect(gate.type).toBe('AND')
  })

  it('returns null for unknown ID', () => {
    const circuit = buildAndCircuit()
    const gate = findGateById(circuit.gates, 'nonexistent')
    expect(gate).toBeNull()
  })
})

//    propagate Tests 
describe('propagate', () => {
  it('propagates HIGH signal through AND gate when both inputs are 1', () => {
    const circuit = buildAndCircuit(1, 1)
    const result = propagate(circuit, 'input_a')
    const andGate = findGateById(result.gates, 'and_gate')
    expect(andGate.output).toBe(1)
  })

  it('propagates LOW signal through AND gate when one input is 0', () => {
    const circuit = buildAndCircuit(1, 0)
    const result = propagate(circuit, 'input_a')
    const andGate = findGateById(result.gates, 'and_gate')
    expect(andGate.output).toBe(0)
  })

  //   it('mutates the circuit in-place and returns the same reference', () => {
  //   const circuit = createTestCircuit()
  //   const originalRef = circuit
  //   const originalOutput = circuit.gates[2].output

  //   const result = propagate(circuit, 'input_a')

  //   // Returns same object reference
  //   expect(result).toBe(originalRef)
  //   // Gate output is mutated in-place
  //   expect(circuit.gates[2].output).not.toBe(originalOutput)
  //   expect(circuit.gates[2].output).toBe(1)
  // })
})

//    updateGateInput Tests ────────────────────────────────────────────────────
describe('updateGateInput', () => {
  it('updates input and propagates change through circuit', () => {
    const circuit = buildAndCircuit(0, 1)
    const result = updateGateInput(circuit, 'input_a', 0, 1)
    const andGate = findGateById(result.gates, 'and_gate')
    expect(andGate.output).toBe(1)
  })

  it('returns original circuit for unknown gate ID', () => {
    const circuit = buildAndCircuit()
    const result = updateGateInput(circuit, 'unknown_id', 0, 1)
    expect(result).toEqual(circuit)
  })
})

//    evaluateFullCircuit Tests 
describe('evaluateFullCircuit', () => {
  it('correctly evaluates AND circuit with inputs (1, 1)', () => {
    const circuit = buildAndCircuit(1, 1)
    const result = evaluateFullCircuit(circuit)
    const andGate = findGateById(result.gates, 'and_gate')
    expect(andGate.output).toBe(1)
  })

  it('correctly evaluates AND circuit with inputs (0, 1)', () => {
    const circuit = buildAndCircuit(0, 1)
    const result = evaluateFullCircuit(circuit)
    const andGate = findGateById(result.gates, 'and_gate')
    expect(andGate.output).toBe(0)
  })
})
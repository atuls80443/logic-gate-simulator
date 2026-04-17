
// Integration tests for the simulation engine.

import { describe, it, expect } from 'vitest'
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
  getGateOutput,
  runSimulation
} from '../../src/simulator/engine'

//      createCircuit Tests 
describe('createCircuit', () => {
  it('creates an empty circuit with no gates', () => {
    const circuit = createCircuit()
    expect(circuit.gates).toHaveLength(0)
  })
})

//      addGate Tests 
describe('addGate', () => {
  it('adds a new gate to the circuit', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'gate_001', 'AND', 2)
    expect(circuit.gates).toHaveLength(1)
    expect(circuit.gates[0].type).toBe('AND')
    expect(circuit.gates[0].id).toBe('gate_001')
  })

  it('initializes gate with all inputs set to 0', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'gate_001', 'AND', 2)
    expect(circuit.gates[0].inputs).toEqual([0, 0])
    expect(circuit.gates[0].output).toBe(0)
  })

  it('does not add duplicate gate with same ID', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'gate_001', 'AND', 2)
    circuit = addGate(circuit, 'gate_001', 'OR', 2)
    expect(circuit.gates).toHaveLength(1)
    expect(circuit.gates[0].type).toBe('AND')
  })

  it('adds multiple gates correctly', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'gate_001', 'AND', 2)
    circuit = addGate(circuit, 'gate_002', 'OR', 2)
    circuit = addGate(circuit, 'gate_003', 'NOT', 1)
    expect(circuit.gates).toHaveLength(3)
  })
})

//      removeGate Tests 
describe('removeGate', () => {
  it('removes a gate from the circuit', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'gate_001', 'AND', 2)
    circuit = removeGate(circuit, 'gate_001')
    expect(circuit.gates).toHaveLength(0)
  })

  it('removes connections pointing to the deleted gate', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'input_a', 'INPUT', 1)
    circuit = addGate(circuit, 'and_gate', 'AND', 2)
    circuit = connectGates(circuit, 'input_a', 'and_gate', 0)
    circuit = removeGate(circuit, 'and_gate')
    const inputGate = circuit.gates.find(g => g.id === 'input_a')
    expect(inputGate.connectedTo).toHaveLength(0)
  })
})

//      connectGates Tests 
describe('connectGates', () => {
  it('connects output of one gate to input of another', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'input_a', 'INPUT', 1)
    circuit = addGate(circuit, 'and_gate', 'AND', 2)
    circuit = connectGates(circuit, 'input_a', 'and_gate', 0)
    const inputGate = circuit.gates.find(g => g.id === 'input_a')
    expect(inputGate.connectedTo).toHaveLength(1)
    expect(inputGate.connectedTo[0].gateId).toBe('and_gate')
  })

  it('does not create duplicate connections', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'input_a', 'INPUT', 1)
    circuit = addGate(circuit, 'and_gate', 'AND', 2)
    circuit = connectGates(circuit, 'input_a', 'and_gate', 0)
    circuit = connectGates(circuit, 'input_a', 'and_gate', 0)
    const inputGate = circuit.gates.find(g => g.id === 'input_a')
    expect(inputGate.connectedTo).toHaveLength(1)
  })
})

//      toggleInput Tests 
describe('toggleInput', () => {
  it('toggles INPUT gate from 0 to 1', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'input_a', 'INPUT', 1)
    circuit = toggleInput(circuit, 'input_a')
    expect(getGateOutput(circuit, 'input_a')).toBe(1)
  })

  it('toggles INPUT gate from 1 back to 0', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'input_a', 'INPUT', 1)
    circuit = toggleInput(circuit, 'input_a')
    circuit = toggleInput(circuit, 'input_a')
    expect(getGateOutput(circuit, 'input_a')).toBe(0)
  })

  it('propagates toggle through connected AND gate', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'input_a', 'INPUT', 1)
    circuit = addGate(circuit, 'input_b', 'INPUT', 1)
    circuit = addGate(circuit, 'and_gate', 'AND', 2)
    circuit = connectGates(circuit, 'input_a', 'and_gate', 0)
    circuit = connectGates(circuit, 'input_b', 'and_gate', 1)
    circuit = toggleInput(circuit, 'input_a')
    circuit = toggleInput(circuit, 'input_b')
    expect(getGateOutput(circuit, 'and_gate')).toBe(1)
  })
})

//      setInputValue Tests 
describe('setInputValue', () => {
  it('sets INPUT gate to 1', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'input_a', 'INPUT', 1)
    circuit = setInputValue(circuit, 'input_a', 1)
    expect(getGateOutput(circuit, 'input_a')).toBe(1)
  })

  it('sets INPUT gate to 0', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'input_a', 'INPUT', 1)
    circuit = setInputValue(circuit, 'input_a', 1)
    circuit = setInputValue(circuit, 'input_a', 0)
    expect(getGateOutput(circuit, 'input_a')).toBe(0)
  })
})

//      resetCircuit Tests 
describe('resetCircuit', () => {
  it('resets all INPUT nodes to 0', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'input_a', 'INPUT', 1)
    circuit = addGate(circuit, 'input_b', 'INPUT', 1)
    circuit = toggleInput(circuit, 'input_a')
    circuit = toggleInput(circuit, 'input_b')
    circuit = resetCircuit(circuit)
    expect(getGateOutput(circuit, 'input_a')).toBe(0)
    expect(getGateOutput(circuit, 'input_b')).toBe(0)
  })

  it('does not remove gates after reset', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'input_a', 'INPUT', 1)
    circuit = addGate(circuit, 'and_gate', 'AND', 2)
    circuit = resetCircuit(circuit)
    expect(circuit.gates).toHaveLength(2)
  })
})

//      clearCircuit Tests 
describe('clearCircuit', () => {
  it('removes all gates from the circuit', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'input_a', 'INPUT', 1)
    circuit = addGate(circuit, 'and_gate', 'AND', 2)
    circuit = clearCircuit()
    expect(circuit.gates).toHaveLength(0)
  })
})

//      runSimulation Integration Test 
describe('runSimulation', () => {
  it('simulates full AND circuit correctly', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'input_a', 'INPUT', 1)
    circuit = addGate(circuit, 'input_b', 'INPUT', 1)
    circuit = addGate(circuit, 'and_gate', 'AND', 2)
    circuit = connectGates(circuit, 'input_a', 'and_gate', 0)
    circuit = connectGates(circuit, 'input_b', 'and_gate', 1)
    circuit = setInputValue(circuit, 'input_a', 1)
    circuit = setInputValue(circuit, 'input_b', 1)
    circuit = runSimulation(circuit)
    expect(getGateOutput(circuit, 'and_gate')).toBe(1)
  })

  it('simulates full XOR circuit correctly', () => {
    let circuit = createCircuit()
    circuit = addGate(circuit, 'input_a', 'INPUT', 1)
    circuit = addGate(circuit, 'input_b', 'INPUT', 1)
    circuit = addGate(circuit, 'xor_gate', 'XOR', 2)
    circuit = connectGates(circuit, 'input_a', 'xor_gate', 0)
    circuit = connectGates(circuit, 'input_b', 'xor_gate', 1)
    circuit = setInputValue(circuit, 'input_a', 1)
    circuit = setInputValue(circuit, 'input_b', 0)
    circuit = runSimulation(circuit)
    expect(getGateOutput(circuit, 'xor_gate')).toBe(1)
  })
})

describe('Mentor Tests: Reconvergent Fanout & Propagation', () => {
  it('propagates through a simple NOT chain', () => {
    let c = createCircuit()

    c = addGate(c, 'in1', 'INPUT', 1, { x: 0, y: 0 })
    c = addGate(c, 'not1', 'NOT', 1, { x: 100, y: 0 })
    c = addGate(c, 'not2', 'NOT', 1, { x: 200, y: 0 })
    c = addGate(c, 'out1', 'OUTPUT', 1, { x: 300, y: 0 })

    c = connectGates(c, 'in1', 'not1', 0)
    c = connectGates(c, 'not1', 'not2', 0)
    c = connectGates(c, 'not2', 'out1', 0)

    c = setInputValue(c, 'in1', 1)

    expect(getGateOutput(c, 'not1')).toBe(0)
    expect(getGateOutput(c, 'not2')).toBe(1)
    expect(getGateOutput(c, 'out1')).toBe(1)
  })

  it('handles reconvergent fanout (the critical bug)', () => {
    let c = createCircuit()

    c = addGate(c, 'inA', 'INPUT', 1, { x: 0, y: 0 })
    c = addGate(c, 'inB', 'INPUT', 1, { x: 0, y: 100 })
    c = addGate(c, 'and1', 'AND', 2, { x: 100, y: 0 })
    c = addGate(c, 'and2', 'AND', 2, { x: 100, y: 100 })
    c = addGate(c, 'and3', 'AND', 2, { x: 200, y: 50 })
    c = addGate(c, 'out1', 'OUTPUT', 1, { x: 300, y: 50 })

    c = connectGates(c, 'inA', 'and1', 0)
    c = connectGates(c, 'inA', 'and2', 0)
    c = connectGates(c, 'inB', 'and1', 1)
    c = connectGates(c, 'inB', 'and2', 1)
    c = connectGates(c, 'and1', 'and3', 0)
    c = connectGates(c, 'and2', 'and3', 1)
    c = connectGates(c, 'and3', 'out1', 0)

    c = setInputValue(c, 'inA', 1)
    c = setInputValue(c, 'inB', 1)

    expect(getGateOutput(c, 'and1')).toBe(1)
    expect(getGateOutput(c, 'and2')).toBe(1)
    expect(getGateOutput(c, 'and3')).toBe(1)
    expect(getGateOutput(c, 'out1')).toBe(1)

    c = setInputValue(c, 'inA', 0)
    expect(getGateOutput(c, 'and3')).toBe(0)
    expect(getGateOutput(c, 'out1')).toBe(0)
  })

  it('catches oscillating feedback loops without crashing', () => {
    let c = createCircuit()

    c = addGate(c, 'in1', 'INPUT', 1, { x: 0, y: 0 })
    c = addGate(c, 'not1', 'NOT', 1, { x: 100, y: 0 })

    c = connectGates(c, 'in1', 'not1', 0)
    c = connectGates(c, 'not1', 'not1', 0)

    expect(() => setInputValue(c, 'in1', 1)).not.toThrow()
  })

  it('resets all inputs to 0 and clears outputs', () => {
    let c = createCircuit()

    c = addGate(c, 'in1', 'INPUT', 1, { x: 0, y: 0 })
    c = addGate(c, 'in2', 'INPUT', 1, { x: 0, y: 100 })
    c = addGate(c, 'and1', 'AND', 2, { x: 100, y: 0 })
    c = addGate(c, 'out1', 'OUTPUT', 1, { x: 200, y: 0 })

    c = connectGates(c, 'in1', 'and1', 0)
    c = connectGates(c, 'in2', 'and1', 1)
    c = connectGates(c, 'and1', 'out1', 0)

    c = setInputValue(c, 'in1', 1)
    c = setInputValue(c, 'in2', 1)
    expect(getGateOutput(c, 'out1')).toBe(1)

    c = resetCircuit(c)
    expect(getGateOutput(c, 'out1')).toBe(0)
    expect(getGateOutput(c, 'in1')).toBe(0)
    expect(getGateOutput(c, 'in2')).toBe(0)
  })
})
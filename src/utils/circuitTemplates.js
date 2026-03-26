/**
 * circuitTemplates.js
 *
 * WHY THIS FILE EXISTS:
 * Provides pre-built circuit configurations so users can
 * instantly load complete circuits without manual wiring.
 *
 * Each template is a FACTORY FUNCTION that returns a fresh
 * circuit object with unique gate IDs on every call.
 *
 * WHY FACTORY FUNCTIONS instead of plain objects:
 * Plain objects are shared references — loading the same
 * template twice would cause ID conflicts and break the circuit.
 * Factory functions create a NEW object with NEW IDs each call.
 *
 * STRUCTURE of each template:
 * {
 *   name:        display name shown in UI
 *   description: what this circuit does
 *   gates:       array of gate objects matching engine format
 * }
 */

import { generateUniqueGateId } from './idGenerator'
import { GATE_TYPES }           from './constants'

// ─── Half Adder Template ──────────────────────────────────────────────────────
/**
 * WHY HALF ADDER:
 * Simplest multi-output combinational circuit.
 * Demonstrates XOR + AND working together.
 * Teaches carry generation concept.
 *
 * CIRCUIT:
 * INPUT_A ──┬──► XOR ──► OUTPUT_SUM
 *           └──► AND ──► OUTPUT_CARRY
 * INPUT_B ──┘
 */
export function createHalfAdderTemplate() {
  // WHY generate IDs here: ensures unique IDs every time
  // template is loaded — prevents conflicts if loaded twice
  const inputA  = generateUniqueGateId(GATE_TYPES.INPUT, [ ])
  const inputB  = generateUniqueGateId(GATE_TYPES.INPUT, [ ])
  const xorGate = generateUniqueGateId(GATE_TYPES.XOR, [ ])
  const andGate = generateUniqueGateId(GATE_TYPES.AND, [ ])
  const outSum  = generateUniqueGateId(GATE_TYPES.OUTPUT, [ ])
  const outCarry = generateUniqueGateId(GATE_TYPES.OUTPUT, [ ])

  return {
    name: 'Half Adder',
    description: 'Adds two bits. Outputs Sum (XOR) and Carry (AND).',
    gates: [
      {
        id: inputA,
        type: GATE_TYPES.INPUT,
        inputs: [0],
        output: 0,
        // WHY these positions: clean left-to-right layout
        // mirrors how circuits are drawn on paper
        position: { x: 100, y: 150 },
        connectedTo: [
          // WHY connect to both XOR and AND:
          // both gates need both inputs for half adder
          { gateId: xorGate, inputIndex: 0 },
          { gateId: andGate, inputIndex: 0 },
        ]
      },
      {
        id: inputB,
        type: GATE_TYPES.INPUT,
        inputs: [0],
        output: 0,
        position: { x: 100, y: 280 },
        connectedTo: [
          { gateId: xorGate, inputIndex: 1 },
          { gateId: andGate, inputIndex: 1 },
        ]
      },
      {
        id: xorGate,
        type: GATE_TYPES.XOR,
        inputs: [0, 0],
        output: 0,
        position: { x: 320, y: 150 },
        connectedTo: [
          { gateId: outSum, inputIndex: 0 }
        ]
      },
      {
        id: andGate,
        type: GATE_TYPES.AND,
        inputs: [0, 0],
        output: 0,
        position: { x: 320, y: 280 },
        connectedTo: [
          { gateId: outCarry, inputIndex: 0 }
        ]
      },
      {
        id: outSum,
        type: GATE_TYPES.OUTPUT,
        inputs: [0],
        output: 0,
        position: { x: 540, y: 150 },
        connectedTo: []
      },
      {
        id: outCarry,
        type: GATE_TYPES.OUTPUT,
        inputs: [0],
        output: 0,
        position: { x: 540, y: 280 },
        connectedTo: []
      },
    ]
  }
}

// ─── Full Adder Template ──────────────────────────────────────────────────────
/**
 * WHY FULL ADDER:
 * Adds three bits (A, B, Carry-in).
 * Foundation of multi-bit arithmetic in CPUs.
 * Shows how Half Adders chain together.
 *
 * CIRCUIT:
 * A, B ──► XOR1 ──┬──► XOR2 ──► SUM
 *                 └──► AND2 ──┐
 * A, B ──► AND1 ──────────────┴──► OR ──► COUT
 * CIN ──► XOR2, AND2
 */
export function createFullAdderTemplate() {
  const inputA  = generateUniqueGateId(GATE_TYPES.INPUT, [ ])
  const inputB  = generateUniqueGateId(GATE_TYPES.INPUT, [ ])
  const inputCin = generateUniqueGateId(GATE_TYPES.INPUT, [ ])
  const xor1    = generateUniqueGateId(GATE_TYPES.XOR, [ ])
  const xor2    = generateUniqueGateId(GATE_TYPES.XOR, [ ])
  const and1    = generateUniqueGateId(GATE_TYPES.AND, [ ])
  const and2    = generateUniqueGateId(GATE_TYPES.AND, [ ])
  const orGate  = generateUniqueGateId(GATE_TYPES.OR, [ ])
  const outSum  = generateUniqueGateId(GATE_TYPES.OUTPUT, [ ])
  const outCout = generateUniqueGateId(GATE_TYPES.OUTPUT, [ ])

  return {
    name: 'Full Adder',
    description: 'Adds three bits (A, B, Carry-in). Outputs Sum and Carry-out.',
    gates: [
      {
        id: inputA,
        type: GATE_TYPES.INPUT,
        inputs: [0], output: 0,
        position: { x: 80, y: 120 },
        connectedTo: [
          { gateId: xor1, inputIndex: 0 },
          { gateId: and1, inputIndex: 0 },
        ]
      },
      {
        id: inputB,
        type: GATE_TYPES.INPUT,
        inputs: [0], output: 0,
        position: { x: 80, y: 240 },
        connectedTo: [
          { gateId: xor1, inputIndex: 1 },
          { gateId: and1, inputIndex: 1 },
        ]
      },
      {
        id: inputCin,
        type: GATE_TYPES.INPUT,
        inputs: [0], output: 0,
        position: { x: 80, y: 360 },
        connectedTo: [
          { gateId: xor2, inputIndex: 1 },
          { gateId: and2, inputIndex: 1 },
        ]
      },
      {
        id: xor1,
        type: GATE_TYPES.XOR,
        inputs: [0, 0], output: 0,
        position: { x: 280, y: 160 },
        connectedTo: [
          { gateId: xor2, inputIndex: 0 },
          { gateId: and2, inputIndex: 0 },
        ]
      },
      {
        id: and1,
        type: GATE_TYPES.AND,
        inputs: [0, 0], output: 0,
        position: { x: 280, y: 320 },
        connectedTo: [
          { gateId: orGate, inputIndex: 0 }
        ]
      },
      {
        id: xor2,
        type: GATE_TYPES.XOR,
        inputs: [0, 0], output: 0,
        position: { x: 480, y: 160 },
        connectedTo: [
          { gateId: outSum, inputIndex: 0 }
        ]
      },
      {
        id: and2,
        type: GATE_TYPES.AND,
        inputs: [0, 0], output: 0,
        position: { x: 480, y: 280 },
        connectedTo: [
          { gateId: orGate, inputIndex: 1 }
        ]
      },
      {
        id: orGate,
        type: GATE_TYPES.OR,
        inputs: [0, 0], output: 0,
        position: { x: 640, y: 300 },
        connectedTo: [
          { gateId: outCout, inputIndex: 0 }
        ]
      },
      {
        id: outSum,
        type: GATE_TYPES.OUTPUT,
        inputs: [0], output: 0,
        position: { x: 700, y: 160 },
        connectedTo: []
      },
      {
        id: outCout,
        type: GATE_TYPES.OUTPUT,
        inputs: [0], output: 0,
        position: { x: 800, y: 300 },
        connectedTo: []
      },
    ]
  }
}

// ─── 2-to-1 Multiplexer Template ─────────────────────────────────────────────
/**
 * WHY MUX:
 * Shows how select signals control data routing.
 * Demonstrates NOT gate usage in practical circuit.
 */
export function createMuxTemplate() {
  const inputD0  = generateUniqueGateId(GATE_TYPES.INPUT, [ ])
  const inputD1  = generateUniqueGateId(GATE_TYPES.INPUT, [ ])
  const inputS   = generateUniqueGateId(GATE_TYPES.INPUT, [ ])
  const notGate  = generateUniqueGateId(GATE_TYPES.NOT, [ ])
  const and1     = generateUniqueGateId(GATE_TYPES.AND, [ ])
  const and2     = generateUniqueGateId(GATE_TYPES.AND, [ ])
  const orGate   = generateUniqueGateId(GATE_TYPES.OR, [ ])
  const output   = generateUniqueGateId(GATE_TYPES.OUTPUT, [ ])

  return {
    name: '2-to-1 MUX',
    description: 'Selects D0 when S=0, selects D1 when S=1.',
    gates: [
      {
        id: inputD0,
        type: GATE_TYPES.INPUT,
        inputs: [0], output: 0,
        position: { x: 80, y: 100 },
        connectedTo: [{ gateId: and1, inputIndex: 0 }]
      },
      {
        id: inputD1,
        type: GATE_TYPES.INPUT,
        inputs: [0], output: 0,
        position: { x: 80, y: 300 },
        connectedTo: [{ gateId: and2, inputIndex: 0 }]
      },
      {
        id: inputS,
        type: GATE_TYPES.INPUT,
        inputs: [0], output: 0,
        position: { x: 80, y: 200 },
        connectedTo: [
          { gateId: notGate, inputIndex: 0 },
          { gateId: and2,    inputIndex: 1 },
        ]
      },
      {
        id: notGate,
        type: GATE_TYPES.NOT,
        inputs: [0], output: 0,
        position: { x: 260, y: 160 },
        connectedTo: [{ gateId: and1, inputIndex: 1 }]
      },
      {
        id: and1,
        type: GATE_TYPES.AND,
        inputs: [0, 0], output: 0,
        position: { x: 420, y: 120 },
        connectedTo: [{ gateId: orGate, inputIndex: 0 }]
      },
      {
        id: and2,
        type: GATE_TYPES.AND,
        inputs: [0, 0], output: 0,
        position: { x: 420, y: 280 },
        connectedTo: [{ gateId: orGate, inputIndex: 1 }]
      },
      {
        id: orGate,
        type: GATE_TYPES.OR,
        inputs: [0, 0], output: 0,
        position: { x: 580, y: 200 },
        connectedTo: [{ gateId: output, inputIndex: 0 }]
      },
      {
        id: output,
        type: GATE_TYPES.OUTPUT,
        inputs: [0], output: 0,
        position: { x: 720, y: 200 },
        connectedTo: []
      },
    ]
  }
}

// ─── 2-to-4 Decoder Template ──────────────────────────────────────────────────
export function createDecoderTemplate() {
  const inputA  = generateUniqueGateId(GATE_TYPES.INPUT, [ ])
  const inputB  = generateUniqueGateId(GATE_TYPES.INPUT, [ ])
  const notA    = generateUniqueGateId(GATE_TYPES.NOT, [ ])
  const notB    = generateUniqueGateId(GATE_TYPES.NOT, [ ])
  const and0    = generateUniqueGateId(GATE_TYPES.AND, [ ])
  const and1    = generateUniqueGateId(GATE_TYPES.AND, [ ])
  const and2    = generateUniqueGateId(GATE_TYPES.AND, [ ])
  const and3    = generateUniqueGateId(GATE_TYPES.AND, [ ])
  const out0    = generateUniqueGateId(GATE_TYPES.OUTPUT, [ ])
  const out1    = generateUniqueGateId(GATE_TYPES.OUTPUT, [ ])
  const out2    = generateUniqueGateId(GATE_TYPES.OUTPUT, [ ])
  const out3    = generateUniqueGateId(GATE_TYPES.OUTPUT, [ ])

  return {
    name: '2-to-4 Decoder',
    description: 'Converts 2-bit input to one-hot 4-bit output.',
    gates: [
      {
        id: inputA,
        type: GATE_TYPES.INPUT,
        inputs: [0], output: 0,
        position: { x: 80, y: 180 },
        connectedTo: [
          { gateId: notA,  inputIndex: 0 },
          { gateId: and2,  inputIndex: 0 },
          { gateId: and3,  inputIndex: 0 },
        ]
      },
      {
        id: inputB,
        type: GATE_TYPES.INPUT,
        inputs: [0], output: 0,
        position: { x: 80, y: 300 },
        connectedTo: [
          { gateId: notB,  inputIndex: 0 },
          { gateId: and1,  inputIndex: 1 },
          { gateId: and3,  inputIndex: 1 },
        ]
      },
      {
        id: notA,
        type: GATE_TYPES.NOT,
        inputs: [0], output: 0,
        position: { x: 240, y: 120 },
        connectedTo: [
          { gateId: and0, inputIndex: 0 },
          { gateId: and1, inputIndex: 0 },
        ]
      },
      {
        id: notB,
        type: GATE_TYPES.NOT,
        inputs: [0], output: 0,
        position: { x: 240, y: 360 },
        connectedTo: [
          { gateId: and0, inputIndex: 1 },
          { gateId: and2, inputIndex: 1 },
        ]
      },
      {
        id: and0,
        type: GATE_TYPES.AND,
        inputs: [0, 0], output: 0,
        position: { x: 420, y: 80 },
        connectedTo: [{ gateId: out0, inputIndex: 0 }]
      },
      {
        id: and1,
        type: GATE_TYPES.AND,
        inputs: [0, 0], output: 0,
        position: { x: 420, y: 200 },
        connectedTo: [{ gateId: out1, inputIndex: 0 }]
      },
      {
        id: and2,
        type: GATE_TYPES.AND,
        inputs: [0, 0], output: 0,
        position: { x: 420, y: 320 },
        connectedTo: [{ gateId: out2, inputIndex: 0 }]
      },
      {
        id: and3,
        type: GATE_TYPES.AND,
        inputs: [0, 0], output: 0,
        position: { x: 420, y: 440 },
        connectedTo: [{ gateId: out3, inputIndex: 0 }]
      },
      {
        id: out0,
        type: GATE_TYPES.OUTPUT,
        inputs: [0], output: 0,
        position: { x: 600, y: 80 },
        connectedTo: []
      },
      {
        id: out1,
        type: GATE_TYPES.OUTPUT,
        inputs: [0], output: 0,
        position: { x: 600, y: 200 },
        connectedTo: []
      },
      {
        id: out2,
        type: GATE_TYPES.OUTPUT,
        inputs: [0], output: 0,
        position: { x: 600, y: 320 },
        connectedTo: []
      },
      {
        id: out3,
        type: GATE_TYPES.OUTPUT,
        inputs: [0], output: 0,
        position: { x: 600, y: 440 },
        connectedTo: []
      },
    ]
  }
}

// ─── Template Registry ────────────────────────────────────────────────────────
/**
 * WHY A REGISTRY:
 * Single place to look up all available templates.
 * Toolbar reads this to build the templates section.
 * Adding a new template = adding one entry here.
 * Nothing else needs to change.
 *
 * This is the DISPATCHER PATTERN again —
 * same pattern as evaluateGate and GateNode.
 */
export const CIRCUIT_TEMPLATES = [
  {
    id:      'half-adder',
    name:    'Half Adder',
    create:  createHalfAdderTemplate,
  },
  {
    id:      'full-adder',
    name:    'Full Adder',
    create:  createFullAdderTemplate,
  },
  {
    id:      'mux-2to1',
    name:    '2-to-1 MUX',
    create:  createMuxTemplate,
  },
  {
    id:      'decoder-2to4',
    name:    '2-to-4 Decoder',
    create:  createDecoderTemplate,
  },
]
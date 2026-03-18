/**
 * Unit tests for all Boolean logic gate functions.
 * Every possible input combination is tested.
 * If any test fails, the simulation engine CANNOT be trusted.
 */

import { describe, it, expect } from 'vitest'
import {
  AND,
  OR,
  NOT,
  NAND,
  NOR,
  XOR,
  XNOR,
  evaluateGate
} from '../../src/simulator/gateLogic'

// ─── AND Gate Tests ───────────────────────────────────────────────────────────
describe('AND Gate', () => {
  it('returns 0 for AND(0, 0)', () => {
    expect(AND([0, 0])).toBe(0)
  })
  it('returns 0 for AND(0, 1)', () => {
    expect(AND([0, 1])).toBe(0)
  })
  it('returns 0 for AND(1, 0)', () => {
    expect(AND([1, 0])).toBe(0)
  })
  it('returns 1 for AND(1, 1)', () => {
    expect(AND([1, 1])).toBe(1)
  })
  it('returns 1 for 3-input AND(1, 1, 1)', () => {
    expect(AND([1, 1, 1])).toBe(1)
  })
  it('returns 0 for 3-input AND(1, 1, 0)', () => {
    expect(AND([1, 1, 0])).toBe(0)
  })
})

// ─── OR Gate Tests ────────────────────────────────────────────────────────────
describe('OR Gate', () => {
  it('returns 0 for OR(0, 0)', () => {
    expect(OR([0, 0])).toBe(0)
  })
  it('returns 1 for OR(0, 1)', () => {
    expect(OR([0, 1])).toBe(1)
  })
  it('returns 1 for OR(1, 0)', () => {
    expect(OR([1, 0])).toBe(1)
  })
  it('returns 1 for OR(1, 1)', () => {
    expect(OR([1, 1])).toBe(1)
  })
  it('returns 1 for 3-input OR(0, 0, 1)', () => {
    expect(OR([0, 0, 1])).toBe(1)
  })
  it('returns 0 for 3-input OR(0, 0, 0)', () => {
    expect(OR([0, 0, 0])).toBe(0)
  })
})

// ─── NOT Gate Tests ───────────────────────────────────────────────────────────
describe('NOT Gate', () => {
  it('returns 1 for NOT(0)', () => {
    expect(NOT([0])).toBe(1)
  })
  it('returns 0 for NOT(1)', () => {
    expect(NOT([1])).toBe(0)
  })
  it('returns 0 for invalid input count', () => {
    expect(NOT([1, 0])).toBe(0)
  })
})

// ─── NAND Gate Tests ──────────────────────────────────────────────────────────
describe('NAND Gate', () => {
  it('returns 1 for NAND(0, 0)', () => {
    expect(NAND([0, 0])).toBe(1)
  })
  it('returns 1 for NAND(0, 1)', () => {
    expect(NAND([0, 1])).toBe(1)
  })
  it('returns 1 for NAND(1, 0)', () => {
    expect(NAND([1, 0])).toBe(1)
  })
  it('returns 0 for NAND(1, 1)', () => {
    expect(NAND([1, 1])).toBe(0)
  })
})

// ─── NOR Gate Tests ───────────────────────────────────────────────────────────
describe('NOR Gate', () => {
  it('returns 1 for NOR(0, 0)', () => {
    expect(NOR([0, 0])).toBe(1)
  })
  it('returns 0 for NOR(0, 1)', () => {
    expect(NOR([0, 1])).toBe(0)
  })
  it('returns 0 for NOR(1, 0)', () => {
    expect(NOR([1, 0])).toBe(0)
  })
  it('returns 0 for NOR(1, 1)', () => {
    expect(NOR([1, 1])).toBe(0)
  })
})

// ─── XOR Gate Tests ───────────────────────────────────────────────────────────
describe('XOR Gate', () => {
  it('returns 0 for XOR(0, 0)', () => {
    expect(XOR([0, 0])).toBe(0)
  })
  it('returns 1 for XOR(0, 1)', () => {
    expect(XOR([0, 1])).toBe(1)
  })
  it('returns 1 for XOR(1, 0)', () => {
    expect(XOR([1, 0])).toBe(1)
  })
  it('returns 0 for XOR(1, 1)', () => {
    expect(XOR([1, 1])).toBe(0)
  })
})

// ─── XNOR Gate Tests ──────────────────────────────────────────────────────────
describe('XNOR Gate', () => {
  it('returns 1 for XNOR(0, 0)', () => {
    expect(XNOR([0, 0])).toBe(1)
  })
  it('returns 0 for XNOR(0, 1)', () => {
    expect(XNOR([0, 1])).toBe(0)
  })
  it('returns 0 for XNOR(1, 0)', () => {
    expect(XNOR([1, 0])).toBe(0)
  })
  it('returns 1 for XNOR(1, 1)', () => {
    expect(XNOR([1, 1])).toBe(1)
  })
})

// ─── evaluateGate Dispatcher Tests ───────────────────────────────────────────
describe('evaluateGate dispatcher', () => {
  it('correctly dispatches AND gate', () => {
    expect(evaluateGate('AND', [1, 1])).toBe(1)
  })
  it('correctly dispatches OR gate', () => {
    expect(evaluateGate('OR', [0, 1])).toBe(1)
  })
  it('correctly dispatches NOT gate', () => {
    expect(evaluateGate('NOT', [1])).toBe(0)
  })
  it('correctly dispatches NAND gate', () => {
    expect(evaluateGate('NAND', [1, 1])).toBe(0)
  })
  it('correctly dispatches NOR gate', () => {
    expect(evaluateGate('NOR', [0, 0])).toBe(1)
  })
  it('correctly dispatches XOR gate', () => {
    expect(evaluateGate('XOR', [1, 0])).toBe(1)
  })
  it('correctly dispatches XNOR gate', () => {
    expect(evaluateGate('XNOR', [1, 1])).toBe(1)
  })
  it('returns 0 for unknown gate type', () => {
    expect(evaluateGate('UNKNOWN', [1, 1])).toBe(0)
  })
})
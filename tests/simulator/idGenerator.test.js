
//  Tests for unique ID generation functions.

import { describe, it, expect } from 'vitest'
import {
  generateGateId,
  generateWireId,
  isUniqueId,
  generateUniqueGateId
} from '../../src/utils/idGenerator'

//      generateGateId Tests 
describe('generateGateId', () => {
  it('generates an ID containing the gate type prefix', () => {
    const id = generateGateId('AND')
    expect(id.startsWith('and_')).toBe(true)
  })

  it('generates an ID for INPUT gate', () => {
    const id = generateGateId('INPUT')
    expect(id.startsWith('input_')).toBe(true)
  })

  it('generates an ID for XOR gate', () => {
    const id = generateGateId('XOR')
    expect(id.startsWith('xor_')).toBe(true)
  })

  it('generates unique IDs on every call', () => {
    const id1 = generateGateId('AND')
    const id2 = generateGateId('AND')
    expect(id1).not.toBe(id2)
  })

  it('generates an ID with correct length', () => {
    const id = generateGateId('AND')
    // 'and_' (4 chars) + 6 random chars = 10 minimum
    expect(id.length).toBeGreaterThanOrEqual(10)
  })

  it('returns a fallback ID when called without gateType', () => {
    const id = generateGateId('')
    expect(id.startsWith('gate_')).toBe(true)
  })
})

//      generateWireId Tests 
describe('generateWireId', () => {
  it('generates a wire ID containing both gate IDs', () => {
    const id = generateWireId('input_a1b2', 'and_c3d4')
    expect(id).toContain('input_a1b2')
    expect(id).toContain('and_c3d4')
  })

  it('generates a wire ID starting with wire_', () => {
    const id = generateWireId('input_a1b2', 'and_c3d4')
    expect(id.startsWith('wire_')).toBe(true)
  })

  it('generates unique wire IDs on every call', () => {
    const id1 = generateWireId('input_a1b2', 'and_c3d4')
    const id2 = generateWireId('input_a1b2', 'and_c3d4')
    expect(id1).not.toBe(id2)
  })
})

//      isUniqueId Tests 
describe('isUniqueId', () => {
  it('returns true when ID does not exist in gates', () => {
    const gates = [{ id: 'and_abc123' }, { id: 'or_xyz789' }]
    expect(isUniqueId('input_new123', gates)).toBe(true)
  })

  it('returns false when ID already exists in gates', () => {
    const gates = [{ id: 'and_abc123' }, { id: 'or_xyz789' }]
    expect(isUniqueId('and_abc123', gates)).toBe(false)
  })

  it('returns true for empty gates array', () => {
    expect(isUniqueId('and_abc123', [])).toBe(true)
  })
})

//      generateUniqueGateId Tests 
describe('generateUniqueGateId', () => {
  it('generates a unique ID not present in existing gates', () => {
    const gates = [
      { id: 'and_abc123' },
      { id: 'or_xyz789' }
    ]
    const id = generateUniqueGateId('AND', gates)
    expect(isUniqueId(id, gates)).toBe(true)
  })

  it('generated ID starts with correct gate type prefix', () => {
    const id = generateUniqueGateId('NAND', [])
    expect(id.startsWith('nand_')).toBe(true)
  })

  it('generates unique IDs for multiple gates', () => {
    const gates = []
    const ids = new Set()

    for (let i = 0; i < 10; i++) {
      const id = generateUniqueGateId('AND', gates)
      ids.add(id)
      gates.push({ id })
    }

    // All 10 IDs must be unique
    expect(ids.size).toBe(10)
  })
})
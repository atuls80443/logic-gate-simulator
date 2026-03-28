
import { describe, it, expect } from 'vitest'
import {
  srLatch,
  dLatch,
  dFlipFlop,
  tFlipFlop,
  register4bit,
  rippleCounter4bit
} from '../../src/simulator/sequential'

//    SR Latch Tests 
describe('SR Latch', () => {

  // Basic Operations 
  it('S=1,R=0 sets Q to 1', () => {
    const state = srLatch(1, 0, { q: 0, qBar: 1 })
    expect(state.q).toBe(1)
    expect(state.qBar).toBe(0)
    expect(state.forbidden).toBe(false)
  })

  it('S=0,R=1 resets Q to 0', () => {
    const state = srLatch(0, 1, { q: 1, qBar: 0 })
    expect(state.q).toBe(0)
    expect(state.qBar).toBe(1)
  })

  it('S=0,R=0 holds Q=1 from previous state', () => {
    const state = srLatch(0, 0, { q: 1, qBar: 0 })
    expect(state.q).toBe(1)
  })

  it('S=0,R=0 holds Q=0 from previous state', () => {
    const state = srLatch(0, 0, { q: 0, qBar: 1 })
    expect(state.q).toBe(0)
  })

  // Forbidden State 
  it('S=1,R=1 flags forbidden state', () => {
    const state = srLatch(1, 1, { q: 0, qBar: 1 })
    expect(state.forbidden).toBe(true)
  })

  it('S=1,R=1 forces both outputs to 0', () => {
    const state = srLatch(1, 1, { q: 1, qBar: 0 })
    expect(state.q).toBe(0)
    expect(state.qBar).toBe(0)
  })

  // Recovery After Forbidden State 
  it('recovers to SET state after forbidden state', () => {
    // Enter forbidden state
    let state = srLatch(1, 1, { q: 0, qBar: 1 })
    expect(state.forbidden).toBe(true)

    // Recover by setting S=1,R=0
    state = srLatch(1, 0, { q: state.q, qBar: state.qBar })
    expect(state.q).toBe(1)
    expect(state.forbidden).toBe(false)
  })

  it('recovers to RESET state after forbidden state', () => {
    let state = srLatch(1, 1, { q: 1, qBar: 0 })
    expect(state.forbidden).toBe(true)

    // Recover by resetting R=1,S=0
    state = srLatch(0, 1, { q: state.q, qBar: state.qBar })
    expect(state.q).toBe(0)
    expect(state.forbidden).toBe(false)
  })

  // Memory Sequence 
  it('demonstrates full set-hold-reset-hold sequence', () => {
    // Set
    let state = srLatch(1, 0, { q: 0, qBar: 1 })
    expect(state.q).toBe(1)

    // Hold 
    state = srLatch(0, 0, state)
    expect(state.q).toBe(1)

    // Reset
    state = srLatch(0, 1, state)
    expect(state.q).toBe(0)

    // Hold — memory working
    state = srLatch(0, 0, state)
    expect(state.q).toBe(0)
  })

  // Input Validation 
  it('throws error for invalid input value', () => {
    expect(() => srLatch(2, 0, { q: 0, qBar: 1 }))
      .toThrow('Invalid input')
  })

  // Iterative Stabilization 
  it('reaches stable state after SET', () => {
    const state = srLatch(1, 0, { q: 0, qBar: 1 })
    expect(state.stable).toBe(true)
  })

  it('reaches stable state after RESET', () => {
    const state = srLatch(0, 1, { q: 1, qBar: 0 })
    expect(state.stable).toBe(true)
  })
})

// D Latch Tests 
describe('D Latch', () => {
  it('captures D=1 when enable=1', () => {
    const state = dLatch(1, 1, { q: 0, qBar: 1 })
    expect(state.q).toBe(1)
    expect(state.qBar).toBe(0)
  })

  it('captures D=0 when enable=1', () => {
    const state = dLatch(0, 1, { q: 1, qBar: 0 })
    expect(state.q).toBe(0)
  })

  it('holds Q=1 when enable=0 even if D=0', () => {
    const state = dLatch(0, 0, { q: 1, qBar: 0 })
    expect(state.q).toBe(1)
  })

  it('holds Q=0 when enable=0 even if D=1', () => {
    const state = dLatch(1, 0, { q: 0, qBar: 1 })
    expect(state.q).toBe(0)
  })

  it('throws error for invalid input', () => {
    expect(() => dLatch(2, 1, { q: 0, qBar: 1 }))
      .toThrow('Invalid input')
  })
})

//    D Flip-Flop Tests 
describe('D Flip-Flop', () => {

  // Rising Edge Capture 
  it('captures D=1 on rising clock edge (0→1)', () => {
    const state = dFlipFlop(1, 1, { q: 0, qBar: 1, prevClk: 0 })
    expect(state.q).toBe(1)
  })

  it('captures D=0 on rising clock edge (0→1)', () => {
    const state = dFlipFlop(0, 1, { q: 1, qBar: 0, prevClk: 0 })
    expect(state.q).toBe(0)
  })

  // Hold State 
  it('holds value when CLK stays HIGH (no rising edge)', () => {
    // prevClk=1, clk=1 → no rising edge → D=1 ignored
    const state = dFlipFlop(1, 1, { q: 0, qBar: 1, prevClk: 1 })
    expect(state.q).toBe(0)
  })

  it('holds value when CLK is LOW', () => {
    const state = dFlipFlop(1, 0, { q: 0, qBar: 1, prevClk: 0 })
    expect(state.q).toBe(0)
  })

  it('holds value on falling edge (1→0)', () => {
    // prevClk=1, clk=0 → falling edge → not triggered
    const state = dFlipFlop(1, 0, { q: 0, qBar: 1, prevClk: 1 })
    expect(state.q).toBe(0)
  })

  // Rapid Clock Toggling 
  it('handles rapid clock toggling correctly', () => {
    let state = { q: 0, qBar: 1, prevClk: 0 }

    // Cycle 1: D=1, rising edge → capture 1
    state = dFlipFlop(1, 1, state)
    expect(state.q).toBe(1)

    // Cycle 1: falling edge → hold
    state = dFlipFlop(1, 0, state)
    expect(state.q).toBe(1)

    // Cycle 2: D changes to 0, rising edge → capture 0
    state = dFlipFlop(0, 1, state)
    expect(state.q).toBe(0)

    // Cycle 2: falling edge → hold
    state = dFlipFlop(0, 0, state)
    expect(state.q).toBe(0)

    // Cycle 3: D=1 again, rising edge → capture 1
    state = dFlipFlop(1, 1, state)
    expect(state.q).toBe(1)
  })

  // Multiple Clock Cycles 
  it('correctly tracks state across 5 clock cycles', () => {
    let state = { q: 0, qBar: 1, prevClk: 0 }
    const dInputs = [1, 0, 1, 1, 0]
    const expected = [1, 0, 1, 1, 0]

    dInputs.forEach((d, i) => {
      state = dFlipFlop(d, 1, state)  // rising edge
      expect(state.q).toBe(expected[i])
      state = dFlipFlop(d, 0, state)  // falling edge
    })
  })

  // Input Validation 
  it('throws error for invalid D input', () => {
    expect(() => dFlipFlop(2, 1, { q: 0, qBar: 1, prevClk: 0 }))
      .toThrow('Invalid input')
  })

  it('throws error for invalid CLK input', () => {
    expect(() => dFlipFlop(1, 5, { q: 0, qBar: 1, prevClk: 0 }))
      .toThrow('Invalid input')
  })
})

//      T Flip-Flop Tests 
describe('T Flip-Flop', () => {
  it('toggles Q from 0 to 1 on rising edge with T=1', () => {
    const state = tFlipFlop(1, 1, { q: 0, qBar: 1, prevClk: 0 })
    expect(state.q).toBe(1)
  })

  it('toggles Q from 1 to 0 on next rising edge', () => {
    let state = { q: 0, qBar: 1, prevClk: 0 }
    state = tFlipFlop(1, 1, state)  // toggle → 1
    state = tFlipFlop(1, 0, state)  // falling edge
    state = tFlipFlop(1, 1, state)  // toggle → 0
    expect(state.q).toBe(0)
  })

  it('holds Q when T=0 on rising edge', () => {
    const state = tFlipFlop(0, 1, { q: 1, qBar: 0, prevClk: 0 })
    expect(state.q).toBe(1)
  })

  it('does not toggle on falling edge', () => {
    const state = tFlipFlop(1, 0, { q: 0, qBar: 1, prevClk: 1 })
    expect(state.q).toBe(0)
  })

  //      Rapid Toggling 
  it('toggles correctly across 4 rapid clock cycles', () => {
    let state = { q: 0, qBar: 1, prevClk: 0 }
    const expected = [1, 0, 1, 0]

    expected.forEach(exp => {
      state = tFlipFlop(1, 1, state)  // rising
      expect(state.q).toBe(exp)
      state = tFlipFlop(1, 0, state)  // falling
    })
  })

  it('throws error for invalid input', () => {
    expect(() => tFlipFlop(2, 1, { q: 0, qBar: 1, prevClk: 0 }))
      .toThrow('Invalid input')
  })
})

//      4-bit Register Tests 
describe('4-bit Register', () => {
  it('captures 4 bits on rising clock edge', () => {
    const prevStates = Array(4).fill({ q: 0, qBar: 1, prevClk: 0 })
    const result = register4bit([1, 0, 1, 1], 1, prevStates)
    expect(result.bits).toEqual([1, 0, 1, 1])
  })

  it('holds all bits when CLK stays HIGH (no rising edge)', () => {
    let prevStates = Array(4).fill({ q: 0, qBar: 1, prevClk: 0 })
    let result = register4bit([1, 0, 1, 1], 1, prevStates)
    // WHY: no rising edge — CLK was already 1
    result = register4bit([0, 0, 0, 0], 1, result.prevStates)
    expect(result.bits).toEqual([1, 0, 1, 1])
  })

  it('updates on second rising edge', () => {
    let prevStates = Array(4).fill({ q: 0, qBar: 1, prevClk: 0 })
    let result = register4bit([1, 0, 1, 1], 1, prevStates) // capture 1011
    result = register4bit([1, 0, 1, 1], 0, result.prevStates) // falling
    result = register4bit([0, 1, 0, 0], 1, result.prevStates) // capture 0100
    expect(result.bits).toEqual([0, 1, 0, 0])
  })

  it('throws error for invalid bit input', () => {
    const prevStates = Array(4).fill({ q: 0, qBar: 1, prevClk: 0 })
    expect(() => register4bit([1, 2, 0, 1], 1, prevStates))
      .toThrow('Invalid input')
  })
})

//      4-bit Ripple Counter Tests 
describe('4-bit Ripple Counter', () => {

  function clockPulse(states) {
    let r = rippleCounter4bit(0, states)    // falling edge
    r = rippleCounter4bit(1, r.prevStates)  // rising edge
    return r
  }

  it('starts at 0000 with no clock pulse', () => {
    const result = rippleCounter4bit(0)
    expect(result.count).toEqual([0, 0, 0, 0])
  })

  it('counts 0→1→2→3 correctly', () => {
    // fresh start: counter initializes its own correct state
    let result = { prevStates: Array.from(
      { length: 4 },
      () => ({ q: 0, qBar: 1, prevClk: 0 })
    )}

    result = clockPulse(result.prevStates)
    expect(result.count).toEqual([0, 0, 0, 1])  // 1

    result = clockPulse(result.prevStates)
    expect(result.count).toEqual([0, 0, 1, 0])  // 2

    result = clockPulse(result.prevStates)
    expect(result.count).toEqual([0, 0, 1, 1])  // 3
  })

  it('counts up to 7 correctly', () => {
    let result = { prevStates: Array.from(
      { length: 4 },
      () => ({ q: 0, qBar: 1, prevClk: 0 })
    )}

    for (let i = 0; i < 7; i++) {
      result = clockPulse(result.prevStates)
    }
    expect(result.count).toEqual([0, 1, 1, 1])  // 7
  })

  it('counts up to 15 and wraps to 0', () => {
    let result = { prevStates: Array.from(
      { length: 4 },
      () => ({ q: 0, qBar: 1, prevClk: 0 })
    )}

    // 15 pulses → count = 15
    for (let i = 0; i < 15; i++) {
      result = clockPulse(result.prevStates)
    }
    expect(result.count).toEqual([1, 1, 1, 1])  // 15

    // 16th pulse → wraps to 0
    result = clockPulse(result.prevStates)
    expect(result.count).toEqual([0, 0, 0, 0])  // 0 (wrap)
  })

  it('throws error for invalid clock input', () => {
    expect(() => rippleCounter4bit(2))
      .toThrow('Invalid input')
  })
})
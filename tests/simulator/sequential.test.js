
//   Tests for sequential circuits.
 

import { describe, it, expect } from 'vitest'
import {
  srLatch,
  dLatch,
  dFlipFlop,
  tFlipFlop,
} from '../../src/simulator/sequential'

//      SR Latch Tests 
describe('SR Latch', () => {
  it('S=1,R=0 sets Q to 1', () => {
    const state = srLatch(1, 0, { q: 0, qBar: 1 })
    expect(state.q).toBe(1)
    expect(state.qBar).toBe(0)
  })

  it('S=0,R=1 resets Q to 0', () => {
    const state = srLatch(0, 1, { q: 1, qBar: 0 })
    expect(state.q).toBe(0)
    expect(state.qBar).toBe(1)
  })

  it('S=0,R=0 holds previous value of 1', () => {
    const state = srLatch(0, 0, { q: 1, qBar: 0 })
    expect(state.q).toBe(1)
  })

  it('S=0,R=0 holds previous value of 0', () => {
    const state = srLatch(0, 0, { q: 0, qBar: 1 })
    expect(state.q).toBe(0)
  })

  it('S=1,R=1 flags forbidden state', () => {
    const state = srLatch(1, 1, { q: 0, qBar: 1 })
    expect(state.forbidden).toBe(true)
  })

  it('demonstrates memory across sequence', () => {
    // Set 
    let state = srLatch(1, 0, { q: 0, qBar: 1 })
    expect(state.q).toBe(1)

    // Hold
    state = srLatch(0, 0, state)
    expect(state.q).toBe(1)

    // Reset 
    state = srLatch(0, 1, state)
    expect(state.q).toBe(0)

    // Hold reset 
    state = srLatch(0, 0, state)
    expect(state.q).toBe(0)
  })
})

//      D Latch Tests 
describe('D Latch', () => {
  it('captures D=1 when enable=1', () => {
    const state = dLatch(1, 1, { q: 0, qBar: 1 })
    expect(state.q).toBe(1)
  })

  it('captures D=0 when enable=1', () => {
    const state = dLatch(0, 1, { q: 1, qBar: 0 })
    expect(state.q).toBe(0)
  })

  it('holds value when enable=0', () => {
    // D=1, Q should not change
    const state = dLatch(1, 0, { q: 0, qBar: 1 })
    expect(state.q).toBe(0)
  })
})

//      D Flip-Flop Tests 
describe('D Flip-Flop', () => {
  it('captures D=1 on rising clock edge', () => {
    // prevClk=0, clk=1 → rising edge
    const state = dFlipFlop(1, 1, { q: 0, qBar: 1, prevClk: 0 })
    expect(state.q).toBe(1)
  })

  it('captures D=0 on rising clock edge', () => {
    const state = dFlipFlop(0, 1, { q: 1, qBar: 0, prevClk: 0 })
    expect(state.q).toBe(0)
  })

  it('holds value when no rising edge — CLK stays HIGH', () => {
    // prevClk=1, clk=1 → no rising edge
    const state = dFlipFlop(1, 1, { q: 0, qBar: 1, prevClk: 1 })
    expect(state.q).toBe(0)  // D=1 ignored — no edge
  })

  it('holds value when CLK is LOW', () => {
    const state = dFlipFlop(1, 0, { q: 0, qBar: 1, prevClk: 0 })
    expect(state.q).toBe(0)  // D=1 ignored — no rising edge
  })

  it('demonstrates edge-triggered memory sequence', () => {
    let state = { q: 0, qBar: 1, prevClk: 0 }

    // D=1, clock goes HIGH → captures 1
    state = dFlipFlop(1, 1, state)
    expect(state.q).toBe(1)

    // D changes to 0, clock stays HIGH → holds 1
    state = dFlipFlop(0, 1, state)
    expect(state.q).toBe(1)

    // Clock goes LOW → still holds 1
    state = dFlipFlop(0, 0, state)
    expect(state.q).toBe(1)

    // D=0, clock rises again → captures 0
    state = dFlipFlop(0, 1, state)
    expect(state.q).toBe(0)
  })
})

//      T Flip-Flop Tests 
describe('T Flip-Flop', () => {
  it('toggles on rising edge when T=1', () => {
    const state = tFlipFlop(1, 1, { q: 0, qBar: 1, prevClk: 0 })
    expect(state.q).toBe(1)
  })

  it('toggles back on next rising edge', () => {
    let state = { q: 0, qBar: 1, prevClk: 0 }
    state = tFlipFlop(1, 1, state)  // toggle → 1
    state = tFlipFlop(1, 0, state)  // clock goes low
    state = tFlipFlop(1, 1, state)  // toggle → 0
    expect(state.q).toBe(0)
  })

  it('holds when T=0 on rising edge', () => {
    const state = tFlipFlop(0, 1, { q: 1, qBar: 0, prevClk: 0 })
    expect(state.q).toBe(1)  // T=0 means hold
  })
})

 
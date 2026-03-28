
// Implements sequential logic circuits with MEMORY.


import { NOR, NOT } from './gateLogic'

const MAX_ITERATIONS = 1000

//    Input Validator 
//Sequential circuits with invalid inputs produce unpredictable results. Fail loudly rather than silently.
function validateBinaryInputs(inputs) {
  Object.entries(inputs).forEach(([key, value]) => {
    if (![0, 1].includes(value)) {
      throw new Error(
        `Invalid input ${key}=${value}. Must be 0 or 1.`
      )
    }
  })
}

//    SR Latch
/**
 *    ITERATIVE:
 * Feedback circuit — one pass uses stale values.
 * Must iterate until both NOR gates agree (stable state).
 *
 * @param {number} s         
 * @param {number} r         
 * @param {Object} prevState 
 * @returns {{ q, qBar, forbidden, stable }}
 */
export function srLatch(s, r, prevState = { q: 0, qBar: 1 }) {
  validateBinaryInputs({ s, r })

  // forbidden state S=R=1
  if (s === 1 && r === 1) {
    console.warn('SR Latch: S=1, R=1 is FORBIDDEN state')
    return { q: 0, qBar: 0, forbidden: true, stable: false }
  }

  // iterate: feedback requires multiple passes to settle
  let q    = prevState.q
  let qBar = prevState.qBar
  let stable = false

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const newQ    = NOR([r, qBar])
    const newQBar = NOR([s, q])

    // stable only when BOTH gates agree
    if (newQ === q && newQBar === qBar) {
      stable = true
      break
    }

    q    = newQ
    qBar = newQBar
  }

  if (!stable) console.warn('SR Latch: failed to reach stable state')

  return { q, qBar, forbidden: false, stable }
}

//    D Latch 
export function dLatch(d, enable, prevState = { q: 0, qBar: 1 }) {
  validateBinaryInputs({ d, enable })

  if (enable === 0) {
    return { q: prevState.q, qBar: prevState.qBar }
  }

  return {
    q:    d,
    qBar: NOT([d])  
  }
}

//      D Flip-Flop 
/**
 * Edge-triggered — captures D only on rising clock edge.
 * Between edges Q is isolated from D completely.
 * WHY PREV STATE:
 * Rising edge = clock was 0, now is 1.
 * Without prevClk we cannot detect this transition.
 */
export function dFlipFlop(d, clk, prevState = { q: 0, qBar: 1, prevClk: 0 }) {
  validateBinaryInputs({ d, clk })

  // WHY prevClk===0 AND clk===1: rising edge only
  const risingEdge = prevState.prevClk === 0 && clk === 1

  if (risingEdge) {
    return { q: d, qBar: NOT([d]), prevClk: clk }
  }

  return { q: prevState.q, qBar: prevState.qBar, prevClk: clk }
}

//    T Flip-Flop 
export function tFlipFlop(t, clk, prevState = { q: 0, qBar: 1, prevClk: 0 }) {
  validateBinaryInputs({ t, clk })

  const risingEdge = prevState.prevClk === 0 && clk === 1

  if (risingEdge && t === 1) {
    return { q: prevState.qBar, qBar: prevState.q, prevClk: clk }
  }

  return { q: prevState.q, qBar: prevState.qBar, prevClk: clk }
}

//    4-bit Register 
/**
 * 4 D Flip-Flops sharing one clock — synchronized capture.
 * All bits captured simultaneously on rising edge.
 */
export function register4bit(
  d,
  clk,
  prevStates = Array.from({ length: 4 }, () => ({
    q: 0, qBar: 1, prevClk: 0
  }))
) {
  d.forEach((bit, i) => validateBinaryInputs({ [`d${i}`]: bit }))
  validateBinaryInputs({ clk })

  const newStates = d.map((bit, index) =>
    dFlipFlop(bit, clk, prevStates[index])
  )

  return {
    bits:       newStates.map(state => state.q),
    prevStates: newStates
  }
}

// 4-bit Ripple Counter 
/**
 * 4 T Flip-Flops chained — counts 0 to 15 in binary.
 *
 * @param {number}   clk        - Master clock (0 or 1)
 * @param {Object[]} prevStates - 4 independent flip-flop states
 * @returns {{ count, prevStates }}
 */
export function rippleCounter4bit(
  clk,
  prevStates = Array.from({ length: 4 }, () => ({
    q: 0, qBar: 1, prevClk: 0
  }))
) {
  validateBinaryInputs({ clk })

  const newStates = new Array(4)

  newStates[3] = tFlipFlop(1, clk, prevStates[3])
  newStates[2] = tFlipFlop(1, newStates[3].qBar, {
    ...prevStates[2],
    prevClk: prevStates[3].qBar
  })

  newStates[1] = tFlipFlop(1, newStates[2].qBar, {
    ...prevStates[1],
    prevClk: prevStates[2].qBar
  })

  newStates[0] = tFlipFlop(1, newStates[1].qBar, {
    ...prevStates[0],
    prevClk: prevStates[1].qBar
  })

  return {
    count:      newStates.map(state => state.q),
    prevStates: newStates
  }
}
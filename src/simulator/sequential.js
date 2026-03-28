/**
 * sequential.js
 *
 * WHY THIS FILE EXISTS:
 * Implements sequential logic circuits with MEMORY.
 * Output depends on BOTH current inputs AND previous state.
 *
 * KEY FIXES APPLIED:
 * 1. SR Latch uses correct NOR formula:
 *    Q = NOR(R, Q_bar)  and  Q_bar = NOR(S, Q)
 * 2. Ripple Counter uses separate state objects (no shared references)
 * 3. Ripple Counter bit ordering corrected — index 3 is LSB
 * 4. Initial prevClk set correctly for chained counter stages
 */

import { NOR, NOT } from './gateLogic'

const MAX_ITERATIONS = 1000

// ─── Input Validator ──────────────────────────────────────────────────────────
/**
 * WHY: Sequential circuits with invalid inputs produce
 * unpredictable results. Fail loudly rather than silently.
 */
function validateBinaryInputs(inputs) {
  Object.entries(inputs).forEach(([key, value]) => {
    if (![0, 1].includes(value)) {
      throw new Error(
        `Invalid input ${key}=${value}. Must be 0 or 1.`
      )
    }
  })
}

// ─── SR Latch ─────────────────────────────────────────────────────────────────
/**
 * WHY SR LATCH:
 * Simplest memory element — two cross-coupled NOR gates.
 *
 * CORRECT NOR FORMULA:
 * Q     = NOR(R, Q_bar)  ← R input + feedback from Q_bar
 * Q_bar = NOR(S, Q)      ← S input + feedback from Q
 *
 * WHY THIS ORDER:
 * When S=1: NOR(S=1, Q) = 0 → Q_bar=0 → NOR(R=0, Q_bar=0) = 1 → Q=1 ✓
 * When R=1: NOR(R=1, Q_bar) = 0 → Q=0 → NOR(S=0, Q=0) = 1 → Q_bar=1 ✓
 *
 * WHY ITERATIVE:
 * Feedback circuit — one pass uses stale values.
 * Must iterate until both NOR gates agree (stable state).
 *
 * @param {number} s         - Set input (0 or 1)
 * @param {number} r         - Reset input (0 or 1)
 * @param {Object} prevState - Previous { q, qBar }
 * @returns {{ q, qBar, forbidden, stable }}
 */
export function srLatch(s, r, prevState = { q: 0, qBar: 1 }) {
  validateBinaryInputs({ s, r })

  // WHY detect forbidden first: S=R=1 never stabilizes
  if (s === 1 && r === 1) {
    console.warn('SR Latch: S=1, R=1 is FORBIDDEN state')
    return { q: 0, qBar: 0, forbidden: true, stable: false }
  }

  // WHY iterate: feedback requires multiple passes to settle
  let q    = prevState.q
  let qBar = prevState.qBar
  let stable = false

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    // CORRECT FORMULA:
    // Q     = NOR(R, Q_bar) ← R controls reset, Q_bar is feedback
    // Q_bar = NOR(S, Q)     ← S controls set,   Q is feedback
    const newQ    = NOR([r, qBar])
    const newQBar = NOR([s, q])

    // WHY check both: stable only when BOTH gates agree
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

// ─── D Latch ──────────────────────────────────────────────────────────────────
/**
 * WHY D LATCH:
 * Eliminates forbidden state by making R = NOT(D).
 * S and R can never both be 1 simultaneously.
 *
 * Enable=1 → transparent (follows D)
 * Enable=0 → opaque (holds value)
 */
export function dLatch(d, enable, prevState = { q: 0, qBar: 1 }) {
  validateBinaryInputs({ d, enable })

  if (enable === 0) {
    return { q: prevState.q, qBar: prevState.qBar }
  }

  return {
    q:    d,
    qBar: NOT([d])  // WHY NOT([d]): consistent with gate layer
  }
}

// ─── D Flip-Flop ──────────────────────────────────────────────────────────────
/**
 * WHY D FLIP-FLOP:
 * Edge-triggered — captures D only on rising clock edge.
 * Between edges Q is isolated from D completely.
 *
 * WHY prevClk in state:
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

  // WHY update prevClk even when holding:
  // Must track transitions accurately for next evaluation
  return { q: prevState.q, qBar: prevState.qBar, prevClk: clk }
}

// ─── T Flip-Flop ──────────────────────────────────────────────────────────────
/**
 * WHY T FLIP-FLOP:
 * Toggles output on every rising edge when T=1.
 * Primary use: binary counters — each stage divides clock by 2.
 */
export function tFlipFlop(t, clk, prevState = { q: 0, qBar: 1, prevClk: 0 }) {
  validateBinaryInputs({ t, clk })

  const risingEdge = prevState.prevClk === 0 && clk === 1

  if (risingEdge && t === 1) {
    // WHY swap q and qBar: toggle = complement the output
    return { q: prevState.qBar, qBar: prevState.q, prevClk: clk }
  }

  return { q: prevState.q, qBar: prevState.qBar, prevClk: clk }
}

// ─── 4-bit Register ───────────────────────────────────────────────────────────
/**
 * WHY 4-BIT REGISTER:
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

// ─── 4-bit Ripple Counter ─────────────────────────────────────────────────────
/**
 * WHY RIPPLE COUNTER:
 * 4 T Flip-Flops chained — counts 0 to 15 in binary.
 *
 * BIT ORDERING: index 0 = MSB, index 3 = LSB
 *
 * WHY index 3 clocked by master:
 * LSB toggles fastest — must respond to every master clock pulse.
 *
 * WHY Q_bar as next stage clock:
 * Q_bar transitions 0→1 when Q transitions 1→0
 * Creates correct binary counting sequence.
 *
 * WHY WE COMPUTE EACH STAGE'S CLOCK SEPARATELY:
 * Chained stages receive Q_bar of previous stage as their clock.
 * We must pass the CURRENT Q_bar as the clock value,
 * and the PREVIOUS Q_bar as the prevClk for edge detection.
 * This makes the counter robust regardless of initial prevStates.
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

  // WHY index 3 first: LSB clocked directly by master clock
  newStates[3] = tFlipFlop(1, clk, prevStates[3])

  // WHY use prevStates[n].qBar as prevClk for each chained stage:
  // The chained stage's clock IS the previous stage's Q_bar.
  // Its previous clock value IS the previous stage's previous Q_bar.
  // We reconstruct correct prevClk from the previous stage's prevState
  // so edge detection works correctly regardless of caller's initial state.
  newStates[2] = tFlipFlop(1, newStates[3].qBar, {
    ...prevStates[2],
    // WHY recompute prevClk: it must match what the clock WAS last cycle
    // Previous clock for this stage = qBar of stage 3 in previous cycle
    // qBar of stage 3 in previous cycle = prevStates[3].qBar
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
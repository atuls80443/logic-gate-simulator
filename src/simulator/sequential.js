
// Implements sequential logic circuits — circuits with MEMORY.


import { NOR, NAND, NOT, AND } from './gateLogic'

//      SR Latch 
/**
 *
 * WHY NOR gates specifically:
 * NOR output is 0 when ANY input is 1.
 * Cross-coupling creates the bistable feedback.
 * NAND gates create an SR Latch too but with
 * inverted inputs (active LOW instead of active HIGH).
 *
 * @param {number} s         - Set input
 * @param {number} r         - Reset input
 * @param {Object} prevState - Previous { q, qBar } state
 * @returns {{ q, qBar, forbidden }}
 */
export function srLatch(s, r, prevState = { q: 0, qBar: 1 }) {
  
    // Forbidden State Detection 
  if (s === 1 && r === 1) {
    console.warn('SR Latch: S=1, R=1 is FORBIDDEN state')
    return {
      q:         0,
      qBar:      0,
      forbidden: true   
    }
  }

  // Hold State 
  if (s === 0 && r === 0) {
    return {
      q:         prevState.q,
      qBar:      prevState.qBar,
      forbidden: false
    }
  }

  // Set State 
  if (s === 1 && r === 0) {
    return { q: 1, qBar: 0, forbidden: false }
  }

  // Reset State 
  if (s === 0 && r === 1) {
    return { q: 0, qBar: 1, forbidden: false }
  }

  // fallback — should never reach here
  return prevState
}

//      D Latch 
/**
 * @param {number} d         - Data input
 * @param {number} enable    - Enable signal (1=transparent, 0=hold)
 * @param {Object} prevState - Previous { q, qBar }
 * @returns {{ q, qBar }}
 */

export function dLatch(d, enable, prevState = { q: 0, qBar: 1 }) {

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
 * @param {number} d         
 * @param {number} clk       
 * @param {Object} prevState 
 * @returns {{ q, qBar, prevClk }}
 */

export function dFlipFlop(d, clk, prevState = { q: 0, qBar: 1, prevClk: 0 }) {
  
    // Rising Edge Detection 
  const risingEdge = prevState.prevClk === 0 && clk === 1

  if (risingEdge) {
    // Capture D on rising clock edge
    return {
      q:       d,
      qBar:    NOT([d]),
      prevClk: clk      // remember current clock for next comparison
    }
  }

  // Hold State 
  return {
    q:       prevState.q,
    qBar:    prevState.qBar,
    prevClk: clk  // still update prevClk for next comparison
  }
}

//      T Flip-Flop
/**
 * @param {number} t         
 * @param {number} clk       
 * @param {Object} prevState 
 * @returns {{ q, qBar, prevClk }}
 */

export function tFlipFlop(t, clk, prevState = { q: 0, qBar: 1, prevClk: 0 }) {
  const risingEdge = prevState.prevClk === 0 && clk === 1

  if (risingEdge) {
    if (t === 1) {
      return {
        q:       prevState.qBar,  // toggle — new Q = old Q_bar
        qBar:    prevState.q,     // new Q_bar = old Q
        prevClk: clk
      }
    } else {
      return {
        q:       prevState.q,
        qBar:    prevState.qBar,
        prevClk: clk
      }
    }
  }

  return {
    q:       prevState.q,
    qBar:    prevState.qBar,
    prevClk: clk
  }
}


/**
 * Implements combinational circuits built from basic logic gates.
 * These are higher-level abstractions on top of gateLogic.js.
 */

import { AND, OR, NOT, XOR, NAND, NOR } from './gateLogic'

//      Half Adder 
export function halfAdder(a, b) {
  return {
    sum:   XOR([a, b]),  
    carry: AND([a, b]),  
  }
}

//      Full Adder
export function fullAdder(a, b, cin) {
  const { sum: sum1, carry: carry1 } = halfAdder(a, b)

  const { sum: sum2, carry: carry2 } = halfAdder(sum1, cin)

  return {
    sum:  sum2,                  
    cout: OR([carry1, carry2]),  
  }
}

//      2-to-1 Multiplexer 

export function mux2to1(d0, d1, s) {
  // WHY NOT(s) in array: NOT takes an array input
  const notS = NOT([s])

  // When S=0: AND(D0, 1) = D0 passes through
  const term0 = AND([d0, notS])

  // When S=1: AND(D1, 1) = D1 passes through
  const term1 = AND([d1, s])

  // OR combines both terms — only one is ever non-zero
  return {
    output: OR([term0, term1])
  }
}

//      2-to-4 Decoder 

export function decoder2to4(a, b) {
  // WHY compute complements first:
  // Reused in multiple output expressions
  // Computing once avoids redundant NOT calls
  const notA = NOT([a])
  const notB = NOT([b])

  return {
    y0: AND([notA, notB]),  // both LOW  → Y0
    y1: AND([notA, b]),     // A LOW, B HIGH → Y1
    y2: AND([a, notB]),     // A HIGH, B LOW → Y2
    y3: AND([a, b]),        // both HIGH → Y3
  }
}

